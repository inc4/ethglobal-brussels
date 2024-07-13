import {
    ENTRYPOINT_ADDRESS_V07,
    createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { erc7579Actions } from "permissionless/actions/erc7579.js";
import { pimlicoPaymasterActions } from "permissionless/actions/pimlico";


export async function createSmartWallet({privateKey, bundlerUrl}) {
    const signer = privateKeyToAccount(privateKey);


    const publicClient = createPublicClient({
        transport: http("https://rpc.ankr.com/eth_sepolia"),
    });

    const paymasterClient = createPimlicoPaymasterClient({
	transport: http(bundlerUrl),
	entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    const pimlicoBundlerClient = createPimlicoBundlerClient({
        transport: http(bundlerUrl),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

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
            sponsorUserOperation: paymasterClient.sponsorUserOperation,
            gasPrice: async () => (await pimlicoBundlerClient.getUserOperationGasPrice()).fast
        },
    });

    return { smartAccountClient, safeAccount, pimlicoBundlerClient, publicClient }
}

const { safeAccount } = await createSmartWallet({
    privateKey: process.env.PK,
    bundlerUrl: "https://api.pimlico.io/v2/sepolia/rpc?apikey=" + process.env.PIMLICO_API_KEY,
});
console.log(safeAccount);
console.log("Safe account address:", safeAccount.address);
