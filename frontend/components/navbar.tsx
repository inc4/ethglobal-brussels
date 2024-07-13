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

import logo from '@/images/logo.svg';
import logoSafe from '@/images/logo-safe.svg';
import logout from '@/images/logout.svg';

import { useWeb3Modal } from '@web3modal/wagmi/react';

export const Navbar = () => {
  const { open } = useWeb3Modal();
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

      <NavbarContent className="" justify="end">
        <NavbarItem className="flex font-semibold gap-2">
          <span>UserName12</span>
          <span className="text-primary">145 ETH</span>
        </NavbarItem>

        <NavbarItem className="hidden md:flex">
          <div className="flex align-middle">
            <Button
              color="primary"
              size="lg"
              className="font-semibold"
              // onClick={() => {
              //   console.log('add connect safe');
              // }}
              startContent={<Image src={logoSafe} alt="SAFE logo" />}
            >
              Connect Safe
            </Button>
            <Button
              color="default"
              variant="bordered"
              size="lg"
              className="font-semibold border-default-900"
              // onClick={() => {
              //   console.log('add connect safe');
              // }}
              endContent={<Image src={logout} alt="logout" />}
            >
              Ox8g...ghxv
            </Button>
          </div>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
