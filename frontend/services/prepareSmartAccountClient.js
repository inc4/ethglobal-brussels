'use client'

import {createSmartAccountClient, ENTRYPOINT_ADDRESS_V07} from "permissionless";
import {sepolia} from "viem/chains";
import {http} from "viem";
import {erc7579Actions} from "permissionless/actions/erc7579";
import {pimlicoBundlerClient} from "./installModule";
import {bundlerUrl, publicClient} from "@/services/consts";
import {signerToSafeSmartAccount} from "permissionless/accounts";

export function prepareSafeAccount(signer, address) {
	return signerToSafeSmartAccount(publicClient, {
		signer,
		safeVersion: "1.4.1",
		entryPoint: ENTRYPOINT_ADDRESS_V07,
		safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2",
		erc7579LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE",
		address: address || signer.address,
	})
}


export function prepareSmartAccountClient(account) {
	return createSmartAccountClient({
		account: account,
		entryPoint: ENTRYPOINT_ADDRESS_V07,
		chain: sepolia,
		bundlerTransport: http(bundlerUrl),
		middleware: {
			gasPrice: async () => {
				return (await pimlicoBundlerClient.getUserOperationGasPrice()).fast
			},
			sponsorUserOperation: pimlicoBundlerClient.sponsorUserOperation

		},
	})
			.extend(erc7579Actions({entryPoint: ENTRYPOINT_ADDRESS_V07}))
}
