import Image from 'next/image';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from '@nextui-org/button';

import logoSafe from '@/images/logo-safe.svg';

const ConnectSafeButton = () => {
  const { open } = useWeb3Modal();

  return (
    <div className="">
      <Button
        className="font-semibold"
        color="primary"
        size="lg"
        // startContent={<Image alt="SAFE logo" src={logoSafe} />}
        onClick={() => open({ view: 'Connect' })}
      >
        Connect wallet
      </Button>
    </div>
  );
};

export default ConnectSafeButton;
