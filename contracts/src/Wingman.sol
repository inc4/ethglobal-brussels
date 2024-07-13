// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.25;

import { ERC7579ValidatorBase, ERC7579HookBase } from "modulekit/Modules.sol";
import { PackedUserOperation } from "modulekit/ModuleKit.sol";

/**
 * @title Wingman
 * @dev TODO
 * @author inc4
 */
contract Wingman is ERC7579HookBase, ERC7579ValidatorBase {
    function onInstall(bytes calldata data) external {
    }

    function onUninstall(bytes calldata) external override {
    }

    function isInitialized(address smartAccount) public view returns (bool) {
        return true;
    }

    function isModuleType(uint256 typeID) external pure override returns (bool) {
        return typeID == TYPE_HOOK || typeID == TYPE_VALIDATOR;
    }

    function name() external pure virtual returns (string memory) {
        return "Web3Wingman";
    }

    function version() external pure virtual returns (string memory) {
        return "0.1.0";
    }
}
