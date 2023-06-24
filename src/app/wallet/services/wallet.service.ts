import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {BigNumber, ethers} from 'ethers';
import { StorageKeys } from 'src/app/core/constants/storage-keys';
import { WalletAbi } from 'src/app/core/constants/abis/wallet-abi';
import {WalletState} from "../constants/wallet-state";
import {FactoryAbi} from "../../core/constants/abis/factory-abi";
import {Client, UserOperationBuilder} from "userop";
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

  constructor() {
    const pk = localStorage.getItem(StorageKeys.ownerPk);
    this.provider = new ethers.providers.JsonRpcProvider(environment.rpcProviderUrl);

    this.walletOwner = new ethers.Wallet(<string>pk, this.provider);
    console.log('Owner', this.walletOwner.address);

    const walletAddress = localStorage.getItem(StorageKeys.walletAddress);
    this.walletSC = new ethers.Contract(<string>walletAddress, WalletAbi, this.walletOwner);
    this.factorySC = new ethers.Contract(environment.factorySC, FactoryAbi, this.walletOwner);
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

  async isDeployed(): Promise<WalletState> {
    const code = await this.provider.getCode(this.walletSC.address);
    return code !== '0x' ? WalletState.READY : WalletState.NEED_DEPLOY;
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
}
