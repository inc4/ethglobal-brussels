// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC7579ExecutorBase} from "modulekit/Modules.sol";
import {ModeLib} from "erc7579/lib/ModeLib.sol";
import {ExecutionLib} from "erc7579/lib/ExecutionLib.sol";
import {Execution, IERC7579Account} from "erc7579/interfaces/IERC7579Account.sol";


contract Wingman is ERC7579ExecutorBase {
    mapping(address => string[]) internal backupNames;
    mapping(address => mapping(string => Backup)) internal backups;

    struct Backup {
        uint48 createdAt;
        uint48 unlockAt;
        Beneficiary[] beneficiaries;
    }

    struct Beneficiary {
        address account;
        uint8 percentage;
        uint256 amount;
    }

    event BackupUpdated(address indexed account, string indexed name, Backup backup);
    event BackupExecuted(address indexed account, string indexed name);

    function onInstall(bytes calldata data) external override {}

    function onUninstall(bytes calldata data) external override {
        _removeBackups(msg.sender);
    }

    function isInitialized(address smartAccount) external view returns (bool) {}


    function updateBackup(string memory name, uint48 unlockAt, Beneficiary[] memory beneficiaries) public {
        require(unlockAt > block.timestamp, "Unlock time must be in the future");

        Backup storage backup = backups[msg.sender][name];

        if (backup.createdAt == 0) { // new backup
            backup.createdAt = uint48(block.timestamp);
            backupNames[msg.sender].push(name);
        }

        backup.unlockAt = unlockAt;
        delete backup.beneficiaries;

        uint i;
        uint totalPercentage;
        uint benCount = beneficiaries.length;

        // beneficiaries with absolute amount
        for (; i < benCount; i++) {
            if (beneficiaries[i].amount == 0) break;   // goto percentage amounts
            require(beneficiaries[i].percentage == 0, "Both amount and percentage are not 0");

            backup.beneficiaries.push(beneficiaries[i]);
        }
        // beneficiaries with percent amount
        for (; i < benCount; i++) {
            require(beneficiaries[i].percentage > 0 && beneficiaries[i].percentage <= 100, "Invalid percentage");
            require(beneficiaries[i].amount == 0, "Both amount and percentage are not 0");

            totalPercentage += beneficiaries[i].percentage;
            backup.beneficiaries.push(beneficiaries[i]);
        }

        require(totalPercentage == 0 || totalPercentage == 100, "Total percentage must be 0 or 0");

        emit BackupUpdated(msg.sender, name, backup);
    }

    function removeBackup(string memory name) public {
        Backup storage backup = backups[msg.sender][name];
        require(backup.createdAt != 0, "Backup does not exist");
        _removeBackup(msg.sender, name);
    }


    function executeBackup(address owner, string memory name) public {
        Backup storage backup = backups[owner][name];
        require(backup.createdAt != 0, "Backup does not exist");
        require(block.timestamp >= backup.unlockAt, "Backup is not ready to be executed");

        uint balance = owner.balance;
        uint count = backup.beneficiaries.length;
        uint i;

        Execution[] memory executions = new Execution[](count);


        // absolute amounts
        for (; i < count; i++) {
            Beneficiary memory beneficiary = backup.beneficiaries[i];
            if (beneficiary.amount == 0 ) break;  // goto percentage amounts

            balance -= beneficiary.amount;
            executions[i] = Execution({
                target: beneficiary.account,
                value: beneficiary.amount,
                callData: ""
            });
        }

        // percent amounts
        for (; i < count; i++) {
            Beneficiary memory beneficiary = backup.beneficiaries[i];

            executions[i] = Execution({
                target: beneficiary.account,
                value: beneficiary.percentage * balance / 100,
                callData: ""
            });
        }


        IERC7579Account(owner).executeFromExecutor(
            ModeLib.encodeSimpleBatch(), ExecutionLib.encodeBatch(executions)
        );

        _removeBackup(owner, name);

        emit BackupExecuted(owner, name);
    }


    function getBackups(address owner) public view returns (string[] memory) {
        return backupNames[owner];
    }

    function getBackup(address owner, string calldata name) public view returns (Backup memory) {
        return backups[owner][name];
    }

    // INTERNAL


    function _removeBackup(address account, string memory name) internal {
        string[] storage userBackups = backupNames[account];
        uint count = userBackups.length;

        for (uint i = 0; i < count; i++) {
            if (_compareStr(userBackups[i], name)) {
                userBackups[i] = userBackups[userBackups.length - 1];
                userBackups.pop();

                delete backups[account][name];
                emit BackupUpdated(account, name, backups[account][name]);
                return;
            }
        }
        require(false, "Backup not found");
    }

    function _removeBackups(address account) internal {
        string[] storage userBackups = backupNames[account];
        uint count = userBackups.length;

        for (uint i = 0; i < count; i++) {
            string memory name = userBackups[count - i];
            userBackups.pop();

            delete backups[account][name];
            emit BackupUpdated(account, name, backups[account][name]);
        }
    }

    function _compareStr(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // module metadata

    /**
     * The name of the module
     *
     * @return name The name of the module
     */
    function name() external pure returns (string memory) {
        return "Wingman";
    }

    /**
     * The version of the module
     *
     * @return version The version of the module
     */
    function version() external pure returns (string memory) {
        return "0.0.1";
    }

    /**
     * Check if the module is of a certain type
     *
     * @param typeID The type ID to check
     *
     * @return true if the module is of the given type, false otherwise
     */
    function isModuleType(uint256 typeID) external pure override returns (bool) {
        return typeID == TYPE_EXECUTOR;
    }
}
