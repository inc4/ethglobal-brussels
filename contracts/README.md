# Web3 Wingman ERC-7579 Module

The ERC-7579 Module smart contract handles the secure transfer of funds based
on user conditions.

## Prerequisites

Install `foundry`.
https://book.getfoundry.sh/getting-started/installation

### Install dependencies

```shell
pnpm install
```

### Build contract

```shell
forge build
```

### Testing contract

```shell
forge test
```

### Deploying modules

1. Create a `.env` file in the root directory based on the `.env.example` file and fill in the variables.
2. Run the following command:

```shell
source .env && forge script script/DeployModule.s.sol:DeployModuleScript --rpc-url $DEPLOYMENT_RPC --broadcast --sender $DEPLOYMENT_SENDER --verify
```

Your module is now deployed to the blockchain and verified on Etherscan.

If the verification fails, you can manually verify it on Etherscan using the following command:

```shell
source .env && forge verify-contract --chain-id [YOUR_CHAIN_ID] --watch --etherscan-api-key $ETHERSCAN_API_KEY [YOUR_MODULE_ADDRESS] src/[PATH_TO_MODULE].sol:[MODULE_CONTRACT_NAME]
```
