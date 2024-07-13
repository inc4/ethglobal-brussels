'use client';

import {
  ENTRYPOINT_ADDRESS_V07,
} from "permissionless";
import {
  createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import {encodePacked, http} from "viem";
import {pimlicoPaymasterActions} from "permissionless/actions/pimlico";
import abi from "./module.abi.json";

import { bundlerUrl, publicClient } from "@/services/consts";
import {wingmanModuleAddress} from "./consts";

export const pimlicoBundlerClient = createPimlicoBundlerClient({
  transport: http(bundlerUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));

export function isWingmanModuleInitialized(smartAccountAddress) {
  return publicClient.readContract({
    address: wingmanModuleAddress,
    abi,
    functionName: 'isInitialized',
    args: [smartAccountAddress],
  })
}

async function installModule({smartClient, beneficiaryAddress, timeout, moduleType, hook, bundlerClient, moduleAddress, publicClient}) {
  const module = {
    module: wingmanModuleAddress,
    initData: encodePacked(['address', 'uint48'], [beneficiaryAddress, timeout]),
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }

  const opHash = await smartClient.installModule({
    type: module.type,
    address: module.module,
    context: module.initData,
  });

  const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: opHash })
  console.log('receipt', receipt)
}

const timeout = 123123123;

async function installModule({smartClient, beneficiaryAddress, timeout, moduleType, hook, account, bundlerClient, moduleAddress, publicClient}) {
  const module = {
    module: moduleAddress,
    initData: '0x',
    deInitData: '0x',
    additionalContext: '0x',
    type: 'executor',
    hook,
  }

  const ownableExecutorModule = "0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492"

  const moduleData = encodePacked(["address"], ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"])

  const userOpHash = await smartAccountClient.installModule({
    type: "executor",
    address: ownableExecutorModule,
    context: "0x",
  })

  const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash })
}

const { smartAccountClient, safeAccount, pimlicoBundlerClient, publicClient } = await createSmartWallet({
  privateKey: "0xba52725ea00c53ea649d0479eede2a3caf3c2cfdb0f90010db6d83b64c94ebfe",
  bundlerUrl: "https://api.pimlico.io/v2/sepolia/rpc?apikey=5499b16e-f9de-427c-8cd1-76417e0a7d22"
})



installModule({
  smartClient: smartAccountClient,
  beneficiaryAddress: beneficiary.address,
  timeout,
  moduleType: "executor",
  hook: '0x',
  account: safeAccount,
  bundlerClient: pimlicoBundlerClient,
  moduleAddress: "0xbDa1dE70eAE1A18BbfdCaE95B42b5Ff6d3352492",
  publicClient
});
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
