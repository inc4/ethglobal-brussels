import fs from 'fs';
import { publicClient } from './clients.js';
import { execBackup } from './executor.js';
import { CronJob } from 'cron';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const abi = JSON.parse(fs.readFileSync('./abi.json', 'utf8')).abi;

async function getAllUsers() {
    let users = [];
    let index = 0;

    while (true) {
        try {
            const user = await publicClient.readContract({
                address: process.env.MODULE_ADDRESS,
                abi,
                functionName: 'users',
                args: [index],
            });

            console.log('USER', user);
            users.push(user);
            index++;
        } catch (e) {
            console.log('No more users found, stopping search.');
            break;
        }
    }

    return users;
}

async function execBackups() {
    try {
        const users = await getAllUsers();
        console.log('Users:', users);

        for (const user of users) {
            try {
                const userBackupsNames = await publicClient.readContract({
                    address: process.env.MODULE_ADDRESS,
                    abi,
                    functionName: 'getBackups',
                    args: [user],
                });

                for (const backupName of userBackupsNames) {
                    try {
                        const fullBackup = await publicClient.readContract({
                            address: process.env.MODULE_ADDRESS,
                            abi,
                            functionName: 'getBackup',
                            args: [user, backupName],
                        });

                        if (fullBackup.unlockAt <= Math.floor(Date.now() / 1000)) {
                            console.log(`Executing backup for user ${user} with name ${backupName}`);
                            await execBackup({ owner: user, name: backupName });
                        }
                    } catch (e) {
                        console.error(`Error fetching or executing backup for user ${user} and backup ${backupName}:`, e);
                        if (e.name !== 'WaitForUserOperationReceiptTimeoutError') {
                            throw e;
                        }
                    }
                }
            } catch (e) {
                console.error(`Error fetching backups for user ${user}:`, e);
            }
        }
    } catch (e) {
        console.error('Error during execBackups:', e);
        process.exit(1); // Terminate process with error code
    }
}

new CronJob('*/30 * * * *', execBackups).start();

execBackups()
    .then((res) => console.log('Initial execution complete:', res))
    .catch((err) => console.error('Error during initial execution:', err));
