'use client';

import { useCallback } from 'react';
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

import { columns, users } from './data';

import deleteIcon from '@/images/delete.svg';
import editIcon from '@/images/edit.svg';
import ghostIcon from '@/images/ghost.svg';

export default function BackUpsPage() {
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
          className="font-semibold"
          color="primary"
          size="lg"
          as={Link}
          // TODO add link to add page
          href={'/'}
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
