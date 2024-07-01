import superagent from 'superagent'
// https://sb2frontend-altenar2.biahosted.com/api/widget/GetEventDetails?culture=pt-BR&timezoneOffset=180&integration=estrelabet&deviceType=1&numFormat=en-GB&countryCode=BR&eventId=9788734

// 201811

import axios from 'axios'
import { Bet, Odd, OddStake } from './types'

interface Market {
    title: string,
    shortName: string,
    desktopOddIds: any[],
    mobileOddIds: any[],
    childMarketIds: string[],
    isBB: false,
    variant: number,
    typeId: number,
    isMB: false,
    sportMarketId: number,
    sv: string,
    id: number,
    name: string
}

export async function getOddsEstrelabet(id: string): Promise<OddStake> {
    const url = `https://sb2frontend-altenar2.biahosted.com/api/widget/GetEventDetails?culture=pt-BR&timezoneOffset=180&integration=estrelabet&deviceType=1&numFormat=en-GB&countryCode=BR&eventId=${id}`;

    console.log(url)

    const headers = {
        "authority": "sb2frontend-altenar2.biahosted.com",
        "method": "GET",
        "path": "/api/widget/GetEventDetails?culture=pt-BR&timezoneOffset=180&integration=estrelabet&deviceType=1&numFormat=en-GB&countryCode=BR&eventId=9764717",
        "scheme": "https",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.7",
        "Origin": "https://www.estrelabet.com",
        "Priority": "u=1, i",
        "Referer": "https://www.estrelabet.com/",
        "Sec-Ch-Ua": "\"Brave\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": "\"Linux\"",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Gpc": "1",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })

    const data = await response.json()

    const teamHome = data.name.split(" vs. ")[0]
    const teamAway = data.name.split(" vs. ")[1]

    console.log({ teamHome, teamAway })

    // data.markets guarda os tipos das odds ex: chutesaogol / desarmes...
    // data.odds guarda as informacoes de price, line
    const odds: Odd[] = []
    const markets: Market[] = []

    // Possiveis mercados para o futuro
    // Jogador total de assistências
    // Jogador total de chutes
    // Jogador total de chutes a gol
    // Jogador total de cartões Amarelos
    // Jogador número de passes (Escalação inicial)
    // Jogador total de passes (Escalação inicial)
    // Jogador a marcar em qualquer momento & 1X2
    // Jogador a marcar o primeiro gol & 1X2
    // Jogador a marcar o primeiro gol & Placar exato
    // Jogador a marcar em qualquer momento & Placar exato
    // Jogador a marcar a qualquer momento & Chance dupla
    // Jogador a marcar & Multi-resultados
    // Jogador a marcar o primeiro gol & Multi-resultados
    // Jogador a marcar a qualquer momento & Total de Gols
    // Jogador a marcar a qualquer momento & Ambas equipes marcam
    // Total (mais/menos) Chutes Argentina
    // Total (mais/menos) Chutes Peru
    // Total (mais/menos) Chutes a Gol Argentina
    // Total (mais/menos) Chutes a Gol Peru

    for (const market of data.markets) {
        let bets: Bet[] = []
        let marketIsValid = false
        let marketGame = false
        let marketTitle = ""

        if (market.shortName) {
            // console.log(market.shortName, "Jogador total de desarmes (Escalação inicial)")
            switch (market.shortName) {
                case "Jogador total de chutes a gol":
                    marketIsValid = true
                    marketTitle = "TOTALCHUTESAOGOL"
                    break;
                case "Jogador total de chutes":
                    marketIsValid = true
                    marketTitle = "TOTALCHUTES"
                    break;
                case "Jogador total de assistências":
                    marketIsValid = true
                    marketTitle = "TOTALDEASSISTENCIAS"
                    break;

                case "Jogador total de cartões Amarelos":
                    marketIsValid = true
                    marketGame = true
                    marketTitle = "TOTALDECARTOESAMARELO"
                    break;
                case "Jogador total de desarmes (Escalação inicial)":
                    marketIsValid = true
                    marketGame = true
                    marketTitle = "TOTALDESARMES"
                    break;

                default:
                    break;
            }

            if (market.shortName === `${teamHome} Total de gols` || market.shortName === `${teamAway} Total de gols`) {
                marketIsValid = true
                marketGame = true
                marketTitle = "TOTALDEGOLS"
            }

            if (market.shortName === `${teamHome} total de escanteios` || market.shortName === `${teamAway} total de escanteios`) {
                marketIsValid = true
                marketGame = true
                marketTitle = "TOTALDEESCANTEIO"
            }
        }

        if (marketIsValid) {
            markets.push({
                title: marketTitle,
                ...market
            })
            if (marketGame) {

                for (const oddId of market.desktopOddIds.flat()) {
                    const odd = data.odds.filter(item => item.id == oddId)[0]
                    let player = market.shortName.split(" ")[0].trim()
                    if (odd.typeId == 2502) {
                        player = odd.name.split(" (")[0]
                    }

                    const bet = {
                        stake: "ESTRELABET",
                        player: player,
                        price: odd.price,
                        line: parseFloat(odd.sv),
                        caption: market.name,
                        code: odd.name.toLowerCase().includes('menos') ? "Under" : "Over",
                    }

                    bets.push(bet)

                }
            } else {
                const childMarkets = data.childMarkets.filter(item => market.childMarketIds.includes(item.id))


                for (const childMarket of childMarkets) {
                    for (const oddId of childMarket.desktopOddIds.flat()) {
                        const oddsChildMarket = data.odds.filter(item => item.id == oddId)
                        for (const odd of oddsChildMarket) {

                            let player = childMarket.shortName.includes("(") ? childMarket.shortName.split(" (")[0] : childMarket.shortName

                            const bet = {
                                stake: "ESTRELABET",
                                player: player,
                                price: odd.price,
                                line: parseFloat(odd.sv),
                                caption: childMarket.name,
                                code: odd.name.toLowerCase().includes('menos') ? "Under" : "Over",
                            }

                            bets.push(bet)

                        }
                    }
                }
            }

            let betsOver: Bet[] = []
            let betsUnder: Bet[] = []

            for (const bet of bets) {

                if (bet.code === "Under") {
                    betsUnder.push(bet)
                }

                if (bet.code === "Over") {
                    betsOver.push(bet)
                }
            }

            if (odds.filter(item => item.caption == marketTitle).length) {
                odds.map(category => {
                    if (category.caption == marketTitle) {
                        return category.bets[0].items.push(...betsOver)
                    }

                    return category
                })

            } else {
                const odd: Odd = {
                    caption: marketTitle,
                    bets: [
                        {
                            type: "OVER",
                            items: betsOver
                        },
                        {
                            type: "UNDER",
                            items: betsUnder
                        }
                    ]
                }

                odds.push(odd)
            }

        }

    }
    console.log({
        stake: "ESTRELABET",
        odds: odds
    })

    return {
        stake: "ESTRELABET",
        odds: odds
    }
};
