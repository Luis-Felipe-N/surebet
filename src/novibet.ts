import axios from 'axios'
import { Bet, Odd } from './types'

export async function getOddsNovibet(URL: string) {

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

                default:
                    break;
            }

            if (!categoryIsValid) continue

            for (const item of category.betViews) {
                for (const betItem of item.betItems) {
                    if (betItem?.caption) {
                        const parts = betItem.caption.split(/\s+(Mais|Menos) de/);

                        const bet = {
                            caption: betItem.caption.trim(),
                            price: betItem.price,
                            code: betItem.code,
                            player: parts[0],
                            line: parseFloat(parts[2].trim().replace(',', '.'))
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

            const odd = {
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
