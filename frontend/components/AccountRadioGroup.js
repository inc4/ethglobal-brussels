import React from 'react';
import { Button } from '@nextui-org/react';
export default function AccountRadioGroup({ safes, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      {safes.map((safe) => {
        const isCompatible = safe.version === '1.4.1';
        const description = !isCompatible ? "Can't be used" : '';

        return (
          <Button
            key={safe.address}
            className=" py-2 bg-primary-200"
            isDisabled={!isCompatible}
            size="md w-full"
            onClick={onChange}
          >
            <span className="flex flex-col text-left py-8">
              <span>{safe.address}</span>
              <span className=" text-xs">{description}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}
