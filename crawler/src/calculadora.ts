import chalk from 'chalk'
import stringSimilarity from 'string-similarity';
import { Odd, OddStake, Surebet } from './types';


export class SurebetCalculator {

    constructor(private odds: OddStake[]) { }
    public surebets: Surebet[] = []

    extract() {
        if (!this.odds) throw 'No odds received.';

        const oddsCombine = this.combineByCaption(this.odds)

        this.calculateInvestment(oddsCombine);

        return this.surebets.sort((a, b) => b.winningPercentage - a.winningPercentage)
    }

    calculateInvestment(oddsCombine) {

        for (let category of oddsCombine) {
            for (const bets of category.bets) {

                const type = bets.type
                const otherType = category.bets.filter(item => item.type != type)[0]

                bets.items.forEach(bet => {
                    for (const odd of bet.odds) {
                        otherType.items.filter(item => {

                            if (item.stake != bet.stake) {
                                const oddsOtherTypeAndStake = item.odds.filter(oddOtherTypeAndStake => this.findMatches(oddOtherTypeAndStake.player, odd.player))
                                const maxPriceOdd = oddsOtherTypeAndStake.reduce((max, item) => item.price > max.price ? item : max, oddsOtherTypeAndStake[0])

                                if (oddsOtherTypeAndStake.length) {
                                    const probability = (1 / odd.price + 1 / maxPriceOdd.price)
                                    if (probability < 1 && odd.line == maxPriceOdd.line) {
                                        if (!this.surebets.find(item => item.stake1 === odd || item.stake2 === odd)) {
                                            this.surebets.push({
                                                type: category.caption,
                                                winningPercentage: (1 - probability) * 100,
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

    findMatches(betanoPlayer, novibetPlayer, threshold = 0.6) {
        let match = false;
        let matchRating = stringSimilarity.compareTwoStrings(this.normalize(betanoPlayer), this.normalize(novibetPlayer));

        if (matchRating >= threshold) {
            match = true
        }


        return match;
    }
}
