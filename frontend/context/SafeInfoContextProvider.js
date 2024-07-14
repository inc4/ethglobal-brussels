'use client'

import React, { useState, useContext, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { walletClientToSmartAccountSigner } from "permissionless";

import useUniversalAccountInfo from "@/hooks/useUniversalAccountInfo";
import {
  prepareSafeAccount,
  prepareSmartAccountClient,
} from "@/services/prepareSmartAccountClient";

export const SafeInfoContext = React.createContext({
  safeInfo: {
    address: "",
    accountClient: null,
    isOnboarded: false,
  },
  setSafeInfo: (safeInfo) => {},
});

export function SafeInfoContextProvider({ children }) {
  const [safeInfo, setSafeInfo] = useState({
    address: "",
    accountClient: null,
    isOnboarded: false,
  });

  const { connectedTo, address } = useUniversalAccountInfo();

  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    console.log('safe info', safeInfo);
  }, [safeInfo])

  useEffect(() => {
    if (!walletClient) return;
    (async () => {
      if (connectedTo === "safe") {
        const smartAccountSigner =
          await walletClientToSmartAccountSigner(walletClient);
        const safeSmartAccount = await prepareSafeAccount(smartAccountSigner);
        const smartAccountClient =
          await prepareSmartAccountClient(safeSmartAccount);

        setSafeInfo({ accountClient: smartAccountClient, address: address });
      }
    })();
  }, [connectedTo, walletClient]);

  return (
    <SafeInfoContext.Provider value={{ safeInfo, setSafeInfo }}>
      {children}
    </SafeInfoContext.Provider>
  );
}

export function useSafeInfoContextProvider() {
  return useContext(SafeInfoContext);
}
