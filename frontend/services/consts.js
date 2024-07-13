import {createPublicClient, http} from "viem";
import {checkEnvVar} from "./utils";

export const pimlicoApiKey = checkEnvVar("NEXT_PUBLIC_PIMLICO_API_KEY");
export const wingmanModuleAddress = checkEnvVar("NEXT_PUBLIC_WINGMAN_MODULE_ADDRESS");

export const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${pimlicoApiKey}`

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
})

