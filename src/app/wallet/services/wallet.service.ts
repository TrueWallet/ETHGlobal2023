import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ethers } from 'ethers';
import { StorageKeys } from 'src/app/core/constants/storage-keys';
import { WalletAbi } from 'src/app/core/constants/abis/wallet-abi';

@Injectable()
export class WalletService {
  walletOwner: ethers.Wallet;

  protected readonly provider: any;
  protected readonly walletSC: ethers.Contract;

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
}
