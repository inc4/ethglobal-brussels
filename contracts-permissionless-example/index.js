// Import the required modules.
import { createBundlerClient } from "permissionless"
import { sepolia } from "viem/chains"
import { http } from "viem"

const apiKey = "insert your api key here"

// Create the required clients.
const bundlerClient = createBundlerClient({
    chain: sepolia,
    transport: http(`https://api.pimlico.io/v1/sepolia/rpc?apikey=${apiKey}`) // Use any bundler url
})

// Consume bundler, paymaster, and smart account actions!
const userOperationReceipt = await bundlerClient.getUserOperationReceipt({
    hash: "0x23b28c3752246f42f25e5d2db1f4cf7f968aac2b4fc5fa04743eb8ffc1079b27"
})

console.log(userOperationReceipt)