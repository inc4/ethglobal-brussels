'use client';

import Image from 'next/image';
import { useAccount } from 'wagmi';

import keyImage from '@/images/key.png';
import ConnectSafeButton from '@/components/ConnectSafeButton';

export default function Home() {
  const { isConnected, address, status } = useAccount();

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
        <ConnectSafeButton />
        isConnected: {isConnected ? 'true' : 'false'} <br />
        address: {address} <br />
        status: {status} <br />
      </div>
      <div className="flex align-middle justify-center w-full ">
        <Image alt="key image" className="h-96 w-96" src={keyImage} />
      </div>
    </section>
  );
}
