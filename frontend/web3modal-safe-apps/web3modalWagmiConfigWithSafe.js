import '@web3modal/polyfills';
import { createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import { authConnector } from '@web3modal/wagmi';
import { getTransport } from './getTransport';

import { safe } from "wagmi/connectors"

export function web3modalWagmiConfigWithSafe({ projectId, chains, metadata, enableCoinbase, enableInjected, auth = {}, enableWalletConnect, enableEIP6963, ...wagmiConfig }) {
	const connectors = [safe()];
	const transportsArr = chains.map(chain => [chain.id, getTransport({ chain, projectId })]);
	const transports = Object.fromEntries(transportsArr);
	const defaultAuth = {
		email: true,
		showWallets: true,
		walletFeatures: true
	};
	if (enableWalletConnect !== false) {
		connectors.push(walletConnect({ projectId, metadata, showQrModal: false }));
	}
	if (enableInjected !== false) {
		connectors.push(injected({ shimDisconnect: true }));
	}
	if (enableCoinbase !== false) {
		connectors.push(coinbaseWallet({
			version: '4',
			appName: metadata?.name ?? 'Unknown',
			appLogoUrl: metadata?.icons[0] ?? 'Unknown',
			preference: wagmiConfig.coinbasePreference || 'all'
		}));
	}
	const mergedAuth = {
		...defaultAuth,
		...auth
	};
	if (mergedAuth.email || mergedAuth.socials) {
		connectors.push(authConnector({
			chains: [...chains],
			options: { projectId },
			socials: mergedAuth.socials,
			email: mergedAuth.email,
			showWallets: mergedAuth.showWallets,
			walletFeatures: mergedAuth.walletFeatures
		}));
	}
	return createConfig({
		chains,
		multiInjectedProviderDiscovery: enableEIP6963 !== false,
		transports,
		...wagmiConfig,
		connectors
	});
}
