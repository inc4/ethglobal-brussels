import {generatePrivateKey, privateKeyToAccount} from "viem/accounts";
import {pimlicoBundlerClient, publicClient, safeAccount, smartAccountClient} from "./smart-account.js";
import {abi} from "./abi.js";
import {encodePacked} from "viem";

const privateKey = generatePrivateKey()

const beneficiary = privateKeyToAccount(privateKey);
const timeout = 100; //in seconds

async function installModule({smartClient, beneficiaryAddress, timeout, moduleType, hook, account, bundlerClient, moduleAddress, publicClient}) {
    const isInitialized = (await publicClient.readContract({
        address: moduleAddress,
        abi,
        functionName: 'isInitialized',
        args: [account.address],
    }))

    const module = {
        module: moduleAddress,
        initData: isInitialized
            ? '0x'
            : encodePacked(['address', 'uint48'], [beneficiaryAddress, timeout]),
        deInitData: '0x',
        additionalContext: '0x',
        type: moduleType,
        hook,
    }


    const opHash = await smartClient.installModule({
        type: module.type,
        address: module.module,
        context: module.initData,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: opHash })
    console.log('receipt', receipt)
}

installModule({
    smartClient: smartAccountClient,
    beneficiaryAddress: beneficiary.address,
    timeout,
    moduleType: "validator",
    hook: '0x',
    account: safeAccount,
    bundlerClient: pimlicoBundlerClient,
    moduleAddress: "0xab614e4a5398bb2a2a0bf73f9c913ec7ff47d81f", //deadmanswitch module address
    publicClient
})
