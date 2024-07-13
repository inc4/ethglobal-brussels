'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Tooltip } from '@nextui-org/tooltip';

import infoIconBlue from '@/images/info-circle-blue.svg';
import infoIconGrey from '@/images/info-circle-grey.svg';

interface IPropsCustomTooltip {
  labelText: string;
  tooltipContentText: string;
}

const CustomTooltip: FC<IPropsCustomTooltip> = ({
  labelText,
  tooltipContentText,
}) => (
  <div className="flex gap-2 font-semibold pb-2">
    {labelText}
    <Tooltip
      content={
        <div className="flex gap-2 px-1 py-2 ">
          <div className="">
            <Image alt="info icon" className="w-6 h-6" src={infoIconBlue} />
          </div>
          <div className="text-tiny max-w-[222px]">{tooltipContentText}</div>
        </div>
      }
    >
      <Image alt="info icon" src={infoIconGrey} />
    </Tooltip>
  </div>
);

export default CustomTooltip;
