'use client';

import {
  ENTRYPOINT_ADDRESS_V07,
} from "permissionless";
import {
  createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import {http} from "viem";
import {pimlicoPaymasterActions} from "permissionless/actions/pimlico";
import abi from "./module.abi.json";

import { bundlerUrl, publicClient } from "@/services/consts";
import {wingmanModuleAddress} from "./consts";
import {getAccount, installModule} from "@rhinestone/module-sdk";

export const pimlicoBundlerClient = createPimlicoBundlerClient({
  transport: http(bundlerUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));


export function isWingmanModuleInitialized(smartAccountClient) {
  return smartAccountClient.isModuleInstalled({
    address: wingmanModuleAddress,
    type: 'executor',
    context: '0x',
  })
}

export async function installWingmanModule(smartAccountClient) {
  const module = {
    module: wingmanModuleAddress,
    initData: '0x',
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook: '0x',
  }

  const opHash = await smartAccountClient.installModule({
    type: module.type,
    address: module.module,
    context: module.initData,
  });

  const receipt = await pimlicoBundlerClient.waitForUserOperationReceipt({hash: opHash, timeout: 100000})

  console.log(receipt);
  return receipt
}

// export async function installWingmanModule(smartAccountClient) {
//   const module = {
//     module: "0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492",
//     initData: '0x',
//     deInitData: '0x',
//     additionalContext: '0x',
//     type: "executor",
//     hook: "0x",
//   }
//
//   const account = getAccount({
//     address: smartAccountClient.account.address,
//     type: "safe",
//   });
//
//   const opRes = await installModule({
//     client: publicClient, // The client object of type PublicClient from viem
//     account, // The account object
//     module, //
//   })
//
//   console.log(opRes);
// }

// installModule({
//   smartClient: smartAccountClient,
//   beneficiaryAddress: beneficiary.address,
//   timeout,
//   moduleType: "executor",
//   hook: '0x',
//   account: safeAccount,
//   bundlerClient: pimlicoBundlerClient,
//   moduleAddress: "0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492",
//   publicClient
// });

//
// installModule({
//   smartClient: smartAccountClient,
//   beneficiaryAddress: beneficiary.address,
//   timeout,
//   moduleType: "validator",
//   hook: '0x',
//   account: safeAccount,
//   bundlerClient: pimlicoBundlerClient,
//   moduleAddress: "0x6A53E204b8A21dfD64516ff27484e6113640CB96",
//   publicClient
// })
