import {
    ENTRYPOINT_ADDRESS_V07,
    createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
    createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import { createPublicClient, getContract, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount("");

export const publicClient = createPublicClient({
    transport: http("https://rpc.ankr.com/eth_sepolia"),
});

export const pimlicoBundlerClient = createPimlicoBundlerClient({
    transport: http("https://api.pimlico.io/v2/sepolia/rpc?apikey="),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
});

export const safeAccount = await signerToSafeSmartAccount(publicClient, {
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    signer: signer,
    saltNonce: 0n, // optional
    safeVersion: "1.4.1",
});

export const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: sepolia,
    bundlerTransport: http(
        "https://api.pimlico.io/v2/sepolia/rpc?apikey="
    ),
    middleware: {
        gasPrice: async () =>
            (await pimlicoBundlerClient.getUserOperationGasPrice()).fast,
    },
});