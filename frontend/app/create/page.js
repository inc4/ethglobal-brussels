'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { DatePicker } from '@nextui-org/date-picker';
import { Switch } from '@nextui-org/switch';
import { DateValue, parseDate } from '@internationalized/date';

import CustomTooltip from '@/components/CustomTooltip';
import {walletClientToSmartAccountSigner} from "permissionless";
import {useWalletClient} from "wagmi";

import { useSafeInfoContextProvider } from "@/context/SafeInfoContextProvider";
import {createBackup} from "../../services/createBackup";

export default function CreatePage() {
  const [valueName, setValueName] = useState('');
  const [isFixed, setIsFixed] = useState(true);
  const [valueReceiver, setValueReceiver] = useState('');
  const [valueNumber, setValueNumber] = useState('');
  const [valueDate, setValueDate] = useState(
    parseDate('2024-07-14'),
  );

  const { data: walletClient } = useWalletClient();

  const { setSafeInfo, safeInfo } = useSafeInfoContextProvider();

  async function handleCreateBackup() {
    const smartAccountSigner =
        await walletClientToSmartAccountSigner(walletClient);

    console.log(smartAccountSigner);

    const date = valueDate.toDate();
    const seconds = date.getTime() / 1000;

    console.log('safe info', safeInfo)

    console.log({
      smartAccountSigner,
      valueName,
      seconds,
      valueReceiver,
        number: +valueNumber
    })

    createBackup(smartAccountSigner, safeInfo.address, valueName, seconds, valueReceiver, +valueNumber)
        .then(() => console.log('success'))
  }

  return (
    <div className="flex flex-col gap-8 m-auto w-[600px]">
      <h1 className="text-center font-semibold text-lg">Create Backup</h1>
      {/* ================= */}
      <div className="">
        <CustomTooltip
          labelText="Name"
          tooltipContentText="Write the name of your backup for smooth further navigation.
            Example: Frodo's Journey, July 2024. "
        />
        <Input
          color="primary"
          placeholder="Name of Backup"
          value={valueName}
          onValueChange={setValueName}
        />
      </div>

      <div className="">
        <div className="flex gap-2">
          <div className=" w-4/6">
            <CustomTooltip
              labelText="Receiver"
              tooltipContentText="Enter the receiver's wallet address and make sure it's on the same network as your Safe wallet. Add extra if needed. Specify the amount of funds you would like to grant: use a fixed amount or % of your balance."
            />
          </div>
          <div className="flex justify-between font-semibold w-2/6 pb-2">
            Value
            <div className="flex">
              %
              <Switch
                className="pl-2"
                color="default"
                isSelected={isFixed}
                size="sm"
                onValueChange={setIsFixed}
              />
              Fixed
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-4/6">
            <Input
              color="primary"
              placeholder="Name of Backup"
              value={valueReceiver}
              onValueChange={setValueReceiver}
            />
          </div>
          <div className="w-2/6">
            <Input
              color="primary"
              placeholder="Name of Backup"
              type="number"
              value={valueNumber}
              onValueChange={setValueNumber}
            />
          </div>
          <div />
        </div>
      </div>

      <div className="">
        <CustomTooltip
          labelText="Initiation Date"
          tooltipContentText="On the initiation date, the recovery process will be executed and your backup will be transfered. Input data wisely, as the contract execution is unstoppable. Before specified date, you can edit or delete the backup."
        />
        <DatePicker
          className=""
          color="primary"
          value={valueDate}
          onChange={setValueDate}
        />
      </div>
      {/* ================= */}
      <div className="text-center">
        <Button
          className="font-semibold"
          color="primary"
          size="lg"
          onClick={() => handleCreateBackup()}
        >
          Create Backup
        </Button>
      </div>
    </div>
  );
}
