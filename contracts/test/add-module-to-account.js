import {
    ENTRYPOINT_ADDRESS_V07,
    createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
    createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import { createPublicClient, http, encodePacked } from "viem";
import { sepolia } from "viem/chains";
import {generatePrivateKey, privateKeyToAccount} from "viem/accounts";
import {erc7579Actions} from "permissionless/actions/erc7579.js";
import {pimlicoPaymasterActions} from "permissionless/actions/pimlico";
import {abi} from "./abi";

const apiKey = ""

const privateKey = generatePrivateKey()

export const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`

const signer = privateKeyToAccount(privateKey);


const publicClient = createPublicClient({
    transport: http("https://rpc.ankr.com/eth_sepolia"),
})

const pimlicoBundlerClient = createPimlicoBundlerClient({
    transport: http(bundlerUrl),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));

const safeAccount = await signerToSafeSmartAccount(publicClient, {
    signer,
    safeVersion: "1.4.1",
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2",
    erc7579LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE",
})

const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: sepolia,
    bundlerTransport: http(bundlerUrl),
    middleware: {
        gasPrice: async () => {
            return (await pimlicoBundlerClient.getUserOperationGasPrice()).fast
        },
        sponsorUserOperation: pimlicoBundlerClient.sponsorUserOperation

    },
}).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))

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
}

installModule({
    smartClient: smartAccountClient,
    beneficiaryAddress: beneficiary.address,
    timeout,
    moduleType: "validator",
    hook: '0x',
    account: safeAccount,
    bundlerClient: pimlicoBundlerClient,
    moduleAddress: "0x6A53E204b8A21dfD64516ff27484e6113640CB96",
    publicClient
})