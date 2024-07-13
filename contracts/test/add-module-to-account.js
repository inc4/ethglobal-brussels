import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { abi } from "./abi";
import { createSmartWallet } from "./create-smart-account";

const beneficiaryPK = generatePrivateKey();

const timeout = 123123123;
const beneficiary = privateKeyToAccount(beneficiaryPK);

async function installModule({smartClient, beneficiaryAddress, timeout, moduleType, hook, account, bundlerClient, moduleAddress, publicClient}) {
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

const { smartAccountClient, safeAccount, pimlicoBundlerClient, publicClient } = await createSmartWallet({
    privateKey: "<PK>",
    bundlerUrl: "https://api.pimlico.io/v2/sepolia/rpc?apikey=<API_KEY>"
})

installModule({
    smartClient: smartAccountClient,
    beneficiaryAddress: beneficiary.address,
    timeout,
    moduleType: "executor",
    hook: '0x',
    account: safeAccount,
    bundlerClient: pimlicoBundlerClient,
    moduleAddress: "0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492",
    publicClient
});

