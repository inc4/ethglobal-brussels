import { encodeFunctionData } from "viem";
import { ENTRYPOINT_ADDRESS_V07, getSenderAddress, signUserOperationHashWithECDSA } from "permissionless";
import { sepolia } from "viem/chains";
import { bundlerClient, paymasterClient, walletClient } from "./clients.js"

export async function execBackup({ owner, name}) {
    const factory = process.env.SIMPLE_ACCOUNT_FACTORY_ADDRESSS
    const factoryData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: "owner", type: "address" },
                    { name: "salt", type: "uint256" },
                ],
                name: "createAccount",
                outputs: [{ name: "ret", type: "address" }],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        args: [walletClient.account.address, 0n],
    })

    const senderAddress = await getSenderAddress(publicClient, {
        factory,
        factoryData,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
    })

    const execBackupCallData = encodeFunctionData({
        address: process.env.MOUDLE_ADDRESS,
        abi,
        functionName: "executeBackup",
        args: [owner, name]
    });

    const callData = encodeFunctionData({
        abi: [{
            inputs: [
                { name: "dest", type: "address" },
                { name: "value", type: "uint256" },
                { name: "func", type: "bytes" },
            ],
            name: "execute",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        ],
        args: [process.env.MOUDLE_ADDRESS, 0, execBackupCallData],
    })


    const gasPrice = await bundlerClient.getUserOperationGasPrice()

    const userOperation = {
        sender: senderAddress,
        nonce: 0n,
        factory: factory,
        factoryData,
        callData,
        maxFeePerGas: gasPrice.fast.maxFeePerGas,
        maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
        // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
        signature: process.env.signature,
    }

    const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
        userOperation,
    })

    const sponsoredUserOperation = {
        ...userOperation,
        ...sponsorUserOperationResult,
    }


    const signature = await signUserOperationHashWithECDSA({
        account: walletClient.account,
        userOperation: sponsoredUserOperation,
        chainId: sepolia.id,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
    })
    sponsoredUserOperation.signature = signature


    const userOperationHash = await bundlerClient.sendUserOperation({
        userOperation: sponsoredUserOperation,
    })

    try {
        const receipt = await bundlerClient.waitForUserOperationReceipt({
            hash: userOperationHash,
        })
        const txHash = receipt.receipt.transactionHash
    } catch (e) {

    }
}