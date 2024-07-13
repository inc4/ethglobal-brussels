import {parseAccount, sendUserOperation} from "permissionless";
import {generateBackupAbiWithArgs} from "./backup-abi";
import {createSmartWallet} from "./create-smart-account";

async function updateBackup({
    smartClient,
    accountAddress,
    moduleAddress,
    name,
    unlockAt,
    beneficiaries,
    bundlerClient
}) {
    const account = parseAccount(accountAddress);

    const updateBackupCallData = account.encodeFunctionData(
        generateBackupAbiWithArgs({name, unlockAt, beneficiaries})
    );

    const opHash = await smartClient.sendUserOperation({
        sender: account.address,
        updateBackupCallData,
        to: moduleAddress
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: opHash });
    return receipt;
}

async function main({
    name,
    unlockAt,
    beneficiaries
}) {
    const {
        smartAccountClient,
        safeAccount,
        pimlicoBundlerClient
    } = createSmartWallet({
        privateKey: "<PK>",
        bundlerUrl: "<bundler url>",
    });

    await updateBackup({
        smartClient: smartAccountClient,
        accountAddress: safeAccount.address,
        moduleAddress: "0xab614e4a5398bb2a2a0bf73f9c913ec7ff47d81f",
        name,
        unlockAt,
        beneficiaries,
        bundlerClient: pimlicoBundlerClient
    });

    console.log("Backup updated successfully!");
}

main({
    name: "name",
    unlockAt: 1231231233,
    beneficiaries: [
        {
            account: "0xAddress1",
            percentage: 50,
            amount: BigInt(1000)
        },
        {
            account: "0xAddress2",
            percentage: 50,
            amount: BigInt(1000)
        }
    ]
})
