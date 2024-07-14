import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { walletClientToSmartAccountSigner } from "permissionless";

import {
  prepareSafeAccount,
  prepareSmartAccountClient,
} from "@/services/prepareSmartAccountClient";
import { isWingmanModuleInitialized } from "@/services/installModule";

export function useExternalSmartAccountClient(safeAccountAddress) {
  const [client, setClient] = useState({
    smartAccountClient: null,
    isModuleSupported: false,
    isWingmanDeployed: false,
  });

  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!walletClient || !safeAccountAddress) return;

    console.log("walletClient", walletClient);

    (async () => {
      const smartAccountSigner =
        await walletClientToSmartAccountSigner(walletClient);

      console.log("smartAccountSigner", smartAccountSigner);

      const safeSmartAccount = await prepareSafeAccount(
        smartAccountSigner,
        safeAccountAddress,
      );

      console.log("safeSmartAccount", safeSmartAccount);

      const smartAccountClient =
        await prepareSmartAccountClient(safeSmartAccount);

      console.log("smartAccountClient", smartAccountClient);

      const isModuleSupported = await smartAccountClient.supportsModule({
        type: "fallback",
      });

      console.log("isModuleSupported", isModuleSupported);

      const isWingmanDeployed =
        await isWingmanModuleInitialized(smartAccountClient);

      console.log("isWingmanDeployed", isWingmanDeployed);

      setClient({
        smartAccountClient,
        isModuleSupported,
        isWingmanDeployed,
      });
    })();
  }, [walletClient, safeAccountAddress]);

  return client;
}
