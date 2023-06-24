import { Injectable } from "@angular/core";
import { BigNumber, ethers } from 'ethers';
import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { StorageKeys } from "src/app/core/constants/storage-keys";
import { environment } from "src/environments/environment";
import { FactoryAbi } from '../../core/constants/abis/factory-abi';
import { arrayify, concat, hexDataSlice, keccak256 } from "ethers/lib/utils";
import detectEthereumProvider from '@metamask/detect-provider';
import { WalletAbi } from '../../core/constants/abis/wallet-abi';

@Injectable()
export class CreateWalletService{
    provider: any;
    constructor(private authService: SocialAuthService) {
        this.provider = new ethers.providers.JsonRpcProvider(environment.rpcProviderUrl);
      }

    async createWallet(): Promise<string> {
        const fbId = await this.getFbId();
    
        const ownerPk = this.getOwnerPk('fb', fbId);
        const ownerWallet = new ethers.Wallet(ownerPk, this.provider);
    
        const facrotySC = new ethers.Contract(environment.factorySC, FactoryAbi, ownerWallet);
    
        const args = [
          environment.entrypointSC,
          ownerWallet.address,
          172800,
          ethers.utils.keccak256(ethers.utils.hexlify(BigNumber.from(fbId)))
        ];
    
        const wa = await facrotySC['getWalletAddress'](...args);
        localStorage.setItem(StorageKeys.walletAddress, wa);
    
        return wa;
      }

    private getFbId(): Promise<string> {
        return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
          localStorage.setItem(StorageKeys.fbId, user.id);
          return user.id;
        });
      }

    private getOwnerPk(app: string, id: string): any {
        let pk = localStorage.getItem(StorageKeys.ownerPk);
        if (!pk) {
          const entropy = arrayify(hexDataSlice(keccak256(concat([
            ethers.utils.hexlify(ethers.utils.toUtf8Bytes(app)),
            ethers.utils.hexlify(ethers.utils.toUtf8Bytes(id)),
            ethers.utils.hexlify(ethers.utils.toUtf8Bytes(environment.fbAppId)),
            ethers.utils.hexlify(1),
          ])), 0, 16));
    
          const mnemonic = ethers.utils.entropyToMnemonic(entropy);
    
          const wallet = ethers.Wallet.fromMnemonic(mnemonic);
          localStorage.setItem(StorageKeys.ownerPk, wallet.privateKey);
          return wallet.privateKey;
        }
    
        return pk;
    }

    async restoreWallet(walletAddress: string): Promise<any> {
        const metamask = await detectEthereumProvider();
        if (!metamask) {
            throw new Error('Metamask is not installed');
        }
        const provider = new ethers.providers.Web3Provider(metamask);
        await provider.send('eth_requestAccounts', []);
        const walletSC = new ethers.Contract(walletAddress, WalletAbi, provider.getSigner());

        const recoveryHash = await walletSC['getRecoveryHash'](
            [provider.getSigner().getAddress()],
            provider.getSigner().getAddress(),
            1,
            walletSC['nonce']()
        );

        const confirmResponse = await walletSC['confirmRecovery'](recoveryHash);
        await confirmResponse.wait();
        }

    async executeRestore(walletAddress: string) {
        const metamask = await detectEthereumProvider();
        if (!metamask) {
            throw new Error('Metamask is not installed');
        }
        const provider = new ethers.providers.Web3Provider(metamask);
        await provider.send('eth_requestAccounts', []);
        const walletSC = new ethers.Contract(walletAddress, WalletAbi, provider.getSigner());
    
        const executeResponse = await walletSC['executeRecovery'](provider.getSigner().getAddress());
        return await executeResponse.wait();
        }
}