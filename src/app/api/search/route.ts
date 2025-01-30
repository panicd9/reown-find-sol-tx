import { type NextRequest } from 'next/server'
import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';

import { Filter, FilterSchema } from '../../helpers/schema';
import { stablecoinMints } from '../../helpers/constants';

import { Connection, clusterApiUrl, PublicKey, ParsedTransactionWithMeta, ParsedInstruction, PartiallyDecodedInstruction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as Filters from "../../helpers/schema";
import { getAccount, getMint } from "@solana/spl-token";
// import { applyFilters, fetchTransactionsAndApplyFilters } from '../../helpers/filtering';

const openai = new OpenAI();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')
    const query = searchParams.get('query')
    console.log('query: ', query)

    if (!query) {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!address) {
        return new Response(JSON.stringify({ error: 'Address parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "Parse human language used for searching/filtering transactions on Solana blockchain and return Filter JSON object in required format.  If no address is provided use \"THIS_ADDRESS\" for account field. If user dont define specific Token but inputs \"stablecoin\" for tokenFilter return only 1 element with \"ALL_STABLECOINS\" for tokenFillter.tokenAddress field and \"null\" for tokenFilter.direction. If type is SOLTransfer, set tokenFilter.tokenAddress to \"NATIVE_SOL\".  You need time context. Time NOW is 1738187567. If user needs transactions from last X days, set timeRange.end to \"null\" and set timeRange.start at now minus X represented in unix time.\n1 Hour = 3600 Seconds\n1 Day = 86400 Seconds\n1 Week\t= 604800 Seconds\n1 Month (30.44 days) = 2629743 Seconds\n1 Year (365.24 days) = 31556926 Seconds"
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "All stablecoin transactions last 30 days"
                    }
                ]
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "{\n  \"account\": \"THIS_ADDRESS\",\n  \"types\": [\"TokenTransfer\"],\n  \"programs\": null,\n  \"timeRange\": {\n    \"start\": 1735507092,\n    \"end\": null\n  },\n  \"tokenFilter\": [\n    {\n      \"tokenAddress\": \"ALL_STABLECOINS\",\n      \"amountLessThan\": null,\n      \"amountGreaterThan\": null,\n      \"direction\": null,\n    }\n  ],\n  \"status\": \"successful\",\n  \"memo\": null,\n  \"feeFilter\": null,\n  \"instructionCountFilter\": null,\n  \"txNum\": null\n}"
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Last 3 transactions sending USDT"
                    }
                ]
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "{\n  \"account\": \"THIS_ADDRESS\",\n  \"types\": [\"TokenTransfer\"],\n  \"programs\": null,\n  \"timeRange\": {\n    \"start\": null,\n    \"end\": null\n  },\n  \"tokenFilter\": [\n    {\n      \"tokenAddress\": \"USDT\",\n      \"amountLessThan\": null,\n      \"amountGreaterThan\": null,\n      \"direction\": \"sent\"\n    }\n  ],\n  \"status\": \"successful\",\n  \"memo\": null,\n  \"feeFilter\": null,\n  \"instructionCountFilter\": null,\n  \"txNum\": 3\n}"
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "All SOL transfers greater than 0.01 SOL for 87egKZwVkDfgHP7jakP4C5XERz5MaU8owYNG4rQzQDN6"
                    }
                ]
            },
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "{\n  \"account\": \"87egKZwVkDfgHP7jakP4C5XERz5MaU8owYNG4rQzQDN6\",\n  \"types\": [\n    \"SOLTransfer\"\n  ],\n  \"programs\": null,\n  \"timeRange\": {\n    \"start\": null,\n    \"end\": null\n  },\n  \"tokenFilter\": [\n    {\n      \"tokenAddress\": \"NATIVE_SOL\",\n      \"amountLessThan\": null,\n      \"amountGreaterThan\": 0.01,\n      \"direction\": \"sent\"\n    }\n  ],\n  \"status\": \"successful\",\n  \"memo\": null,\n  \"feeFilter\": null,\n  \"instructionCountFilter\": null,\n  \"txNum\": null\n}"
                    }
                ]
            }
        ],
        store: true,
        response_format: zodResponseFormat(FilterSchema, 'transactions_filter'),
    })

    if (completion.choices[0].finish_reason === "length") {
        // Handle the case where the model did not return a complete response
        throw new Error("Incomplete response");
    }

    if (completion.choices[0].message.content == null) {
        return new Response(JSON.stringify({ error: 'No response content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const transactionFilter = JSON.parse(completion.choices[0].message.content) as Filter;

    if (transactionFilter.account === 'THIS_ADDRESS') {
        transactionFilter.account = address;
    }

    if (transactionFilter.tokenFilter) {
        if (transactionFilter.tokenFilter[0].tokenAddress === 'ALL_STABLECOINS') {
            let amountLessThan = transactionFilter.tokenFilter[0].amountLessThan;
            let amountGreaterThan = transactionFilter.tokenFilter[0].amountGreaterThan;
            let direction = transactionFilter.tokenFilter[0].direction;

            transactionFilter.tokenFilter = Object.values(stablecoinMints).map(tokenAddress => ({
                tokenAddress,
                amountLessThan: amountLessThan,
                amountGreaterThan: amountGreaterThan,
                direction: direction,
            }));
        }
    }

    if (transactionFilter.txNum === null) {
        transactionFilter.txNum = 5;
    }

    let results = await fetchTransactionsAndApplyFilters(transactionFilter);
    // let results = mockResults;

    console.log('Filter: ', transactionFilter);
    console.log('Results: ', results);

    return new Response(JSON.stringify({ query, results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

const mockResults = [
    {
        signature: '5iBvUHPzabvJ69XwspRbDZGiarTA6Vi6nG5AtRKnSzPmKnQ65mvKctmH6WGw7voiTayg7naDq5SxMQ28sbKTRXWP',
        time: 1737732293,
        action: 'TRANSFER',
        from: 'D5xJKhw44fy6SECd2JBVyMKFUTrifwvMTwiCPzDJdBQS',
        to: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        fromTokenAccount: 'FV5FNE3iM342q9ekdPhXzx6tejQN588KGsHiFRcoJ5zc',
        toTokenAccount: 'CTLrjNFMUBGgfM55d3K8hV22HEE6uQpkeoXqyeNxbTM5',
        amount: '5000000000',
        decimals: 6,
        token: 'kH6hPcpdJqeMAATYU7W4rzqZuzYTkYr6QqGYTLkpump'
    },
    {
        signature: '2m5fo2eG9neCNkhTDXwLi4UwQNRAezTVYUfTcooXJsniuhiuHJWCxd6Nm26sbnE3RgyF7w33WWhjd9mm8rrEvWoE',
        time: 1736823624,
        action: 'TRANSFER',
        from: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        to: '4SBpUJwh88EzRZJnxgYVi9yDc79oUYCNAhJdirRsfJX1',
        fromTokenAccount: 'G7Zef75oLzmkvR5xi2vgoszNPvPpGchmooUS8tpkMTxR',
        toTokenAccount: 'Ff94GhJ99c4pc2J4HvZbxmSz4k4A6g1XhikJCtQcAyeK',
        amount: '7268307',
        decimals: 6,
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    },
    {
        signature: 'T88Jp7CzpUKaP3CCh56dDZx85gojhyGzgJGKnnNrbqCchUVBj5sSphsj7uQMYs6kLKjGDt2p1muq4Txi9qdFMUg',
        time: 1736823596,
        action: 'TRANSFER',
        from: '',
        to: 'BQ72nSv9f3PRyRKCBnHLVrerrv37CYTHm5h3s9VSGQDV',
        fromTokenAccount: '8cYyX2E4qmDMVVXZuBG2XMyynRgq7fRFTUVSVCsatnbQ',
        toTokenAccount: '8ctcHN52LY21FEipCjr1MVWtoZa1irJQTPyAaTj72h7S',
        amount: '40000000',
        decimals: 9,
        token: 'So11111111111111111111111111111111111111112'
    },
    {
        signature: 'T88Jp7CzpUKaP3CCh56dDZx85gojhyGzgJGKnnNrbqCchUVBj5sSphsj7uQMYs6kLKjGDt2p1muq4Txi9qdFMUg',
        time: 1736823596,
        action: 'TRANSFER',
        from: 'BQ72nSv9f3PRyRKCBnHLVrerrv37CYTHm5h3s9VSGQDV',
        to: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        fromTokenAccount: '7u7cD7NxcZEuzRCBaYo8uVpotRdqZwez47vvuwzCov43',
        toTokenAccount: 'G7Zef75oLzmkvR5xi2vgoszNPvPpGchmooUS8tpkMTxR',
        amount: '7268307',
        decimals: 6,
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    },
    {
        signature: '5FSyfSPrvKRR6XbaHqz3UAybxRAUSFxzsFB9UoZPmQQ3R4JJyfsxxvpHSa9pUwCwdBEZ3XJUbyBh9S9nhwrGAxya',
        time: 1736823359,
        action: 'TRANSFER',
        from: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        to: '9tBgehN4wsnpxi2vhDhudGd8jmKYqgQtoE9Fj8Q9BV16',
        fromTokenAccount: 'omES6jFvRoENWR1KgrRebVyq9scEGkyDTETVyNvrX1h',
        toTokenAccount: 'JAHFsYKP91g77h3jEbei12jbx6hLgZGTE59hrUZzjPKr',
        amount: '100000000',
        decimals: 6,
        token: 'STREAMribRwybYpMmSYoCsQUdr6MZNXEqHgm7p1gu9M'
    },
    {
        signature: '5FSyfSPrvKRR6XbaHqz3UAybxRAUSFxzsFB9UoZPmQQ3R4JJyfsxxvpHSa9pUwCwdBEZ3XJUbyBh9S9nhwrGAxya',
        time: 1736823359,
        action: 'TRANSFER',
        from: '',
        to: '25mYnjJ2MXHZH6NvTTdA63JvjgRVcuiaj6MRiEQNs1Dq',
        fromTokenAccount: '3TfVRkiuTSt7ora4a38jqxzdXcU5HLNdhrBiiLYqanYR',
        toTokenAccount: '7dSiEK9yWTxxSWpMkjHpY968nJ4Xj4aNgK3sgM23nCeL',
        amount: '357995',
        decimals: 9,
        token: 'So11111111111111111111111111111111111111112'
    },
    {
        signature: '38pHCL95GcGJowevBZ9B6dbRrDPtFu8R4irBhikoJ3oGYcBAy3uwoivaL7j9nmQTWVLa2xzfbsArQjTtg1ktM3Y8',
        time: 1734568431,
        action: 'TRANSFER',
        from: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        to: 'EZwBgDqoWdxE4Yy8giuYH82P8GmvxryzWCbWKUWU8HLH',
        fromTokenAccount: '781KAnzgqQzscECAhVpxetMcF9BYpQiT6LppWStN66RU',
        toTokenAccount: 'B8xaPRfWS8Ufrd1F9p1PuXyEbSZJNwJPR3LEKtwFLFT8',
        amount: '854316173',
        decimals: 6,
        token: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
    },
    {
        signature: '5JQVVaVZMu1PyzZazwP45vQqY8u4AQ9uj11oNwDNWNw3PbmjRkWL5dn6otxhbmgfaz8h49LngYeHgxEGDHw8jH9r',
        time: 1734455350,
        action: 'TRANSFER',
        from: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        to: '3LoAYHuSd7Gh8d7RTFnhvYtiTiefdZ5ByamU42vkzd76',
        fromTokenAccount: 'GnaH5QqCLfxWdnAT734Vv3LBNpsVisNiY4V9JaCESvvM',
        toTokenAccount: '8pzTZozaSATj5XgpJNRScqphrPqnXAufgouzuUvNRjZJ',
        amount: '27840000000',
        decimals: 6,
        token: '2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv'
    },
    {
        signature: '5JQVVaVZMu1PyzZazwP45vQqY8u4AQ9uj11oNwDNWNw3PbmjRkWL5dn6otxhbmgfaz8h49LngYeHgxEGDHw8jH9r',
        time: 1734455350,
        action: 'TRANSFER',
        from: '3LoAYHuSd7Gh8d7RTFnhvYtiTiefdZ5ByamU42vkzd76',
        to: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        fromTokenAccount: 'A5LZUZCbcsTxU2oszHASHpe4Cbo44TTHNy7aan9P7fyA',
        toTokenAccount: '781KAnzgqQzscECAhVpxetMcF9BYpQiT6LppWStN66RU',
        amount: '854316173',
        decimals: 6,
        token: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'
    },
    {
        signature: '8Vmn8p5hCS2bmcTnLsv7U7K9JxuMd27dtvuphFgST8fU7jDjy2qjkETxmnDbGTXC8KjNSFwYrsg9StzcNinrkPe',
        time: 1734453912,
        action: 'TRANSFER',
        from: 'BsL9EiaD1FLhvE1z27s2vSLPCFU9yUY8bphscbunnRag',
        to: 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk',
        fromTokenAccount: '4hbDR2LT5iGGC3mXcbEsRybjWL8Pz3uEZ6YnBLeV91Ae',
        toTokenAccount: 'omES6jFvRoENWR1KgrRebVyq9scEGkyDTETVyNvrX1h',
        amount: '100000000',
        decimals: 6,
        token: 'STREAMribRwybYpMmSYoCsQUdr6MZNXEqHgm7p1gu9M'
    }
];

const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`, "confirmed");

async function getTransactionsForAddress(address: string): Promise<ParsedTransactionWithMeta[]> {
    
    const publicKey = new PublicKey(address);

    // Step 1: Get signatures for the address
    const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 100, // Adjust the limit as needed
    });

    // console.log("Signatures:", signatures);

    // Step 2: Get transaction details for each signature
    const transactions = [];
    for (const signatureInfo of signatures) {
        const tx = await connection.getParsedTransaction(signatureInfo.signature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
        });
        transactions.push(tx);
    }

    return transactions as ParsedTransactionWithMeta[];
}

// let txs: ParsedTransactionWithMeta[];

interface Entry {
    signature: string;
    slot?: number;
    time: number;
    action: string;
    from: string;
    fromTokenAccount?: string;
    to: string;
    toTokenAccount?: string;
    amount: number;
    token: string;
    decimals?: number;
}

export async function applyFilters(filter: Filters.Filter, txs: ParsedTransactionWithMeta[]): Promise<Entry[]> {
    const txTargetNum = filter.txNum || 10;
    const typeFilter = filter.types
    const timeRangeFilter: Filters.TimeRange = {
        start: filter.timeRange?.start || 0,
        end: filter.timeRange?.end || Date.now() / 1000
    }
    const status = filter.status || 'successful';
    const account = filter.account || 'B3HaLQyCbwQ5Kmwvj7PxS2no8sTB2yyijg4GA4dbbXMk';
    const tokenFilter = filter.tokenFilter || [];

    let foundEntriesNum = 0;
    let foundEntries: Entry[] = [];

    // let filteredTxs: [] = [];
    // let noTxsLeft = false;
    console.log("Tx length: ", txs.length);
    for (let i = 0; i < txs.length && foundEntriesNum < txTargetNum; i++) {
        const tx = txs[i];
        // console.log(`\nChecking transaction #${i}`);
        for (const instruction of tx.transaction.message.instructions) {
            let entry: Entry | null = null;
            if (typeFilter) {
                entry = await checkTypeFilterAndReturnEntry(typeFilter, tx, instruction, account);
                if (!entry) continue;
            }
            if (timeRangeFilter) {
                if (tx.blockTime && (timeRangeFilter.start !== null && tx.blockTime < timeRangeFilter.start || (timeRangeFilter.end !== null && tx.blockTime > timeRangeFilter.end))) continue;
            }
            if (entry) {
                foundEntries.push(entry);
                foundEntriesNum++;
            }

        }

        for (const innerIx of tx.meta?.innerInstructions || []) {
            let entry: Entry | null = null;
            for (const instruction of innerIx.instructions) {
                if (typeFilter) {
                    entry = await checkTypeFilterAndReturnEntry(typeFilter, tx, instruction, account);
                    if (!entry) continue;
                }
                if (timeRangeFilter) {
                    if (tx.blockTime && (timeRangeFilter.start !== null && tx.blockTime < timeRangeFilter.start || (timeRangeFilter.end !== null && tx.blockTime > timeRangeFilter.end))) continue;
                }
                if (entry) {
                    foundEntries.push(entry);
                    foundEntriesNum++;
                }
            }
        }
    }

    return foundEntries;
}

export async function fetchTransactionsAndApplyFilters(filter: Filters.Filter): Promise<Entry[]> {
    let txs = await getTransactionsForAddress(filter.account);
    return applyFilters(filter, txs);
}

async function checkTypeFilterAndReturnEntry(typeFilter: string[], tx: ParsedTransactionWithMeta, instruction: ParsedInstruction | PartiallyDecodedInstruction, account: string): Promise<Entry | null> {
    const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`, "confirmed");
    
    let entry: Entry | null = null
    for (const type of typeFilter) {
        switch (type) {
            case 'TokenTransfer': {
                if ('parsed' in instruction && instruction.programId.toString() == "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" && (instruction.parsed.type == "transfer" || instruction.parsed.type == "transferChecked")) {
                    let mint = instruction.parsed.info?.mint;
                    let source = instruction.parsed.info?.source;
                    let dest = instruction.parsed.info?.destination;
                    let authority = instruction.parsed.info?.authority;
                    let tokenAmount = instruction.parsed.info?.tokenAmount;
                    let sourcePk = new PublicKey(source);
                    let destPk = new PublicKey(dest);
                    let sourceOwner: string = "";
                    let destOwner: string = "";
                    let decimals: number | null = null;

                    try {
                        let sourceTokenAccount = await getAccount(connection, sourcePk);
                        sourceOwner = sourceTokenAccount.owner.toBase58();
                        mint = sourceTokenAccount.mint;
                    } catch (e) {
                        try {
                            let destTokenAccount = await getAccount(connection, destPk);
                            destOwner = destTokenAccount.owner.toBase58();
                            mint = destTokenAccount.mint;
                        } catch (e) {
                            console.log("Error getting mint address");
                        }
                    }

                    try {
                        let destTokenAccount = await getAccount(connection, destPk);
                        destOwner = destTokenAccount.owner.toBase58();
                    } catch (e) {
                        // console.log("Error getting mint address");
                    }

                    if (sourceOwner !== account && authority !== account && destOwner !== account) continue

                    if (mint && !decimals) {
                        let mintAccount = await getMint(connection, new PublicKey(mint));
                        decimals = mintAccount.decimals;
                    }

                    entry = {
                        signature: tx.transaction.signatures[0],
                        time: tx.blockTime ?? 0,
                        action: "TOKEN TRANSFER",
                        from: sourceOwner,
                        to: destOwner,
                        fromTokenAccount: instruction.parsed.info.source,
                        toTokenAccount: instruction.parsed.info.destination,
                        amount: instruction.parsed.info.amount ?? instruction.parsed.info.tokenAmount.amount,
                        decimals: decimals ?? undefined,
                        token: mint.toString()
                    }

                    // console.log(`\Entry #${foundEntriesNum} sig: ${tx.transaction.signatures[0]}:`);
                    // foundEntries.push(entry);
                    // foundEntriesNum++;
                    // console.dir(instruction, { depth: null });
                }
                break;
            }
            case 'SOLTransfer': {
                if (instruction.programId.toString() == "11111111111111111111111111111111" && 'parsed' in instruction && instruction.parsed.type == "transfer") {
                    // console.log(`\nTransaction #${foundEntriesNum} sig: ${tx.transaction.signatures[0]}:`);
                    // filteredTxs.push(tx);

                    entry = {
                        signature: tx.transaction.signatures[0],
                        time: tx.blockTime ?? 0,
                        action: "SOL TRANSFER",
                        from: instruction.parsed.info.source,
                        to: instruction.parsed.info.destination,
                        fromTokenAccount: "/",
                        toTokenAccount: "/",
                        amount: instruction.parsed.info.lamports / LAMPORTS_PER_SOL,
                        decimals: 9,
                        token: "NATIVE SOL"
                    }

                    // foundEntriesNum++;
                    // console.dir(instruction, { depth: null });
                }
            }
        }
    }

    return entry;
}

// console.log(`\nFiltered entries:`);
// console.dir(foundEntries, { depth: null });
// export { };