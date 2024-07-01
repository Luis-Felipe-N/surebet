import chalk from 'chalk'
import stringSimilarity from 'string-similarity';
import { Odd, OddStake, Surebet } from './types';


export class SurebetCalculator {

    constructor(private odds: OddStake[]) { }
    public surebets: Surebet[] = []

    async extract() {
        if (!this.odds) throw 'No odds received.';

        const oddsCombine = this.combineByCaption(this.odds)

        await this.calculateInvestment(oddsCombine);

        return this.surebets.sort((a, b) => b.winningPercentage - a.winningPercentage)
    }

    async calculateInvestment(oddsCombine) {
        for (let category of oddsCombine) {
            for (const bets of category.bets) {

                const type = bets.type
                const otherType = category.bets.filter(item => item.type != type)[0]

                bets.items.forEach(bet => {
                    for (const odd of bet.odds) {
                        otherType.items.filter(async (item) => {

                            if (item.stake != bet.stake) {
                                const oddsOtherTypeAndStake = item.odds.filter(oddOtherTypeAndStake => this.matchPlayers(oddOtherTypeAndStake.player, odd.player))
                                const maxPriceOdd = oddsOtherTypeAndStake.reduce((max, item) => item.price > max.price ? item : max, oddsOtherTypeAndStake[0])

                                if (oddsOtherTypeAndStake.length) {
                                    const probability = (1 / odd.price + 1 / maxPriceOdd.price)
                                    const winningPercentage = (1 - probability) * 100

                                    if (winningPercentage > 1 && odd.line == maxPriceOdd.line) {
                                        const oddAlreadyExists = this.surebets.find(item => item.stake1 === odd || item.stake2 === odd)
                                        // const playerInLineup = this.checkPlayerInLineup(odd.player)

                                        if (!oddAlreadyExists) {
                                            this.surebets.push({
                                                type: category.caption,
                                                winningPercentage: winningPercentage,
                                                stake1: odd,
                                                stake2: maxPriceOdd
                                            })
                                        }
                                    }
                                }
                            }
                        })

                    }
                });
            }
        }
        console.log(chalk.cyan(`Found ${this.surebets.length} surebets`));
    }

    combineByCaption(odds: OddStake[]) {
        const combined = {};

        for (const stake of odds) {

            for (let obj of stake.odds) {
                if (!combined[obj.caption]) {
                    combined[obj.caption] = { caption: obj.caption, bets: [] };
                }

                for (let bet of obj.bets) {
                    const existingBet = combined[obj.caption].bets.find(b => b.type === bet.type);
                    if (existingBet) {
                        existingBet.items.push({ stake: stake.stake, odds: [...bet.items] })
                    } else {
                        combined[obj.caption].bets.push({ type: bet.type, items: [{ stake: stake.stake, odds: [...bet.items] }] })
                    }
                }
            }
        }


        return Object.values(combined);
    };

    normalize(text: string) {
        return text.normalize('NFKD')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[^\w-]+/g, '')
            .replace(/_/g, ' ')
            .replace(/--+/g, ' ')
            .replace(/-$/g, '')
    }

    matchPlayers(player1: string, player2: string, threshold = 0.6) {
        let match = false;
        let matchRating = stringSimilarity.compareTwoStrings(this.normalize(player1), this.normalize(player2));

        if (matchRating >= threshold) {
            match = true
        }


        return match;
    }

    // checkPlayerInLineup(player: string): boolean {
    //     let inLineup = false;
    //     let playersInLineup = [...this.lineup.home.players, this.lineup.away.players]
    //     for (const playerInLineup of playersInLineup) {
    //         if (playerInLineup.player) {
    //             inLineup = this.matchPlayers(player, playerInLineup.player.name)
    //         }
    //     }

    //     return inLineup
    // }
}
