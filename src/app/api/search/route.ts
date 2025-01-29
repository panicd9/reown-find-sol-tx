import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    console.log('query: ', query)

    if (!query) {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }


    // Example mock response
    const results = [
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


    return new Response(JSON.stringify({ query, results }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
