import axios from 'axios'
import { Bet, Odd, OddStake } from './types'

export async function getOddsNovibet(id: string): Promise<OddStake> {
    const URLS = [
        `https://br.novibet.com/spt/feed/marketviews/event/4324/${id}/PLAYER_SPECIALS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719425210148&cf_version=d`,
        `https://br.novibet.com/spt/feed/marketviews/event/4324/${id}/CORNERS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719789809396&cf_version=d`,
        `https://br.novibet.com/spt/feed/marketviews/event/4324/${id}/CARDS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719793397130&cf_version=d`
    ]


    const items = []

    for (const URL of URLS) {
        const response = await axios.get(URL)
        if (response.data.marketCategories.length) {
            items.push(...response.data.marketCategories[0].items)
        }
    }

    const odds: Odd[] = []

    for (const category of items) {

        if (category.betViews) {
            let bets: Bet[] = []

            let categoryIsValid = false
            let categoryTitle = ""

            switch (category.betViews[0].marketSysname) {
                case "SOCCER_PLAYER_SHOTSONTARGET_UNDER_OVER":
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTESAOGOL"
                    break;
                case "SOCCER_PLAYER_SHOTS_UNDER_OVER":
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTES"
                    break;
                case "SOCCER_PLAYER_TACKLES_UNDER_OVER":
                    categoryIsValid = true
                    categoryTitle = "TOTALDESARMES"
                    break;
                case "SOCCER_PLAYER_ASSISTS_OVERLINE_EXTENDED":
                    categoryIsValid = true
                    categoryTitle = "TOTALDEASSISTENCIAS"
                    break;
                case "PLAYER_GOALKEEPER_SAVES_OVERUNDER_NEW":
                    categoryIsValid = true
                    categoryTitle = "DEFESASDOGOLEIRO"
                    break;
                case "SOCCER_YELLOW_CARDS_UNDER_OVER":
                    categoryIsValid = true
                    categoryTitle = "TOTALDECARTOESAMARELO"
                    break;
                case "SOCCER_CORNERS_HOME_UNDER_OVER":
                    categoryIsValid = true
                    categoryTitle = "TOTALDEESCANTEIO"
                    break;
                case "SOCCER_CORNERS_AWAY_UNDER_OVER":
                    categoryIsValid = true
                    categoryTitle = "TOTALDEESCANTEIO"
                    break;
                default:
                    break;
            }

            if (!categoryIsValid) continue

            for (const item of category.betViews) {

                for (const betItem of item.betItems) {
                    if (betItem?.caption) {
                        let parts = betItem.caption.split(/(Mais|Menos) de/);
                        let line: number;
                        let player: string;
                        let code = betItem.code === "U" ? "Under" : "Over"

                        if (parts.length > 1) {
                            player = !!parts[0] ? parts[0] : item.caption.split('-')[0]
                            line = parseFloat(parts[2].trim().replace(',', '.'))
                        } else {
                            let parts = betItem.caption.split(/\s+(\+|\-)/)[0]
                            player = item.caption.split('-')[0]
                            line = parseFloat(parts[0].trim().replace(',', '.'))

                            if (parts[1] == "+") {
                                code = "O"
                            } else {
                                code = "U"
                            }
                        }

                        if (categoryTitle == "TOTALDEESCANTEIO") {
                            player = player.split(" Total de Escanteios")[0]
                        }

                        if (categoryTitle == "TOTALDECARTOESAMARELO") {
                            player = "TOTAL DE CARTOES AMARELO (DUAS PARTES)"
                        }

                        const bet = {
                            stake: "NOVIBET",
                            player: player.trim(),
                            price: betItem.price,
                            line: line,
                            caption: betItem.caption.trim(),
                            code: code,
                        }

                        bets.push(bet)
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
    console.log({
        stake: "NOVIBET",
        odds: odds
    })

    return {
        stake: "NOVIBET",
        odds: odds
    }
};
