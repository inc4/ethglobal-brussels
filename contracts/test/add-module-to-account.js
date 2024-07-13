import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { abi } from "./abi";
import { createSmartWallet } from "./create-smart-account";

const beneficiaryPK = generatePrivateKey();

const timeout = 123123123;
const beneficiary = privateKeyToAccount(beneficiaryPK);

async function installModule({smartClient, beneficiaryAddress, timeout, moduleType, hook, account, bundlerClient, moduleAddress, publicClient}) {
    const isInitialized = (await publicClient.readContract({
        address: moduleAddress,
        abi,
        functionName: 'isInitialized',
        args: [account.address],
    }))

    const module = {
        module: moduleAddress,
        initData: '0x',
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
}

const { smartAccountClient, safeAccount, pimlicoBundlerClient, publicClient } = createSmartWallet({
    privateKey: "<PK>",
    bundlerUrl: "<bundlerUrl>"
})

installModule({
    smartClient: smartAccountClient,
    beneficiaryAddress: beneficiary.address,
    timeout,
    moduleType: "validator", //todo: executor
    hook: '0x',
    account: safeAccount,
    bundlerClient: pimlicoBundlerClient,
    moduleAddress: "0x6A53E204b8A21dfD64516ff27484e6113640CB96",
    publicClient
});

