import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { useWalletInfo } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function useUniversalAccountInfo() {
  const { sdk, connected: isConnectedToSafe, safe } = useSafeAppsSDK();
  const { walletInfo } = useWalletInfo();
  const {
    isConnected: isConnectedToWc,
    address: wcAccount,
    chainId: wcChainId,
  } = useAccount();

  const [accountInfo, setAccountInfo] = useState({
    connectedTo: undefined,
  });

  useEffect(() => {
    (async () => {
      const connectedTo = isConnectedToSafe
        ? "safe"
        : isConnectedToWc
          ? "walletconnect"
          : undefined;

      if (isConnectedToSafe) {
        console.log({ sdk, safe });
        const addressBook = await sdk.safe.requestAddressBook();
        const accountName = addressBook.find(
          (account) => account.address === safe.safeAddress,
        )?.name;

        setAccountInfo({
          connectedTo,
          address: safe.safeAddress,
          chainId: safe.chainId,
          name: accountName,
        });

        return;
      }

      if (isConnectedToWc) {
        setAccountInfo({
          connectedTo,
          address: wcAccount,
          chainId: wcChainId,
        });

        return;
      }

      // setAccountInfo({
      //   connectedTo
      // })
    })();
  }, [
    sdk,
    isConnectedToSafe,
    safe,
    walletInfo,
    isConnectedToWc,
    wcAccount,
    wcChainId,
  ]);

  return accountInfo;
}
