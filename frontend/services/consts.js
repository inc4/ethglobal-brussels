'use client'

import {createPublicClient, http} from "viem";
import {checkEnvVar} from "./utils";

// export const pimlicoApiKey = checkEnvVar("NEXT_PUBLIC_PIMLICO_API_KEY");
// export const wingmanModuleAddress = checkEnvVar("NEXT_PUBLIC_WINGMAN_MODULE_ADDRESS");

export const pimlicoApiKey = '04287e53-84d2-413b-bbc6-450629d7e999';
export const wingmanModuleAddress = '0xa0c654C59Af7681E9f8734Ed77456f233E710023'

export const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${pimlicoApiKey}`

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
})

