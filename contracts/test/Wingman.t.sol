// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { Test } from "forge-std/Test.sol";
import {
    RhinestoneModuleKit,
    ModuleKitHelpers,
    ModuleKitUserOp,
    AccountInstance,
    UserOpData
} from "modulekit/ModuleKit.sol";
import { MODULE_TYPE_EXECUTOR } from "modulekit/external/ERC7579.sol";
import { Wingman } from "src/Wingman.sol";
import "forge-std/console2.sol";

contract WingmanTest is RhinestoneModuleKit, Test {
    using ModuleKitHelpers for *;
    using ModuleKitUserOp for *;

    // account and modules
    AccountInstance internal instance;
    Wingman internal wingman;

    function setUp() public {
        init();

        // Create the wingman
        wingman = new Wingman();
        vm.label(address(wingman), "Wingman");

        // Create the account and install the wingman
        instance = makeAccountInstance("Wingman");
        vm.deal(address(instance.account), 10 ether);

        instance.installModule({
            moduleTypeId: MODULE_TYPE_EXECUTOR,
            module: address(wingman),
            data: ""
        });
    }

    function testExec() public {
        Wingman.Beneficiary[] memory beneficiaries = new Wingman.Beneficiary[](4);
        beneficiaries[0] = Wingman.Beneficiary(address(0x1), 0, 50);
        beneficiaries[1] = Wingman.Beneficiary(address(0x2), 0, 100);
        beneficiaries[2] = Wingman.Beneficiary(address(0x3), 25, 0);
        beneficiaries[3] = Wingman.Beneficiary(address(0x4), 75, 0);

        uint256 balanceBefore1 = address(0x1).balance;
        uint256 balanceBefore2 = address(0x2).balance;
        uint256 balanceBefore3 = address(0x3).balance;
        uint256 balanceBefore4 = address(0x4).balance;

        vm.warp(10_000_000);

        instance.getExecOps({
            target: address(wingman),
            value: 0,
            callData: abi.encodeWithSelector(
                Wingman.updateBackup.selector, "name1", 20_000_000, beneficiaries
            ),
            txValidator: address(instance.defaultValidator)
        }).execUserOps();

        vm.deal(address(instance.account), 350);
        Wingman.Backup memory backup = wingman.getBackup(address(instance.account), "name1");

        assertEq(backup.createdAt, 10_000_000);
        assertEq(backup.unlockAt, 20_000_000);
        assertEq(backup.beneficiaries.length, 4);
        assertEq(backup.beneficiaries[0].account, address(0x1));
        assertEq(backup.beneficiaries[0].amount, 50);
        assertEq(backup.beneficiaries[0].percentage, 0);
        assertEq(backup.beneficiaries[1].account, address(0x2));
        assertEq(backup.beneficiaries[1].amount, 100);
        assertEq(backup.beneficiaries[1].percentage, 0);

        vm.expectRevert();
        wingman.executeBackup(address(instance.account), "name1");
        //
        vm.warp(20_000_000);
        wingman.executeBackup(address(instance.account), "name1");

        assertEq(address(0x1).balance, balanceBefore1 + 50);
        assertEq(address(0x2).balance, balanceBefore2 + 100);
        assertEq(address(0x3).balance, balanceBefore3 + 50);
        assertEq(address(0x4).balance, balanceBefore4 + 150);

        // deleted
        backup = wingman.getBackup(address(instance.account), "name1");
        assertEq(backup.createdAt, 0);
    }
}
