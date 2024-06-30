// 201811

import axios from 'axios'
import { Bet, Odd, OddStake } from './types'

export async function getOddsSuperbet(URL: string): Promise<OddStake> {
    const response = await axios.get(URL)
    const items = response.data.data[0].odds

    const odds: Odd[] = []

    for (const category of items) {
        if (category.marketId) {
            let bets: Bet[] = []

            let categoryIsValid = false
            let categoryTitle = ""

            switch (category.marketId) {
                case 201811:
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTESAOGOL"
                    break;
                case 232338:
                    categoryIsValid = true
                    categoryTitle = "TOTALCHUTES"
                    break;
                case 232346:
                    categoryIsValid = true
                    categoryTitle = "TOTALDESARMES"
                    break;
                case 200726:
                    categoryIsValid = true
                    categoryTitle = "TOTALDEASSISTENCIAS"
                    break;
                default:
                    break;
            }

            if (!categoryIsValid) continue

            if (category) {


                const bet = {
                    stake: "SUPERBET",
                    player: category.specifiers.player_name ?? category.specifiers.player,
                    price: category.price,
                    line: parseFloat(category.specifiers.total) ?? 0.5,
                    caption: category.name,
                    code: "O",
                }

                bets.push(bet)
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

            if (odds.filter(item => item.caption == categoryTitle).length) {
                odds.map(category => {
                    if (category.caption == categoryTitle) {
                        return category.bets[0].items.push(...betsOver)
                    }

                    return category
                })

            } else {
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
    }

    return {
        stake: "SUPERBET",
        odds: odds
    }
};
