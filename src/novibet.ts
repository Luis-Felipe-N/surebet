import axios from 'axios'
import { Bet, Odd, OddStake } from './types'

export async function getOddsNovibet(URL: string): Promise<OddStake> {

    const response = await axios.get(URL)
    const items = response.data.marketCategories[0].items
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

                case "SOCCER_PLAYER_SHOTSONTARGET_OVERLINE":
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTESAOGOL"
                    break;
                case "SOCCER_PLAYER_SHOTS_OVERLINE":
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTES"
                    break;
                case "SOCCER_PLAYER_TACKLES_OVERLINE":
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
                        let code = betItem.code

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

                if (bet.code === "U") {
                    betsUnder.push(bet)
                }

                if (bet.code === "O") {
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
        stake: "NOVIBET",
        odds: odds
    }
};
