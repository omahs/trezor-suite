export const UTXO = {
    path: [44, 1, 0, 0, 0],
    coinbase: false,
    own: true,
    confirmations: 6,
    vout: 0,
    txid: 'b4dc0ffeee',
    amount: '102001',
};

export default [
    {
        description: 'builds a simple tx without change',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 192,
            fee: '2001',
            feePerByte: '10.421875',
            max: undefined,
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a simple tx without change and decimal fee',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10.33',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 192,
            fee: '2001',
            feePerByte: '10.421875', // feeRate is greater than requested because of dust limit
            max: undefined,
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds an incomplete tx without change',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    amount: '100000',
                    type: 'noaddress',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 192,
            fee: '2001',
            feePerByte: '10.421875',
            max: undefined,
            totalSpent: '102001',
            type: 'nonfinal',
        },
    },
    {
        description: 'fails on little funds',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    amount: '100000',
                    type: 'noaddress',
                },
            ],
            utxos: [
                {
                    ...UTXO,
                    amount: '10',
                },
            ],
        },
        result: {
            error: 'NOT-ENOUGH-FUNDS',
            type: 'error',
        },
    },
    {
        description: 'builds a send-max with large input',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    type: 'send-max',
                },
            ],
            utxos: [
                {
                    ...UTXO,
                    amount: '50000000000',
                },
            ],
        },
        result: {
            bytes: 192,
            fee: '1920',
            feePerByte: '10',
            max: '49999998080',
            totalSpent: '50000000000',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '49999998080',
                        },
                    ],
                },
                inputs: [
                    {
                        ...UTXO,
                        amount: '50000000000',
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a send-max',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    type: 'send-max',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 192,
            fee: '1920',
            feePerByte: '10',
            max: '100081',
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '100081',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'fails on weird output type',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    type: 'weird-output-type',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            error: 'WRONG-OUTPUT-TYPE',
            type: 'error',
        },
    },
    {
        description: 'fails on empty outputs + utxos input',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [],
            utxos: [],
        },
        result: {
            error: 'EMPTY',
            type: 'error',
        },
    },
    {
        description: 'fails on empty outputs input',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [],
            utxos: [UTXO],
        },
        result: {
            error: 'EMPTY',
            type: 'error',
        },
    },
    {
        description: 'fails on empty utxos input',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    type: 'send-max',
                },
            ],
            utxos: [],
        },
        result: {
            error: 'NOT-ENOUGH-FUNDS',
            type: 'error',
        },
    },
    {
        description: 'fails on bad feeRate - zero',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: 0,
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            error: 'INCORRECT-FEE-RATE',
            type: 'error',
        },
    },
    {
        description: 'fails on bad feeRate - NaN',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: NaN,
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            error: 'INCORRECT-FEE-RATE',
            type: 'error',
        },
    },
    {
        description: 'builds a simple tx with two outputs and change',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '30000',
                    type: 'complete',
                },
                {
                    address: '1LetUsDestroyBitcoinTogether398Nrg',
                    amount: '20000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 260,
            fee: '2600',
            feePerByte: '10',
            max: undefined,
            totalSpent: '52600',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0, 2],
                    sorted: [
                        {
                            address: '1LetUsDestroyBitcoinTogether398Nrg',
                            amount: '20000',
                        },
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '30000',
                        },
                        {
                            path: [44, 1, 1, 0],
                            amount: '49401',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a simple tx with two outputs and change (decimal feeRate)',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10.71',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '30000',
                    type: 'complete',
                },
                {
                    address: '1LetUsDestroyBitcoinTogether398Nrg',
                    amount: '20000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 260,
            fee: '2785', // 260 * 10.71
            feePerByte: '10.711538461538462',
            max: undefined,
            totalSpent: '52785',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0, 2],
                    sorted: [
                        {
                            address: '1LetUsDestroyBitcoinTogether398Nrg',
                            amount: '20000',
                        },
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '30000',
                        },
                        {
                            path: [44, 1, 1, 0],
                            amount: '49216',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a simple tx with two outputs and change (p2sh/segwit)',
        request: {
            txType: 'p2sh',
            basePath: [49, 0, 0],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr',
                    amount: '30000',
                    type: 'complete',
                },
                {
                    address: '3FyVFsEyyBPzHjD3qUEgX7Jsn4tcHNZFkn',
                    amount: '20000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 198,
            fee: '1980',
            feePerByte: '10',
            max: undefined,
            totalSpent: '51980',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0, 2],
                    sorted: [
                        {
                            address: '3FyVFsEyyBPzHjD3qUEgX7Jsn4tcHNZFkn',
                            amount: '20000',
                        },
                        {
                            address: '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr',
                            amount: '30000',
                        },
                        {
                            path: [49, 0, 0, 1, 0],
                            amount: '50021',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'prefers a more confirmed input',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    ...UTXO,
                    confirmations: 100,
                    vout: 1,
                },
                {
                    ...UTXO,
                    vout: 2,
                },
            ],
        },
        result: {
            bytes: 192,
            fee: '2001',
            feePerByte: '10.421875',
            max: undefined,
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [
                    {
                        ...UTXO,
                        confirmations: 100,
                        vout: 1,
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description: 'fails on two send maxes',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    type: 'send-max',
                },
                {
                    address: '1LetUsDestroyBitcoinTogether398Nrg',
                    type: 'send-max',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            error: 'TWO-SEND-MAX',
            type: 'error',
        },
    },
    {
        description: 'two inputs',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '200000',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    ...UTXO,
                    vout: 1,
                },
                {
                    ...UTXO,
                    vout: 2,
                },
            ],
        },
        result: {
            bytes: 340,
            fee: '4002',
            feePerByte: '11.770588235294118',
            max: undefined,
            totalSpent: '204002',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '200000',
                        },
                    ],
                },
                inputs: [
                    {
                        ...UTXO,
                        vout: 1,
                    },
                    {
                        ...UTXO,
                        vout: 2,
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a p2sh tx with two same value outputs (mixed p2sh + p2pkh) and change',
        request: {
            txType: 'p2sh',
            basePath: [44, 0, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr',
                    amount: '30000',
                    type: 'complete',
                },
                {
                    address: '1LetUsDestroyBitcoinTogether398Nrg',
                    amount: '30000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 200,
            fee: '2000',
            feePerByte: '10',
            max: undefined,
            totalSpent: '62000',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0, 2],
                    sorted: [
                        {
                            address: '1LetUsDestroyBitcoinTogether398Nrg',
                            amount: '30000',
                        },
                        {
                            address: '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr',
                            amount: '30000',
                        },
                        {
                            path: [44, 0, 1, 1, 0],
                            amount: '40001',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'explicit dust threshold stops change (ps2h/segwit)',
        request: {
            txType: 'p2sh',
            basePath: [49, 0, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 54600,
            feeRate: '10',
            outputs: [
                {
                    address: '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr',
                    amount: '928960',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    ...UTXO,
                    amount: '972463',
                },
            ],
        },
        result: {
            bytes: 134,
            fee: '43503',
            feePerByte: '324.64925373134326',
            max: undefined,
            totalSpent: '972463',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '3LRW7jeCvQCRdPF8S3yUCfRAx4eqXFmdcr',
                            amount: '928960',
                        },
                    ],
                },
                inputs: [
                    {
                        ...UTXO,
                        amount: '972463',
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a tx with 1 op-return and change',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    dataHex: 'deadbeef',
                    type: 'opreturn',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 207,
            fee: '2070',
            feePerByte: '10',
            max: undefined,
            totalSpent: '2070',
            transaction: {
                PERM_outputs: {
                    permutation: [0, 1],
                    sorted: [
                        {
                            opReturnData: {
                                type: 'Buffer',
                                data: [222, 173, 190, 239],
                            },
                        },
                        {
                            path: [44, 1, 1, 0],
                            amount: '99931',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a tx with 2 op-returns and change',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    dataHex: 'deadbeef',
                    type: 'opreturn',
                },
                {
                    dataHex: 'c0ffee',
                    type: 'opreturn',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 221,
            fee: '2210',
            feePerByte: '10',
            max: undefined,
            totalSpent: '2210',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0, 2],
                    sorted: [
                        {
                            opReturnData: {
                                type: 'Buffer',
                                data: [192, 255, 238],
                            },
                        },
                        {
                            opReturnData: {
                                type: 'Buffer',
                                data: [222, 173, 190, 239],
                            },
                        },
                        {
                            path: [44, 1, 1, 0],
                            amount: '99791',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a simple tx without change (recv bech32/p2wpkh)',
        request: {
            txType: 'p2wpkh',
            basePath: [84, 0, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 110,
            fee: '2001',
            feePerByte: '18.19090909090909',
            max: undefined,
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a simple tx without change (recv p2sh)',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '3NukJ6fYZJ5Kk8bPjycAnruZkE5Q7UW7i8',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 190,
            fee: '2001',
            feePerByte: '10.531578947368422',
            max: undefined,
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: '3NukJ6fYZJ5Kk8bPjycAnruZkE5Q7UW7i8',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a simple tx without change (recv bech32/p2tr)',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    ...UTXO,
                    amount: '103001',
                },
            ],
        },
        result: {
            bytes: 201,
            fee: '3001',
            feePerByte: '14.930348258706468',
            max: undefined,
            totalSpent: '103001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address:
                                'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [
                    {
                        ...UTXO,
                        amount: '103001',
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description: 'builds a send-max-noaddress',
        request: {
            basePath: [44, 1],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    type: 'send-max-noaddress',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 192,
            fee: '1920',
            feePerByte: '10',
            max: '100081',
            totalSpent: '102001',
            type: 'nonfinal',
        },
    },
    {
        description: 'builds a simple tx without change (cashaddr)',
        request: {
            basePath: [44, 1],
            changeAddress: 'bitcoincash:qzppkat2v7xu9fr3yeuqdnggjqqltrs7pcg8swvhl0',
            network: 'bitcoincash',
            changeId: 0,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: 'bitcoincash:qp6e6enhpy0fwwu7nkvlr8rgl06ru0c9lywalz8st5',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [UTXO],
        },
        result: {
            bytes: 192,
            fee: '2001',
            feePerByte: '10.421875',
            max: undefined,
            totalSpent: '102001',
            transaction: {
                PERM_outputs: {
                    permutation: [0],
                    sorted: [
                        {
                            address: 'bitcoincash:qp6e6enhpy0fwwu7nkvlr8rgl06ru0c9lywalz8st5',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [UTXO],
            },
            type: 'final',
        },
    },
    {
        description: 'use required (coinbase + unconfirmed) instead of more suitable utxo',
        request: {
            basePath: [44, 1, 0],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 1,
            dustThreshold: 546,
            feeRate: '10',
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '100000',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    vout: 0,
                    txid: 'a4dc0ffeee',
                    amount: '65291',
                    coinbase: true,
                    confirmations: 1,
                    own: false,
                    required: true,
                },
                {
                    vout: 0,
                    txid: 'c4dc0ffeee',
                    amount: '202001',
                    coinbase: false,
                    confirmations: 6,
                    own: true,
                },
                {
                    vout: 0,
                    txid: 'b4dc0ffeee',
                    amount: '55291',
                    coinbase: false,
                    confirmations: 1,
                    own: false,
                    required: true,
                },
                {
                    vout: 0,
                    txid: 'd4dc0ffeee',
                    amount: '200000',
                    coinbase: false,
                    confirmations: 60,
                    own: true,
                },
            ],
        },
        result: {
            bytes: 374,
            fee: '3740',
            feePerByte: '10',
            max: undefined,
            totalSpent: '103740',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0],
                    sorted: [
                        {
                            amount: '16842',
                            path: [44, 1, 0, 1, 1],
                        },
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '100000',
                        },
                    ],
                },
                inputs: [
                    {
                        txid: 'a4dc0ffeee',
                        vout: 0,
                        amount: '65291',
                        coinbase: true,
                        confirmations: 1,
                        own: false,
                        required: true,
                    },
                    {
                        txid: 'b4dc0ffeee',
                        vout: 0,
                        amount: '55291',
                        coinbase: false,
                        confirmations: 1,
                        own: false,
                        required: true,
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description: 'skip inputs/outputs permutation',
        request: {
            basePath: [44, 1, 0],
            changeAddress: '1CrwjoKxvdbAnPcGzYjpvZ4no4S71neKXT',
            changeId: 1,
            dustThreshold: 546,
            feeRate: '10',
            skipPermutation: true,
            outputs: [
                {
                    address: '1BitcoinEaterAddressDontSendf59kuE',
                    amount: '70000',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    txid: 'a4dc0ffeee',
                    vout: 0,
                    amount: '65291',
                    coinbase: false,
                    confirmations: 6,
                    own: false,
                },
                {
                    txid: 'b4dc0ffeee',
                    vout: 1,
                    amount: '55291',
                    coinbase: false,
                    confirmations: 6,
                    own: false,
                },
            ],
        },
        result: {
            bytes: 374,
            fee: '3740',
            feePerByte: '10',
            max: undefined,
            totalSpent: '73740',
            transaction: {
                PERM_outputs: {
                    permutation: [0, 1],
                    sorted: [
                        {
                            address: '1BitcoinEaterAddressDontSendf59kuE',
                            amount: '70000',
                        },
                        {
                            amount: '46842',
                            path: [44, 1, 0, 1, 1],
                        },
                    ],
                },
                inputs: [
                    {
                        txid: 'a4dc0ffeee',
                        vout: 0,
                        amount: '65291',
                        coinbase: false,
                        confirmations: 6,
                        own: false,
                    },
                    {
                        txid: 'b4dc0ffeee',
                        vout: 1,
                        amount: '55291',
                        coinbase: false,
                        confirmations: 6,
                        own: false,
                    },
                ],
            },
            type: 'final',
        },
    },
    {
        description:
            'builds a Dogecoin tx with change and both input and one of the outputs above MAX_SAFE_INTEGER',
        request: {
            basePath: [2147483692, 2147483651, 2147483648],
            changeAddress: 'DKu2a8Wo6zC2dmBBYXwUG3fxWDHbKnNiPj',
            changeId: 0,
            dustThreshold: 999999,
            feeRate: '1000',
            network: 'doge',
            outputs: [
                {
                    address: 'DDn7UV1CrqVefzwrHyw7H2zEZZKqfzR2ZD',
                    amount: '11556856849999734000',
                    type: 'complete',
                },
            ],
            utxos: [
                {
                    coinbase: false,
                    confirmations: 6,
                    own: false,
                    txid: '78c3ee88226c7f63060fbf27ab0450961c09241bfd56a12ce164881791c7c6e5',
                    vout: 1,
                    amount: '11556856856800000000',
                },
            ],
        },
        result: {
            bytes: 226,
            fee: '226000',
            feePerByte: '1000',
            max: undefined,
            totalSpent: '11556856849999960000',
            transaction: {
                PERM_outputs: {
                    permutation: [1, 0],
                    sorted: [
                        { path: [2147483692, 2147483651, 2147483648, 1, 0], amount: '6800040000' },
                        {
                            address: 'DDn7UV1CrqVefzwrHyw7H2zEZZKqfzR2ZD',
                            amount: '11556856849999734000',
                        },
                    ],
                },
                inputs: [
                    {
                        coinbase: false,
                        confirmations: 6,
                        own: false,
                        txid: '78c3ee88226c7f63060fbf27ab0450961c09241bfd56a12ce164881791c7c6e5',
                        vout: 1,
                        amount: '11556856856800000000',
                    },
                ],
            },
            type: 'final',
        },
    },
];
