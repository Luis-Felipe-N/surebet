// 201811

import axios from 'axios'
import { Bet, Odd, OddStake } from './types'

export async function getOddsSuperbet(id: string): Promise<OddStake> {
    const URL = `https://production-superbet-offer-basic.freetls.fastly.net/sb-basic/api/v2/en-BR/events/${id}?matchIds=${id}`
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
                case 535:
                    categoryIsValid = true
                    categoryTitle = "TOTALDEGOLS"
                    break;
                case 544:
                    categoryIsValid = true
                    categoryTitle = "TOTALDEGOLS"
                    break;
                case 733:
                    categoryIsValid = true
                    categoryTitle = "TOTALDEESCANTEIO"
                    break;
                case 713:
                    categoryIsValid = true
                    categoryTitle = "TOTALDEESCANTEIO"
                    break;
                case 700:
                    categoryIsValid = true
                    categoryTitle = "TOTALDECARTOES"
                    break;
                case 708:
                    categoryIsValid = true
                    categoryTitle = "TOTALDECARTOES"
                    break;
                default:
                    break;
            }

            if (!categoryIsValid) continue

            if (category) {
                let player = category.specifiers.player_name ?? category.specifiers.player
                if (!player) {
                    player = category.marketName.split(" - ")[0]
                }

                const bet = {
                    stake: "SUPERBET",
                    player: player,
                    price: category.price,
                    line: category.specifiers.total ? parseFloat(category.specifiers.total) : 0.5,
                    caption: category.name,
                    code: category.name.toLowerCase().includes("under") ? "Under" : "Over",
                }

                bets.push(bet)
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

            if (odds.filter(item => item.caption == categoryTitle).length) {
                odds.map(category => {
                    if (category.caption == categoryTitle) {
                        category.bets[1].items.push(...betsUnder)
                        category.bets[0].items.push(...betsOver)
                        return category
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

    console.log({
        stake: "SUPERBET",
        odds: odds
    })
    // console.log(odds[2].bets[0])
    // console.log(odds[2].bets[1])
    return {
        stake: "SUPERBET",
        odds: odds
    }
};
