import { createClient, createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { bundlerActions, ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { pimlicoBundlerActions, pimlicoPaymasterActions } from "permissionless/actions/pimlico.js";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.ACCOUNT_PK)

export const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.RPC_UR),
})

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.RPC_UR),
})

export const bundlerClient = createClient({
    transport: http(process.env.ENDPOINT_URL),
    chain: sepolia,
})
    .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
    .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07))


export const paymasterClient = createClient({
    transport: http(process.env.ENDPOINT_UR),
    chain: sepolia,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07))