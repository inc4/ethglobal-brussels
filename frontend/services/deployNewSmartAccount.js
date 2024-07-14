import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";

import { publicClient } from "@/services/consts";

export function deployNewSmartAccount(signer) {
  return signerToSafeSmartAccount(publicClient, {
    signer,
    safeVersion: "1.4.1",
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    saltNonce: 15n,
    safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2",
    erc7579LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE",
  });
}
