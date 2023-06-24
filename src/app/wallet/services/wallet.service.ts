import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {BigNumber, ethers} from 'ethers';
import { StorageKeys } from 'src/app/core/constants/storage-keys';
import { WalletAbi } from 'src/app/core/constants/abis/wallet-abi';
import {WalletState} from "../constants/wallet-state";
import {FactoryAbi} from "../../core/constants/abis/factory-abi";
import {Client, Presets, UserOperationBuilder} from "userop";
import {EntrypointAbi} from "../../core/constants/abis/entrypoint-abi";
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util';
import { Buffer } from 'buffer';
import {arrayify} from "ethers/lib/utils";
import {erc20Abi} from "../../core/constants/abis/erc20-abi";

// @ts-ignore
window.Buffer = Buffer;

@Injectable()
export class WalletService {
  walletOwner: ethers.Wallet;

  protected readonly provider: any;
  protected readonly walletSC: ethers.Contract;
  protected readonly factorySC: ethers.Contract;

  get walletAddress(): string {
    return this.walletSC.address;
  }

  constructor(
    private snackBar: MatSnackBar
  ) {
    const pk = localStorage.getItem(StorageKeys.ownerPk);
    this.provider = new ethers.providers.JsonRpcProvider(environment.rpcProviderUrl);

    this.walletOwner = new ethers.Wallet(<string>pk, this.provider);
    console.log('Owner', this.walletOwner.address);

    const walletAddress = localStorage.getItem(StorageKeys.walletAddress);
    this.walletSC = new ethers.Contract(<string>walletAddress, WalletAbi, this.walletOwner);
    this.factorySC = new ethers.Contract(environment.factorySC, FactoryAbi, this.walletOwner);

    this.checkOwner();
  }

  async checkOwner(): Promise<any> {
    const owner = await this.walletSC['owner']();
    if (owner.toLowerCase() !== this.walletOwner.address.toLowerCase()) {
      localStorage.clear();
      this.snackBar.open("You are not the owner anymore.")
    }
  }

  async addGuardian(guardian: string): Promise<any> {
    const owner = await this.walletSC['owner']();
    console.log('Wallet SC Owner', owner);

    const response = await this.walletSC['addGuardianWithThreshold']([guardian], 1, {gasLimit: 1_000_000});
    return await response.wait();
  }

  async getGuardians(): Promise<any[]> {
    const guardians = await this.walletSC['getGuardians']();

    return Promise.all(guardians.map(async (guardian: string) => {
      const hash = await this.walletSC['getRecoveryHash']([guardian], guardian, 1, 1);
      const requested = await this.walletSC['isConfirmedByGuardian'](guardian, hash);
      const executed = await this.walletSC['isExecuted'](hash);

      const scOwner = await this.walletSC['owner']();

      return {guardian, hash, requested, executed};
    }));
  }

  async cancelGuardian(item: any): Promise<any> {
    const owner = await this.walletSC['owner']();

    console.log('Wallet SC Owner', owner);

    const response = await this.walletSC['cancelRecovery'](item.hash, {gasLimit: 1_000_000});
    return response.wait();
  }

  async isDeployed(): Promise<WalletState> {
    const code = await this.provider.getCode(this.walletSC.address);
    return code !== '0x' ? WalletState.READY : WalletState.NEED_DEPLOY;
  }


  async getNativeBalance(): Promise<string> {
    const balance =  await this.provider.getBalance(this.walletSC.address);
    return ethers.utils.formatEther(balance.toString());
  }

