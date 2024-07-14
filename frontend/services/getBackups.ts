'use client';

import abi from './module.abi.json';
import { publicClient } from './consts';

export async function getBackups(ownerAddress: string) {
  try {
    console.log(ownerAddress);
    const backups = await publicClient.readContract({
      address: '0xe7cc409a0f550d371b7103b804cc02a0b56d60e1',
      abi,
      functionName: 'getBackups',
      args: [ownerAddress],
    });

    console.log('Backups:', backups);

    return backups;
  } catch (error) {
    console.error('Error fetching backups:', error);
    throw error;
  }
}

export async function getBackup(ownerAddress: string, backupName: string) {
  try {
    console.log(ownerAddress, backupName);
    const backup = await publicClient.readContract({
      address: '0xe7cc409a0f550d371b7103b804cc02a0b56d60e1',
      abi,
      functionName: 'getBackup',
      args: [ownerAddress, backupName],
    });

    console.log('Backup:', backup);

    return backup;
  } catch (error) {
    console.error('Error fetching backup:', error);
    throw error;
  }
}
