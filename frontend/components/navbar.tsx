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

import ConnectSafeButton from '@/components/ConnectSafeButton';

import logo from '@/images/logo.svg';
import logout from '@/images/logout.svg';

import useUniversalAccountInfo from "@/hooks/useUniversalAccountInfo";
import {useBalance, useDisconnect} from "wagmi";
import {arbitrum} from "wagmi/chains";

export const Navbar = () => {
  const { disconnect } = useDisconnect();

  const {
    connectedTo,
    address,
    name,
    chainId
  } = useUniversalAccountInfo();

  // const balanceData = useBalance({
  //   chainId: chainId
  // });

  return (
    <NextUINavbar maxWidth="xl" className=" py-14">
      <NavbarContent className="" justify="start">
        <NavbarBrand className="gap-3">
          <NextLink className="flex justify-start items-center gap-1 " href="/">
            <Image src={logo} alt="SAFE logo" />
            <p className="font-bold text-[28px]">Web3 Wingman</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/*{console.log(balanceData)}*/}

      <NavbarContent className="" justify="end">

        {
          !!connectedTo ? (
          <>
            <NavbarItem className="flex font-semibold gap-2">
              {
                name ?
                  (
                    <span>{name}</span>
                  ) : null
              }

              {/*{*/}
              {/*  isBalanceLoaded ?*/}
              {/*    (*/}
              {/*      <span className="text-primary">{balance.formatted} ETH</span>*/}
              {/*    ) : null*/}
              {/*}*/}
            </NavbarItem>

            {
              connectedTo === 'safe' ?
                (
                  <Button
                    color="default"
                    variant="bordered"
                    size="lg"
                    className="font-semibold border-default-900"
                  >
                    {address && (`${address.slice(0, 4)}...${address.slice(-4)}`)}
                  </Button>
                )
                : null
            }
            { connectedTo === 'walletconnect' ?
                (
                  <Button
                    color="default"
                    variant="bordered"
                    size="lg"
                    className="font-semibold border-default-900"
                    onClick={() => disconnect()}
                    endContent={<Image src={logout} alt="logout" />}
                  >
                    {address && (`${address.slice(0, 4)}...${address.slice(-4)}`)}
                  </Button>
                ) : null
            }
          </>
        ) : (
          <NavbarItem className="hidden md:flex">
            <div className="flex align-middle">
              <ConnectSafeButton />
            </div>
          </NavbarItem>
        )
      }

      </NavbarContent>
    </NextUINavbar>
  );
};
