import chalk from 'chalk'
import { Odd, OddStake } from './types';

export class SurebetCalculator {
    constructor(odds: OddStake[], config) {
        this.odds = odds;
        this.surebets = [];
        this.config = config;
    }

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
                    const otherStake = otherType.items.filter(item => item.stake != bet.stake)[0]
                    for (const odd of bet.odds) {
                        const player = this.normalize(odd.player)

                        const [oddOtherTypeAndStake] = otherStake.odds.filter(item => this.normalize(item.player) == player)


                        if (oddOtherTypeAndStake) {
                            const probability = (1 / odd.price + 1 / oddOtherTypeAndStake.price)
                            if (probability < 1 && odd.line == oddOtherTypeAndStake.line) {
                                if (!this.surebets.find(item => item.stake1 === odd || item.stake2 === odd)) {
                                    this.surebets.push({
                                        type: category.caption,
                                        winningPercentage: (1 - probability) * 100,
                                        stake1: odd,
                                        stake2: oddOtherTypeAndStake
                                    })
                                }
                            }
                        } else {
                            // console.log(player, otherStake.stake)
                        }
                    }
                });
            }
        }
        console.log(chalk.cyan(`Found ${this.surebets.length} surebets`));
    }

    printVerbose(odd) {
        console.log(
            chalk.bold(
                `${odd.caption} ${chalk.green(
                    '±' + Math.round((odd.profit * 100) / 100) + '%'
                )}`
            )
        );
        for (let bet of [...odd.bets[0].items, ...odd.bets[1].items])
            console.log(`${bet.player} @${bet.price.toFixed(2)} ${bet.code}`);
        console.log('');
    }

    combineByCaption(odds) {
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
}
