"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { CircularProgress } from "@nextui-org/progress";
import { useWalletClient } from "wagmi";
import { walletClientToSmartAccountSigner } from "permissionless";

import keyImage from "@/images/key.png";
import ConnectSafeButton from "@/components/ConnectSafeButton";
import useUniversalAccountInfo from "@/hooks/useUniversalAccountInfo";
import { getSafesByOwner } from "@/services/getSafesByOwner";
import AccountRadioGroup from "@/components/AccountRadioGroup";
import { useCreateNewWallet } from "@/hooks/useCreateNewWallet";
import { isWingmanModuleInitialized } from "@/services/installModule";
import { useSafeInfoContextProvider } from "@/context/SafeInfoContextProvider";
import {
  prepareSafeAccount,
  prepareSmartAccountClient,
} from "@/services/prepareSmartAccountClient";

import { useRouter } from 'next/navigation'

export default function Home() {
  const { connectedTo, address } = useUniversalAccountInfo();

  const [safes, setSafes] = useState({
    isLoaded: false,
    data: [],
  });

  useEffect(() => {
    if (!address) return;

    getSafesByOwner(address).then((data) => {
      console.log("data", data);
      setSafes({
        isLoaded: true,
        data,
      });
    });
  }, [address]);

  const [stage, setStage] = useState(1);

  const { data: walletClient } = useWalletClient();

  const { setSafeInfo, safeInfo } = useSafeInfoContextProvider();

  useEffect(() => {
    (async () => {
      if (!connectedTo || !walletClient) {
        console.log("disconnected or walletClient missing");

        return setStage(1);
      }

      if (!safeInfo.address && safes.isLoaded) {
        console.log("safes not loaded or not safe wallet - fetch safes");

        return setStage(2);
      }

      console.log(safeInfo);
      const isModuleSupported = await safeInfo.accountClient
        .supportsModule({
          type: "fallback",
        })
        .catch((err) => {
          console.log(err);

          return false;
        });

      if (!isModuleSupported) {
        console.log("Unsupported Safe Wallet");

        return setStage(5);
      } //dead end

      const isWingmanDeployed = await isWingmanModuleInitialized(
        safeInfo.accountClient,
      );

      if (!isWingmanDeployed) {
        console.log("compatible wallet, need to install module");

        return setStage(3); //but to install wingman only
      }

      console.log("wingman installed");

      return setStage(4);
    })();
  }, [connectedTo, safes.isLoaded, walletClient, safeInfo]);

  async function handleSelectExternalAddress(address) {
    console.log("wallet client", walletClient);
    const smartAccountSigner =
      await walletClientToSmartAccountSigner(walletClient);
    const safeSmartAccount = await prepareSafeAccount(
      smartAccountSigner,
      address,
    );
    const smartAccountClient =
      await prepareSmartAccountClient(safeSmartAccount);

    setSafeInfo({
      address: address,
      accountClient: smartAccountClient,
    });
  }

  return (
    <section className="flex flex-nowrap align-middle pt-12 ">
      <div className="flex flex-col gap-8 max-w-xl text-start justify-center w-full">
        {stage === 1 ? <StageOne /> : null}

        {stage === 2 ? (
          <StageTwo
            createNewSafe={() => setStage(3)}
            safes={safes.data}
            selectAddress={handleSelectExternalAddress}
          />
        ) : null}

        {stage === 3 ? <StageThree proceed={() => setStage(4)} /> : null}

        {stage === 4 ? <StageFour /> : null}

        {stage === 5 ? (
          <>
            Your Safe wallet do not support erc7579, choose different wallet or
            connect metamask to create new one
          </>
        ) : null}
      </div>
      <div className="flex align-middle justify-center w-full">
        <Image alt="key image" className="h-96 w-96" src={keyImage} />
      </div>
    </section>
  );
}

function StageOne() {
  return (
    <>
      <h1 className="font-black text-[50px]">
        Staying On-Chain in Any Situation
      </h1>
      <p className="text-lg">
        Prepare for the unexpected. Web3 Wingman lets you set automated
        transfers from your wallet to a chosen receiver on a specific date.
        Whether facing a medical procedure or an adventure, safeguard your
        assets and support your loved ones if things don&apos;t go as planned.
      </p>

      <ConnectSafeButton />
    </>
  );
}

function StageTwo({ safes, selectAddress, createNewSafe }) {
  return (
    <>
      {safes.length ? (
        <>
          <h3 className="font-black text-[25px]">Select Safe account to use</h3>
          <AccountRadioGroup safes={safes} onChange={selectAddress} />
        </>
      ) : null}

      <h3 className="font-black text-[25px]">
        {safes.length ? "Or create a new one" : "Create new Safe account"}
      </h3>
      <Button
        className="font-semibold"
        color="primary"
        size="lg"
        onClick={createNewSafe}
      >
        Create new Safe
      </Button>
    </>
  );
}

function StageThree() {
  const { safeInfo, setSafeInfo } = useSafeInfoContextProvider();
  const { createNewWallet, status } = useCreateNewWallet(
    safeInfo.accountClient,
  );

  function create() {
    (async () => {
      createNewWallet().then((newAccountClient) => {
        setSafeInfo({
          accountClient: newAccountClient,
          address: newAccountClient.account.address,
        });
      });
    })();
  }

  return (
    <>
      <h1 className="font-black text-[50px]">Creating new wallet</h1>

      {!status ? (
        <Button
          className="font-semibold"
          color="primary"
          size="lg"
          onClick={create}
        >
          Create new Safe
        </Button>
      ) : null}

      {!!status ? <CircularProgress aria-label="Loading..." size="lg" /> : null}

      <p className="text-lg">{status}</p>
    </>
  );
}

function StageFour() {
  const router = useRouter()
  return (
    <>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <h1 className="font-black text-[50px]">You're all set</h1>

      <Button
        showAnchorIcon
        color="primary"
        variant="solid"
        onClick={() => router.push('/backups')}
      >
        Go to dashboard
      </Button>
    </>
  );
}
