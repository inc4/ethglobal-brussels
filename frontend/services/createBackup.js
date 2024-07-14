import {
	ENTRYPOINT_ADDRESS_V07,
	bundlerActions,
	getSenderAddress,
	signUserOperationHashWithECDSA,
} from "permissionless"
import { pimlicoBundlerActions, pimlicoPaymasterActions } from "permissionless/actions/pimlico"
import { createClient, createPublicClient, encodeFunctionData, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { sepolia } from "viem/chains"

const generateBackupAbiWithArgs = ({name, unlockAt, beneficiaries}) => ({
	abi: [
		{
			name: "updateBackup",
			type: "function",
			stateMutability: "nonpayable",
			inputs: [
				{ internalType: 'string', name: 'name', type: 'string' },
				{ internalType: 'uint48', name: 'unlockAt', type: 'uint48' },
				{
					internalType: 'struct Wingman.Beneficiary[]',
					name: 'beneficiaries',
					type: 'tuple[]',
					components: [
						{ internalType: 'address', name: 'account', type: 'address' },
						{ internalType: 'uint8', name: 'percentage', type: 'uint8' },
						{ internalType: 'uint256', name: 'amount', type: 'uint256' }
					]
				}
			],
			outputs: []
		}
	],
	functionName: "updateBackup",
	args: [name, unlockAt, beneficiaries]
})

const publicClient = createPublicClient({
	transport: http("https://rpc.ankr.com/eth_sepolia"),
	chain: sepolia,
})

const apiKey = "5499b16e-f9de-427c-8cd1-76417e0a7d22"
const endpointUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`

const bundlerClient = createClient({
	transport: http(endpointUrl),
	chain: sepolia,
})
		.extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
		.extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07))

const paymasterClient = createClient({
	transport: http(endpointUrl),
	chain: sepolia,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07))

// const ownerPrivateKey = "0x30320097c1d7009d6d970376c792fe157a5e989f057b8908345043393a56a8a5"
// const owner = privateKeyToAccount(ownerPrivateKey)

export async function createBackup(owner, smartAccountAddress, name, unlockAt, benefAddress) {
	const factory = "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985"
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
		args: [owner.address, 0n],
	})

	console.log("Generated factoryData:", factoryData)

	const senderAddress = await getSenderAddress(publicClient, {
		factory,
		factoryData,
		entryPoint: ENTRYPOINT_ADDRESS_V07,
	})
	console.log("Calculated sender address:", senderAddress)

	const updateBackupCallData = encodeFunctionData(
			generateBackupAbiWithArgs({name: name, unlockAt: unlockAt, beneficiaries: [
					{
						account: benefAddress,
						percentage: 100,
						amount: 0
					}
				]})
	);

	const callData = encodeFunctionData({
		abi: [
			{
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
		args: ["0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492", 0, updateBackupCallData],
	})

	console.log("Generated callData:", callData)

	const gasPrice = await bundlerClient.getUserOperationGasPrice()

	const userOperation = {
		sender: smartAccountAddress,
		nonce: 0n,
		factory: factory,
		factoryData,
		callData,
		maxFeePerGas: gasPrice.fast.maxFeePerGas,
		maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
		// dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
		signature:
				"0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c",
	}

	const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
		userOperation,
	})

	const sponsoredUserOperation = {
		...userOperation,
		...sponsorUserOperationResult,
	}

	console.log("Received paymaster sponsor result:", sponsorUserOperationResult)

	const signature = await signUserOperationHashWithECDSA({
		account: owner,
		userOperation: sponsoredUserOperation,
		chainId: sepolia.id,
		entryPoint: ENTRYPOINT_ADDRESS_V07,
	})
	sponsoredUserOperation.signature = signature


	const userOperationHash = await bundlerClient.sendUserOperation({
		userOperation: sponsoredUserOperation,
	})


	const receipt = await bundlerClient.waitForUserOperationReceipt({
		hash: userOperationHash,
	})
	const txHash = receipt.receipt.transactionHash

	console.log(`UserOperation included: https://sepolia.etherscan.io/tx/${txHash}`)
}
