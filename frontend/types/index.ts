import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Define the Beneficiary interface
interface Beneficiary {
  account: string; // corresponds to "address" type
  percentage: number; // corresponds to "uint8" type
  amount: string; // corresponds to "uint256" type, use string to handle large integers safely
}

// Define the Backup interface
export interface IBackup {
  createdAt: number; // corresponds to "uint48" type
  unlockAt: number; // corresponds to "uint48" type
  beneficiaries: Beneficiary[]; // array of Beneficiary objects
}
