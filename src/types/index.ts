export interface Bet {
    caption: string
    price: number
    code: string
    navigationUrl?: string
    player: string
    line: number
}

export interface Odd {
    caption: string
    bets: [
        { type: 'OVER', items: Bet[] },
        { type: 'UNDER', items: Bet[] }
    ]
}

export type OddStake = {
    stake: string
    odds: Odd[]
}

export interface Surebet {
    type: string,
    winningPercentage: number,
    stake1: Odd,
    stake2: Odd
}