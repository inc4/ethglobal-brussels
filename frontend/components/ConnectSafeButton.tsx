import Image from 'next/image';
import { useWeb3Modal } from '@web3modal/wagmi/react';

import { Button } from '@nextui-org/button';

import logoSafe from '@/images/logo-safe.svg';

const ConnectSafeButton = () => {
  const { open } = useWeb3Modal();
  return (
    <div className="">
      <Button
        color="primary"
        size="lg"
        className="font-semibold"
        onClick={() => open({ view: 'Connect' })}
        startContent={<Image src={logoSafe} alt="SAFE logo" />}
      >
        Connect Safe
      </Button>
    </div>
  );
};

export default ConnectSafeButton;