  async deployWallet(): Promise<any> {
    const client = await Client.init(environment.stackupProviderUrl, {entryPoint: environment.entrypointSC});

    const walletAddress = localStorage.getItem(StorageKeys.walletAddress);
    const fbId = localStorage.getItem(StorageKeys.fbId);

    const args = [
      this.factorySC.address,
      environment.entrypointSC,
      this.walletOwner.address,
      172800,
      ethers.utils.keccak256(ethers.utils.hexlify(BigNumber.from(fbId)))
    ];

    const builder = new UserOperationBuilder().useDefaults({
      sender: <string>walletAddress,
      callGasLimit: 2_000_000,
      verificationGasLimit: 1_500_000,
      preVerificationGas: 1_000_000,
      maxFeePerGas: 1_000_105_660,
      maxPriorityFeePerGas: 1_000_000_000,
    });


    const initCode = await this.factorySC['getInitCode'](...args);
    builder.setInitCode(initCode);

    const entrypointSC = new ethers.Contract(environment.entrypointSC, EntrypointAbi, this.walletOwner);

    const message = await entrypointSC['getUserOpHash'](builder.getOp());
    const msg1 = Buffer.concat([
      Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
      Buffer.from(arrayify(message))
    ])

    const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(this.walletOwner.privateKey)))
    // that's equivalent of:  await signer.signMessage(message);
    // (but without "async"
    const signature = toRpcSig(sig.v, sig.r, sig.s);
    builder.setSignature(signature);

    console.log(builder);

    const response = await client.sendUserOperation(builder);
    console.log('response', response);
    try {
      const data = await response.wait();
      return data;
    } catch (error) {
      console.log(error)
    }
    
  }

  async getBalancesERC20(supportedERC20: any[]): Promise<any> {
    return Promise.all(supportedERC20.map(async (erc20) => {
      const contract = new ethers.Contract(erc20.address, erc20Abi, this.walletOwner);
      const balance = await contract['balanceOf'](this.walletSC.address);
      return { ...erc20, balance: ethers.utils.formatUnits(balance, erc20.decimals) };
    }));
  }

  async sendNative(data: {to: string, amount: string, selectedFee: string}): Promise<any> {
    const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
      environment.stackuPaymasterConfig.rpcUrl,
      environment.stackuPaymasterConfig.context,
    );

    const sa = await Presets.Builder.SimpleAccount.init(
      this.walletOwner,
      environment.stackupProviderUrl,
      { paymasterMiddleware }
    )
    const client = await Client.init(environment.stackupProviderUrl);

    const target = ethers.utils.getAddress(data.to);
    const value = ethers.utils.parseEther(data.amount);
    const res = await client.sendUserOperation(
      sa.execute(target, value, "0x"),
      {
        dryRun: false,
        onBuild: (op) => console.log("Signed UserOperation:", op),
      }
    );

    return await res.wait();
  }

  async sendERC20(coin: any, data: { amount: string; to: string; selectedFee: string }) {
    const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
      environment.stackuPaymasterConfig.rpcUrl,
      environment.stackuPaymasterConfig.context,
    );

    const op = new UserOperationBuilder().useMiddleware(paymasterMiddleware).useDefaults({
      sender: ethers.utils.getAddress(this.walletSC.address),
      preVerificationGas: 100_000,
      maxFeePerGas: 1_000_105_660,
    });

    const coinSC = new ethers.Contract(coin.address, erc20Abi, this.walletOwner);
    const callData = this.walletSC.interface.encodeFunctionData("execute", [
      coin.address,
      ethers.constants.Zero,
      coinSC.interface.encodeFunctionData("transfer", [
        data.to,
        ethers.utils.parseUnits(data.amount, coin.decimals)
      ])
    ]);
    op.setCallData(callData);


    const entrypointSC = new ethers.Contract(environment.entrypointSC, EntrypointAbi, this.walletOwner);
    const message = await entrypointSC['getUserOpHash'](op.getOp());
    const msg1 = Buffer.concat([
      Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
      Buffer.from(arrayify(message))
    ])

    const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(this.walletOwner.privateKey)))
    // that's equivalent of:  await signer.signMessage(message);
    // (but without "async"
    const signature = toRpcSig(sig.v, sig.r, sig.s);
    op.setSignature(signature);

    const nonce = await this.provider.getTransactionCount(this.walletSC.address);
    op.setNonce(nonce);

    const currOp = op.getOp();

    const arr = [[
      currOp.sender,
      currOp.nonce,
      currOp.initCode,
      currOp.callData,
      currOp.callGasLimit,
      currOp.verificationGasLimit,
      currOp.preVerificationGas,
      currOp.maxFeePerGas,
      currOp.maxPriorityFeePerGas,
      currOp.paymasterAndData,
      currOp.signature
    ]];

    const client = await Client.init(environment.stackupProviderUrl);
    const res = await client.sendUserOperation(
      op,
      {
        dryRun: false,
        onBuild: (op) => console.log("Signed UserOperation:", op),
      }
    );
    return await res.wait();
  }

  async getERC20Balance(coin: any): Promise<string> {
    const contract = new ethers.Contract(coin.address, erc20Abi, this.walletOwner);
    const balance =  await contract['balanceOf'](this.walletSC.address);
    return ethers.utils.formatUnits(balance, coin.decimals);
  }
}
