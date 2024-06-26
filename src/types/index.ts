export interface Bet {
    caption: string
    price: number
    code: string
    navigationUrl?: string
    player: string
    line: number
}

export interface Odd {
    caption: "TOTALCHUTESAOGOL" | "TOTALCHUTES" | "TOTALDESARMES"
    bets: [
        { type: 'OVER', items: Bet[] },
        { type: 'UNDER', items: Bet[] }
    ]
}

export type OddStake = Odd[]