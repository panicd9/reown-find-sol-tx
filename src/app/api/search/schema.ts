export const schema = {
    "name": "transaction_filter",
    "schema": {
        "type": "object",
        "properties": {
            "account": {
                "type": "string",
                "description": "Account searched for."
            },
            "types": {
                "type": "array",
                "description": "Transaction types currently supported.",
                "items": {
                    "type": "string",
                    "enum": [
                        "SOLTransfer",
                        "TokenTransfer",
                        "NFTMint",
                        "Staking"
                    ]
                }
            },
            "programs": {
                "type": "array",
                "description": "Program ID (e.g., 'TOKEN_2022_PROGRAM_ID').",
                "items": {
                    "type": "string"
                }
            },
            "timeRange": {
                "type": "object",
                "description": "Time range filter.",
                "properties": {
                    "start": {
                        "type": "number",
                        "description": "Unix timestamp (seconds since the epoch), e.g., 1672531200"
                    },
                    "end": {
                        "type": "number",
                        "description": "Unix timestamp (seconds since the epoch), e.g., 1672617600"
                    }
                },
                "required": [
                    "start",
                    "end"
                ],
                "additionalProperties": false
            },
            "tokenFilter": {
                "type": "array",
                "description": "Token-related filter (e.g., amount, token address).",
                "items": {
                    "type": "object",
                    "properties": {
                        "tokenAddress": {
                            "type": "string",
                            "description": "Token mint address."
                        },
                        "amountLessThan": {
                            "type": "number",
                            "description": "Filter by amount less than specified value."
                        },
                        "amountGreaterThan": {
                            "type": "number",
                            "description": "Filter by amount greater than specified value."
                        },
                        "direction": {
                            "type": "string",
                            "enum": [
                                "sent",
                                "received"
                            ],
                            "description": "Filter by transaction direction."
                        }
                    },
                    "required": [
                        "tokenAddress",
                        "amountLessThan",
                        "amountGreaterThan",
                        "direction"
                    ],
                    "additionalProperties": false
                }
            },
            "status": {
                "type": "string",
                "enum": [
                    "successful",
                    "failed"
                ],
                "description": "Status filter."
            },
            "memo": {
                "type": "string",
                "description": "Filter by memo text."
            },
            "feeFilter": {
                "type": "object",
                "description": "Fee-related filter.",
                "properties": {
                    "feeGreaterThan": {
                        "type": "number",
                        "description": "Filter by transactions with fees greater than the specified value."
                    },
                    "feeLessThan": {
                        "type": "number",
                        "description": "Filter by transactions with fees less than the specified value."
                    }
                },
                "required": [
                    "feeGreaterThan",
                    "feeLessThan"
                ],
                "additionalProperties": false
            },
            "instructionCountFilter": {
                "type": "object",
                "description": "Instruction count filter.",
                "properties": {
                    "greaterThan": {
                        "type": "number",
                        "description": "Filter by transactions with more than the specified number of instructions."
                    },
                    "lessThan": {
                        "type": "number",
                        "description": "Filter by transactions with less than the specified number of instructions."
                    }
                },
                "required": [
                    "greaterThan",
                    "lessThan"
                ],
                "additionalProperties": false
            },
            "txNum": {
                "type": "number",
                "description": "Number of transactions returned."
            }
        },
        "required": [
            "account",
            "types",
            "programs",
            "timeRange",
            "tokenFilter",
            "status",
            "memo",
            "feeFilter",
            "instructionCountFilter",
            "txNum"
        ],
        "additionalProperties": false
    },
    "strict": true
};