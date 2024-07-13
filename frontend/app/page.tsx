'use client';

import Image from 'next/image';

import keyImage from '@/images/key.png';

import ConnectSafeButton from '@/components/ConnectSafeButton';

import useUniversalAccountInfo from "@/hooks/useUniversalAccountInfo";
import useSmartAccountClient from "@/hooks/useSmartAccountClient";
import {Button} from "@nextui-org/button";
import {installWingmanModule} from "@/services/installModule.js";

export default function Home() {
  const { connectedTo } = useUniversalAccountInfo();

  const {
    isModuleSupported,
    isWingmanDeployed,
    smartAccountClient
  } = useSmartAccountClient();

  async function handleModuleDeploy() {
    if (!smartAccountClient) return;
    console.log(installWingmanModule)
    installWingmanModule(smartAccountClient).then(() => console.log('Module installed'));
  }

  return (
    <section className="flex flex-nowrap align-middle pt-12 ">
      <div className="flex flex-col gap-8 max-w-xl text-start justify-center">
        <h1 className="font-black text-[50px]">
          Staying On-Chain in Any Situation
        </h1>
        <p className="text-lg">
          Prepare for the unexpected. Web3 Wingman lets you set automated
          transfers from your wallet to a chosen receiver on a specific date.
          Whether facing a medical procedure or an adventure, safeguard your
          assets and support your loved ones if things don&apos;t go as planned.
        </p>

        { !connectedTo ? (
          <ConnectSafeButton />
        ) : null }

        {
          !isModuleSupported ? (
            <p className="text-lg">
              You need ERC-7570 Smart Account to use Wingman
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
      <div className="flex align-middle justify-center w-full ">
        <Image alt="key image" className="h-96 w-96" src={keyImage} />
      </div>
    </section>
  );
}
