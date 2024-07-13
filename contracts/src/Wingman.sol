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
    mapping(address => Backup[]) public backups;

    struct Backup {
	string name;
        uint48 createdAt;
	uint48 initiatedAt;
	uint48 expiresAt;
	Beneficiary[] beneficiaries;
    }

    struct Beneficiary {
	address account;
	uint8 percentage;
	uint256 amount;
    }

    function onInstall(bytes calldata data) external {
    }

    function onUninstall(bytes calldata) external override {
    }

    function isInitialized(address smartAccount) public view returns (bool) {
        if (backups[smartAccount].length > 0) {
	    return true;
	}
    }

    function isModuleType(uint256 typeID) external pure override returns (bool) {
        return typeID == TYPE_HOOK || typeID == TYPE_VALIDATOR;
    }

    function _postCheck(address account, bytes calldata hookData) internal override { }

    function _preCheck(address account, address, uint256, bytes calldata) internal override returns (bytes memory hookData) {
        return "";
    }

    function isValidSignatureWithSender(address, bytes32, bytes calldata) external pure override returns (bytes4) {
        return "";
    }

    function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external override returns (ValidationData) {
    }

    function name() external pure virtual returns (string memory) {
        return "Web3Wingman";
    }

    function version() external pure virtual returns (string memory) {
        return "0.1.0";
    }
}
