'use client';

import Image from 'next/image';

import keyImage from '@/images/key.png';

import ConnectSafeButton from '@/components/ConnectSafeButton';

import useUniversalAccountInfo from "@/hooks/useUniversalAccountInfo";
import useSmartAccountClient from "@/hooks/useSmartAccountClient";
import {Button} from "@nextui-org/button";
import {installWingmanModule} from "@/services/installModule.js";
import {useEffect, useState} from "react";
import {getSafesByOwner} from "@/services/getSafesByOwner";
import {useExternalSmartAccountClient} from "@/hooks/useExternalSmartAccountClient";
import AccountRadioGroup from "@/components/AccountRadioGroup";

export default function Home() {
  const { connectedTo, address } = useUniversalAccountInfo();

  const {
    isModuleSupported,
    isWingmanDeployed,
    smartAccountClient
  } = useSmartAccountClient();

  async function handleModuleDeploy() {
    if (!smartAccountClient) return;

    installWingmanModule(smartAccountClient).then(() => console.log('Module installed'));
  }

  const [safes, setSafes] = useState({
    isLoaded: false,
    data: []
  })

  useEffect(() => {
    if (!address) return;

    getSafesByOwner(address).then((data) => {
      console.log('data', data)
      setSafes({
        isLoaded: true,
        data,
      })
    });

  }, [address])

  const [selectedSafe, setSelectedSafe] = useState(null)

  const externalSafeAccountData = useExternalSmartAccountClient(selectedSafe);

  if (externalSafeAccountData.smartAccountClient) console.log('externalSafeAccountData', externalSafeAccountData);

  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (!connectedTo) return setStage(1);
    if (safes.isLoaded) return setStage(2);
    // 3 is set by create new safe
  }, [connectedTo, safes.isLoaded])

  return (
    <section className="flex flex-nowrap align-middle pt-12 ">
      <div className="flex flex-col gap-8 max-w-xl text-start justify-center w-full">

        { stage === 1 ? (
          <StageOne />
        ) : null }

        { stage === 2 ? (
          <StageTwo
            safes={safes.data}
            selectAddress={(address) => setSelectedSafe(address)}
            createNewSafe={() => setStage(3)}
          />
        ) : null }

        { stage === 3 ? (
          <></>
        ) : null}

        {/*{*/}
        {/*  safes.isLoaded ? (*/}
        {/*    <>*/}
        {/*      <h1 className="font-black text-[25px]">*/}
        {/*        Select Safe to use:*/}
        {/*      </h1>*/}
        {/*      <Select onChange={(e) => setSelectedSafe(e.target.value)}>*/}
        {/*        {*/}
        {/*          safes.data.map((wallet) => (*/}
        {/*            <SelectItem key={wallet}>{wallet}</SelectItem>*/}
        {/*          ))*/}
        {/*        }*/}
        {/*      </Select>*/}
        {/*    </>*/}
        {/*  ) : null*/}
        {/*}*/}

        {
          !isModuleSupported ? (
            <p className="text-lg">
            You need ERC-7579 Smart Account to use Wingman
            </p>
          ) : null
        }

        {
          isModuleSupported && !isWingmanDeployed ? (
            <Button
              className="font-semibold"
              color="primary"
              size="lg"
              onClick={handleModuleDeploy}
            >
              Deploy Wingman module to your wallet
            </Button>
          ) : null
        }

        {
          isWingmanDeployed ? (
            <Button
              className="font-semibold"
              color="primary"
              size="lg"
              // onClick={() => open({ view: 'Connect' })}
            >
              Go to dashboard
            </Button>
          ) : null
        }

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
  )
}

function StageTwo({ safes, selectAddress, createNewSafe }) {
  return (
    <>
      {safes.length ? (
        <>
          <h3 className="font-black text-[25px]">
            Select Safe account to use
          </h3>
          <AccountRadioGroup safes={safes} onChange={selectAddress}/>
        </>
      ) : null}

      <h3 className="font-black text-[25px]">
        {safes.length ? "Or create a new one" : "Create new Safe account"}
      </h3>
      <Button
        className="font-semibold"
        color="primary"
        size="lg"
      >
        Create new Safe
      </Button>
    </>
  )
}

function StageThree() {
  return (
    <>
      <h1 className="font-black text-[50px]">
        Create a new Safe account
      </h1>
    </>
  )
}
