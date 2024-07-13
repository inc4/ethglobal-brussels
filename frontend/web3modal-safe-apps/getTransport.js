import {CoreHelperUtil} from "@web3modal/scaffold";
import {ConstantsUtil, PresetsUtil} from "@web3modal/scaffold-utils";
import {fallback, http} from "viem";

export function getTransport({ chain, projectId }) {
	const RPC_URL = CoreHelperUtil.getBlockchainApiUrl();
	const chainDefaultUrl = chain.rpcUrls[0]?.http?.[0];
	if (!PresetsUtil.WalletConnectRpcChainIds.includes(chain.id)) {
		return http(chainDefaultUrl);
	}
	return fallback([
		http(`${RPC_URL}/v1/?chainId=${ConstantsUtil.EIP155}:${chain.id}&projectId=${projectId}`),
		http(chainDefaultUrl)
	]);
}
