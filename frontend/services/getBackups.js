'use client';

import abi from './module.abi.json';
import { wingmanModuleAddress, publicClient } from './consts';

export async function getBackups(ownerAddress) {
  try {
    const backups = await publicClient.readContract({
      address: wingmanModuleAddress,
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
