import {useSafeAppsSDK} from "@safe-global/safe-apps-react-sdk";
import { useWalletInfo } from '@web3modal/wagmi/react'
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";

export default function useUniversalAccountInfo(): UniversalAccountInfo {
  const { sdk, connected: isConnectedToSafe, safe } = useSafeAppsSDK();
  const { walletInfo } = useWalletInfo();
  const { isConnected: isConnectedToWc, address: wcAccount, chainId: wcChainId } = useAccount()

  const [accountInfo, setAccountInfo] = useState<UniversalAccountInfo>({ connectedTo: undefined });

  useEffect(() => {
    (async() => {
      const connectedTo = isConnectedToSafe ? "safe" : isConnectedToWc ? "walletconnect" : undefined;

      if (isConnectedToSafe) {
        console.log('connected to safe');
        const addressBook = await sdk.safe.requestAddressBook();
        const accountName = addressBook.find((account) => account.address === safe.safeAddress)?.name;

        setAccountInfo({
          connectedTo,
          address: safe.safeAddress,
          chainId: safe.chainId,
          name: accountName,
        })
        return;
      }

      if (isConnectedToWc && walletInfo?.name === "Safe{Wallet}") {
        setAccountInfo({
          connectedTo,
          address: wcAccount,
          chainId: wcChainId,
        })
        return;
      }

      setAccountInfo({
        connectedTo
      })

    })()
  }, [sdk, isConnectedToSafe, safe, walletInfo, isConnectedToWc, wcAccount, wcChainId])

  return accountInfo;

}

interface UniversalAccountInfo {
  connectedTo: 'safe' | 'walletconnect' | undefined;
  address?: string;
  chainId?: number;
  name?: string;
}
