"use client";
// FindTx.tsx
import React, { useEffect, useState } from 'react';
import "./findTx.css";

const stablecoinMints: { [key: string]: string } = {
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

const mintToSymbol: { [key: string]: string } = {
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
};

let mockTxs = [
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

function shorten(longString: string): string {
    return `${longString.slice(0, 4)}...${longString.slice(-4)}`;
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

async function getTokenSymbol(mint: string): Promise<string> {
    if (mintToSymbol[mint] !== undefined) {
        return mintToSymbol[mint];
    } else {
        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_API_KEY}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": "test",
                "method": "getAsset",
                "params": {
                    "id": mint
                }
            }),
        });

        // Correctly await the response before calling .json()
        const data = await response.json();

        console.log(data);

        // Ensure response structure is valid before accessing properties
        return data?.result?.content?.metadata?.symbol || 'UNKNOWN';
    }
}

function timeAgo(timestamp) {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000); // Convert Unix timestamp to seconds
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate months as 30 days
    const diffInYears = Math.floor(diffInDays / 365); // Approximate years as 365 days

    if (diffInYears > 0) {
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
        return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }
}
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero if necessary
    const year = date.getFullYear(); // Full year
    const hours = String(date.getHours()).padStart(2, '0'); // Hours with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Seconds with leading zero

    return `${day}.${month}.${year}. ${hours}:${minutes}:${seconds}`;
}


const FindTx = () => {
    const [tokenSymbols, setTokenSymbols] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    // Preload all token symbols
    useEffect(() => {
        const fetchAllTokenSymbols = async () => {
            const symbolMap: { [mint: string]: string } = {};

            for (const tx of mockTxs) {
                if (!symbolMap[tx.token]) {
                    const symbol = await getTokenSymbol(tx.token);
                    symbolMap[tx.token] = symbol;
                }
            }

            setTokenSymbols(symbolMap);
            setIsLoading(false);
        };

        fetchAllTokenSymbols();
    }, []);

    let previousSignature = null;
    let isAlternate = false;
    return (
        <div className="container">
            <h2>Transaction Table</h2>
            <ul className="responsive-table">
                <li className="table-header">
                    <div className="col" style={{ position: "absolute", left: "3%" }}>Signature</div>
                    <div className="col" style={{ position: "absolute", left: "19%" }}>Time</div>
                    <div className="col" style={{ position: "absolute", left: "31%" }}>Action</div>
                    <div className="col" style={{ position: "absolute", left: "46%" }}>From</div>
                    <div className="col" style={{ position: "absolute", left: "62%" }}>To</div>
                    <div className="col" style={{ position: "absolute", left: "74%" }}>Amount</div>
                    <div className="col" style={{ position: "absolute", left: "90%" }}>Token</div>
                </li>

                {mockTxs.map((tx, index) => {
                    if (tx.signature !== previousSignature) {
                        isAlternate = !isAlternate;
                        previousSignature = tx.signature;
                    }
                    return (
                        <li className={`table-row ${isAlternate ? 'alternate-row' : ''}`} key={index}>
                            <div className="col col-1-1" data-label="Signature">
                                <div className='col-1'>
                                    <a href={`https://www.solscan.io/tx/${tx.signature}`} className='signatureLink'>{shorten(tx.signature)}</a>
                                    <img src="/copy.png" alt="" className='copyImage' onClick={() => copyToClipboard(tx.signature)} />
                                    <div className="tooltip">{tx.signature}</div>
                                </div>
                            </div>
                            <div className='col col-2-1'>
                                <div className="col-2" data-label="Time">
                                    <div>{timeAgo(tx.time)}</div>
                                    <div className='tooltip tooltipTime'>{formatTimestamp(tx.time)}</div>
                                </div>
                            </div>
                            <div className="col col-3" data-label="Action">
                                {tx.action}
                            </div>
                            <div className="col col-4-1" data-label="From">
                                <div className='col-4'>
                                    <a href={`https://www.solscan.io/account/${tx.from}`} className='signatureLink'>{shorten(tx.from)}</a>
                                    <img src="/copy.png" alt="" className='copyImage' onClick={() => copyToClipboard(tx.from)} />
                                    <div className="tooltip tooltipFrom">{tx.from}</div>
                                </div>
                            </div>
                            <div className="col col-5-1" data-label="To">
                                <div className='col-5'>
                                    <a href={`https://www.solscan.io/account/${tx.to}`} className='signatureLink'>{shorten(tx.to)}</a>
                                    <img src="/copy.png" alt="" className='copyImage' onClick={() => copyToClipboard(tx.to)} />
                                    <div className="tooltip tooltipTo">{tx.to}</div>
                                </div>
                            </div>
                            <div className="col col-6" data-label="Amount">
                                {tx.amount
                                    ? `${parseFloat((parseFloat(tx.amount) / Math.pow(10, tx.decimals)).toFixed(5))}`
                                    : "N/A"}
                            </div>
                            <div className="col col-7-1" data-label="Token">
                                <div className='col-7'>
                                    <a href={`https://www.solscan.io/account/${tx.token}`} className='signatureLink'>{shorten(tx.token)}</a>
                                    <img src="/copy.png" alt="" className='copyImage' onClick={() => copyToClipboard(tx.token)} />
                                    <div className="tooltip tooltipToken">
                                        {isLoading ? "Loading..." : tokenSymbols[tx.token] || "Unknown"}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default FindTx;