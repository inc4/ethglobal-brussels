import { getWeb3Wingman } from "@rhinestone/module-sdk";
import { privateKeyToAccount } from "viem/accounts";
import {pimlicoBundlerClient, publicClient, safeAccount, smartAccountClient} from "./smart-account.js";

const nominee = privateKeyToAccount("");

const module = await getWeb3Wingman({
    nominee: nominee.address,
    timeout: "100", // in seconds
    moduleType: "validator",
    account: safeAccount,
    client: publicClient
});

const opHash = await smartAccountClient.installModule({
    type: module.type,
    address: module.module,
    context: module.data,
});

await pimlicoBundlerClient.waitForUserOperationReceipt({
    hash: opHash,
    timeout: 100000,
});

console.log(module)
