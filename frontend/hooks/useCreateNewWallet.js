import { walletClientToSmartAccountSigner } from "permissionless";
import { useWalletClient } from "wagmi";
import { useState } from "react";

import { deployNewSmartAccount } from "@/services/deployNewSmartAccount";
import { prepareSmartAccountClient } from "@/services/prepareSmartAccountClient";
import {
  installWingmanModule,
  isWingmanModuleInitialized,
} from "@/services/installModule";

export function useCreateNewWallet(existingAccountClient) {
  const [status, setStatus] = useState("");

  const { data: walletClient } = useWalletClient();

  async function createNewWallet() {
    if (!walletClient) return console.log("wallet client is not ready");

    setStatus("Connecting to signer wallet");

    let smartAccountClient;

    // creating new wallet
    if (!existingAccountClient) {
      const smartAccountSigner =
        await walletClientToSmartAccountSigner(walletClient);

      console.log("smartAccountSigner", smartAccountSigner);

      setStatus("Deploying new ERC-7579 smart account");
      const safeSmartAccount = await deployNewSmartAccount(smartAccountSigner);

      console.log("safeSmartAccount", safeSmartAccount);

      setStatus("Preparing smart account client");
      smartAccountClient = await prepareSmartAccountClient(safeSmartAccount);
    } else {
      smartAccountClient = existingAccountClient;
    }

    console.log("smartAccountClient", smartAccountClient);

    setStatus("Checking if everything fine");
    const isModuleSupported = await smartAccountClient
      .supportsModule({
        type: "fallback",
      })
      .catch(() => false);

    console.log("isModuleSupported", isModuleSupported);

    if (!isModuleSupported) throw new Error("module not supported");

    setStatus("Installing Web3 Wingman module");
    const receipt = await installWingmanModule(smartAccountClient);

    console.log("receipt", receipt);

    const isWingmanDeployed =
      await isWingmanModuleInitialized(smartAccountClient);

    console.log("isWingmanDeployed", isWingmanDeployed);

    return smartAccountClient
  }

  return { createNewWallet, status };
}
