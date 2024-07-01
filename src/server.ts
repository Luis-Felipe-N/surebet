import axios from "axios"
import { getOddsNovibet } from "./novibet"
import { getOddsBetano } from "./betano"
import { getOddsSuperbet } from "./superbet"

import { SurebetCalculator } from "./calculadora"
import { getLineup } from "./lineups"
import { getOddsEstrelabet } from "./estralabet"
import { OddStake } from "./types"

interface getOdds {
    novibetId?: string
    betanoId?: string
    superbetId?: string
    estrelabetId?: string
}

async function init() {

    let novibetId = '35441086'
    let betanoId = 'eua-uruguai/45934892'
    let superbetId = '5525798'
    let estrelabetId = '9870600'

    // let novibetId = '35441089'
    // let betanoId = 'bolivia-panama/45934863'
    // let superbetId = '5525799'
    // let estrelabetId = '9870601'

    // let novibetId = '35906690'
    // let betanoId = 'franca-belgica/51288528'
    // let superbetId = '6369387'
    // let estrelabetId = '9951128'

    // let novibetId = '35906690'
    // let betanoId = 'portugal-eslovenia/51295498'
    // let superbetId = "6370498"
    // let estrelabetId = '9952595'

    const odds = await getOdds({
        novibetId,
        betanoId,
        superbetId,
        estrelabetId,
    })

    const calculator = new SurebetCalculator(odds);
    const surebets = await calculator.extract();
    const game = await getGameName(novibetId)

    for (const surebet of surebets) {
        console.log(`
        Surebet - ${surebet.winningPercentage.toFixed(2)}% de ganho
        📆 ${formateGameDate(game.startTimeUTC)}
        ⚽️ ${game.caption}
        🎯 ${surebet.stake1.player} - ${surebet.type} (${surebet.stake1.line})
        🏠 ${surebet.stake1.stake} (${surebet.stake1.code}) - ${surebet.stake1.price}
        🏠 ${surebet.stake2.stake} (${surebet.stake2.code}) - ${surebet.stake2.price}`
        )
    }
}

async function getOdds({ betanoId, estrelabetId, novibetId, superbetId }: getOdds) {
    let odds: OddStake[] = []

    if (betanoId) {
        const response = await getOddsBetano(betanoId)

        odds.push(response)
    }

    if (estrelabetId) {
        const response = await getOddsEstrelabet(estrelabetId)

        odds.push(response)
    }

    if (novibetId) {
        const response = await getOddsNovibet(novibetId)

        odds.push(response)
    }

    if (superbetId) {
        const response = await getOddsSuperbet(superbetId)

        odds.push(response)
    }

    return odds
}


async function getGameName(novibetId: string) {
    const URL = `https://br.novibet.com/spt/feed/marketviews/event/4324/${novibetId}/CARDS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719793397130&cf_version=d`
    const response = await axios.get(URL)
    return response.data
}

function formateGameDate(input: string) {
    const date = new Date(input);

    const options = {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
    };

    const formatter = new Intl.DateTimeFormat('pt-BR', options);
    const formattedParts = formatter.formatToParts(date);

    let day, month, hour, minute;
    for (const part of formattedParts) {
        if (part.type === 'day') day = part.value;
        if (part.type === 'month') month = part.value;
        if (part.type === 'hour') hour = part.value;
        if (part.type === 'minute') minute = part.value;
    }

    const formattedDateTime = `${day}/${month} às ${hour}:${minute}`;

    return formattedDateTime;
}
init()