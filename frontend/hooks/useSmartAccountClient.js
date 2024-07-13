'use client';

import {useEffect, useState} from "react";

import { useWalletClient } from 'wagmi';
import {prepareSafeAccount, prepareSmartAccountClient} from "@/services/prepareSmartAccountClient";
import {isWingmanModuleInitialized} from "@/services/installModule";
import {walletClientToSmartAccountSigner} from "permissionless";

export default function useSmartAccountClient() {
	const [client, setClient] = useState({
		smartAccountClient: null,
		isModuleSupported: false,
		isWingmanDeployed: false
	});

	const { data: walletClient } = useWalletClient();

	useEffect(() => {
		if (!walletClient) return;

		(async () => {
			const smartAccountSigner = await walletClientToSmartAccountSigner(walletClient);
			const safeSmartAccount = await prepareSafeAccount(smartAccountSigner);
			const smartAccountClient = await prepareSmartAccountClient(safeSmartAccount);

			const isModuleSupported = await smartAccountClient.supportsModule({
				type: "fallback"
			});

			const isWingmanDeployed = await isWingmanModuleInitialized(safeSmartAccount.address);

			setClient({
				smartAccountClient,
				isModuleSupported,
				isWingmanDeployed
			});
		})()

	}, [walletClient]);

	return client;
}
