'use client'

import {createPublicClient, http} from "viem";

// export const pimlicoApiKey = checkEnvVar("NEXT_PUBLIC_PIMLICO_API_KEY");
// export const wingmanModuleAddress = checkEnvVar("NEXT_PUBLIC_WINGMAN_MODULE_ADDRESS");

export const pimlicoApiKey = '04287e53-84d2-413b-bbc6-450629d7e999';
export const wingmanModuleAddress = '0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492'

export const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${pimlicoApiKey}`

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
})

