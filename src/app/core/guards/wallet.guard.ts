import { CanActivateFn, Router } from '@angular/router';
import { StorageKeys } from '../constants/storage-keys';
import { inject } from '@angular/core';

export const walletGuard: CanActivateFn = (route, state) => {
  const address = localStorage.getItem(StorageKeys.walletAddress);
  const owner = localStorage.getItem(StorageKeys.ownerPk);
  const router = inject(Router);
  return !!address && !!owner || router.parseUrl('/create')
};
