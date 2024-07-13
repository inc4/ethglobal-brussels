'use client';

import Image from 'next/image';
import logoSafe from '@/images/logo-safe.svg';
import keyImage from '@/images/key.png';

import { Button } from '@nextui-org/button';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import ConnectSafeButton from '@/components/ConnectSafeButton';

import {useAccount, useConnect} from 'wagmi';

export default function Home() {
  const { open } = useWeb3Modal();

  const { isConnected, address, status } = useAccount();

  return (
    <section className="flex flex-nowrap align-middle">
      <div className="flex flex-col  gap-8 max-w-xl text-start justify-center">
        <h1 className="font-semibold text-5xl">
          Why Should You Worry about Web3 Security?
        </h1>

        <p className="text-lg">
          You might wonder about the reasons for which you need a web3 security
          tutorial in the first place. It is important to note that the
          advantage of democracy on the Internet comes at a price.
        </p>

        <ConnectSafeButton />

        isConnected: {isConnected ? 'true' : 'false'} <br />
        address: {address} <br />
        status: {status} <br />
      </div>
      <div className="flex align-middle justify-center w-full ">
        <Image src={keyImage} alt="key image" />
      </div>
    </section>
  );
}
