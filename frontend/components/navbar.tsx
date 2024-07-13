'use client';

import Image from 'next/image';
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import NextLink from 'next/link';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {useBalance, useDisconnect} from 'wagmi';

import ConnectSafeButton from '@/components/ConnectSafeButton';
import logo from '@/images/logo.svg';
import logout from '@/images/logout.svg';
import useUniversalAccountInfo from '@/hooks/useUniversalAccountInfo';

export const Navbar = () => {
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const { connectedTo, address, name, chainId } = useUniversalAccountInfo();

  const {
    data: balance,
    isSuccess: isBalanceLoaded
  } = useBalance({
    address: address,
    chainId: chainId
  });

  return (
    <NextUINavbar
      className="bg-transparent backdrop-filter-none py-14"
      maxWidth="xl"
      position="static"
    >
      <NavbarContent className="" justify="start">
        <NavbarBrand className="gap-3">
          <NextLink className="flex justify-start items-center" href="/">
            <Image alt="SAFE logo" src={logo} />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="" justify="end">
        {!!connectedTo ? (
          <>
            <NavbarItem className="flex font-semibold gap-2">
              {name ? <span>{name}</span> : null}

              {
                isBalanceLoaded ?
                  (
                    <span className="text-primary">{balance.formatted} ETH</span>
                  ) : null
              }
            </NavbarItem>

            {connectedTo === 'safe' ? (
              <Button
                className="font-semibold border-default-900"
                color="default"
                size="lg"
                variant="bordered"
              >
                {address && `${address.slice(0, 4)}...${address.slice(-4)}`}
              </Button>
            ) : null}
            {connectedTo === 'walletconnect' ? (
              <Button
                className="font-semibold border-default-900"
                color="default"
                endContent={<Image alt="logout" src={logout} />}
                size="lg"
                variant="bordered"
                onClick={() => disconnect()}
              >
                {address && `${address.slice(0, 4)}...${address.slice(-4)}`}
              </Button>
            ) : null}
          </>
        ) : (
          <NavbarItem className="hidden md:flex">
            <div className="flex align-middle">
              <ConnectSafeButton />
            </div>
          </NavbarItem>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};
