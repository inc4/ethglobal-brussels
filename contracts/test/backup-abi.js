export const generateBackupAbiWithArgs = ({name, unlockAt, beneficiaries}) => ({
    abi: [
        {
            name: "updateBackup",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
                { internalType: 'string', name: 'name', type: 'string' },
                { internalType: 'uint48', name: 'unlockAt', type: 'uint48' },
                {
                    internalType: 'struct Wingman.Beneficiary[]',
                    name: 'beneficiaries',
                    type: 'tuple[]',
                    components: [
                        { internalType: 'address', name: 'account', type: 'address' },
                        { internalType: 'uint8', name: 'percentage', type: 'uint8' },
                        { internalType: 'uint256', name: 'amount', type: 'uint256' }
                    ]
                }
            ],
            outputs: []
        }
    ],
    functionName: "updateBackup",
    args: [name, unlockAt, beneficiaries]
})
