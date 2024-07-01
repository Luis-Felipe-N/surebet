import { Bet, Odd } from "./types"
import superagent from 'superagent'

export async function getOddsBetano(id: string) {
    const URL = `https://br.betano.com/api/odds/${id}/?bt=6&req=la,s,stnf,c,mb`
    const { body } = await superagent
        .get(URL)
        .set('Accept', 'application/json, text/plain, */*')
        .set('Accept-Encoding', 'gzip, deflate, br, zstd')
        .set('Accept-Language', 'en-US,en;q=0.5')
        .set('Priority', 'u=1, i')
        .set('Sec-Ch-Ua', '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"')
        .set('Sec-Ch-Ua-Mobile', '?0')
        .set('Sec-Ch-Ua-Platform', '"Linux"')
        .set('Sec-Fetch-Dest', 'empty')
        .set('Sec-Fetch-Mode', 'cors')
        .set('Sec-Fetch-Site', 'same-origin')
        .set('Sec-Gpc', '1')
        .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36')

    const items = body.data.event.markets

    const odds: Odd[] = []

    for (const category of items) {
        if (category.tableLayout) {

            let bets: Bet[] = []

            let categoryIsValid = false
            let categoryTitle = ""
            console.log(category.tableLayout.title)
            switch (category.tableLayout.title) {
                case "Chutes no gol Mais/Menos":
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTESAOGOL"
                    break;
                case "Chutes O/U":
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTES"
                    break;
                case "Desarmes O/U":
                    categoryIsValid = true
                    categoryTitle = "TOTALDESARMES"
                    break;
                case "Assistências Mais/Menos":
                    categoryIsValid = true
                    categoryTitle = "TOTALDEASSISTENCIAS"
                    break;
                case "Defesas do Goleiro":
                    categoryIsValid = true
                    categoryTitle = "DEFESASDOGOLEIRO"
                    break;

                default:
                    break;
            }

            if (!categoryIsValid) continue

            let betsOver: Bet[] = []
            let betsUnder: Bet[] = []

            for (const item of category.tableLayout.rows) {
                for (const betItem of item.groupSelections) {
                    for (const selection of betItem.selections) {

                        let code = ""
                        if (selection.name.includes("Mais de ") || selection.name.includes("+")) {
                            code = "Over"
                        }

                        if (selection.name.includes("Menos de ") || selection.name.includes("-")) {
                            code = "Under"
                        }

                        const bet = {
                            stake: "BETANO",
                            player: item.title,
                            price: selection.price,
                            line: betItem.handicap,
                            caption: item.title,
                            code: code,
                            navigationUrl: "https://br.betano.com" + item.navigationUrl,
                        }

                        bets.push(bet)
                    }
                }
            }



            for (const bet of bets) {

                if (bet.code === "Under") {
                    betsUnder.push(bet)
                }

                if (bet.code === "Over") {
                    betsOver.push(bet)
                }
            }

            const odd: Odd = {
                caption: categoryTitle,
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

    return {
        stake: "BETANO",
        odds: odds
    }
};
