'use client';

import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';

// TODO dele mocked data
import { columns, users } from './data';

import deleteIcon from '@/images/delete.svg';
import editIcon from '@/images/edit.svg';
import ghostIcon from '@/images/ghost.svg';
import useSmartAccountClient from '@/hooks/useSmartAccountClient';
// import { getBackups } from '@/services/getBackups';
// import { wingmanModuleAddress, publicClient } from '@/services/consts';
// import abi from '@/services/module.abi.json';

const publicClient = createPublicClient({
  transport: http('https://rpc.ankr.com/eth_sepolia'),
  chain: sepolia,
});

const moduleAddress = '0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492';
const ownerAddress = '0xED9586AD3a6A512ce5c2d0C6a5bf8972c00137e2';

const getBackupsAbi = [
  {
    type: 'function',
    name: 'getBackups',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'string[]',
        internalType: 'string[]',
      },
    ],
  },
];

async function getBackups() {
  try {
    const backups = await publicClient.readContract({
      address: moduleAddress,
      abi: getBackupsAbi,
      functionName: 'getBackups',
      args: [ownerAddress],
    });

    console.log('Backups:', backups);

    return backups;
  } catch (error) {
    console.error('Error fetching backups:', error);
    throw error;
  }
}

// getBackups()
//   .then((backups) => {
//     console.log('Backups:', backups);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

export default function BackUpsPage() {
  const { isModuleSupported, isWingmanDeployed, smartAccountClient } =
    useSmartAccountClient();
  // const { address } = useUniversalAccountInfo();

  useEffect(() => {
    getBackups()
      .then((backups) => {
        console.log('Backups:', backups);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const renderCell = useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return <div className="font-semibold">{user.name}</div>;
      case 'receiver':
        return (
          <div className="flex flex-col">
            <p className="font-semibold">Receiver</p>
            <div className="">
              {Array.isArray(user.receiver)
                ? user.receiver.map((item: any) => <p key="item">{item}</p>)
                : user.receiver}
            </div>
          </div>
        );
      case 'value':
        return (
          <div className="flex flex-col">
            <p className="font-semibold">Value</p>
            <div className="">
              {Array.isArray(user.value)
                ? user.value.map((item: any) => <p key="item">{item}</p>)
                : user.value}
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="flex flex-col">
            <p className="font-semibold">Initiation Date</p>
            <p className="">{user.value}</p>
          </div>
        );
      case 'actions':
        return (
          <div className="relative flex justify-end gap-2">
            <Tooltip content="Edit Backup">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Image alt="edit icon" src={editIcon} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Backup">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Image alt="edit icon" src={deleteIcon} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return <>{user[columnKey]}</>;
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between pb-8">
        <h1 className=" content-center text-lg font-semibold">Your Backups</h1>
        <Button
          as={Link}
          className="font-semibold"
          color="primary"
          href={'/create'}
          size="lg"
        >
          Create Backup
        </Button>
      </div>
      <div className="text-[#AFB8CE] flex justify-center p-6 bg-white rounded-xl mb-2">
        <Image alt="ghost icon" src={ghostIcon} /> Start with creating a new
        Backup!
      </div>
      <Table
        fullWidth
        hideHeader
        isStriped
        removeWrapper
        aria-label="Backup table"
      >
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item: any) => (
            <TableRow
              key={item.id}
              className=" border-b-[12px] border-transparent bg-white"
            >
              {(columnKey: any) => (
                <TableCell className="py-4 text-sm align-top">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
