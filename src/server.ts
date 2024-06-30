import axios from "axios"
import { getOddsNovibet } from "./novibet"
import { getOddsBetano } from "./betano"
import { getOddsSuperbet } from "./superbet"

import { SurebetCalculator } from "./calculadora"
import { getLineup } from "./lineups"

async function init() {

    // let novibetId = '35541120'
    // let betanoId = 'canada-chile/47685718'
    // let superbetId = 5976012

    // let novibetId = '35496908'
    // let betanoId = 'argentina-peru/47685633'
    // let superbetId = 5525790

    // let novibetId = '35906676'
    // let betanoId = 'inglaterra-eslovaquia/51295182'
    // let superbetId = 6370501

    let novibetId = '35906679'
    let betanoId = 'espanha-georgia/51295276'
    let superbetId = 6370499

    // const oddsBetano = await getOddsBetano(`https://br.betano.com/api/odds/${betanoId}/?bt=6&req=la,s,stnf,c,mb`)
    const oddsNovibet = await getOddsNovibet(`https://br.novibet.com/spt/feed/marketviews/event/4324/${novibetId}/PLAYER_SPECIALS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719425210148&cf_version=d`)
    const oddsSuperbet = await getOddsSuperbet(`https://production-superbet-offer-basic.freetls.fastly.net/sb-basic/api/v2/en-BR/events/${superbetId}?matchIds=${superbetId}`)

    const lineup = await getLineup("11874018")

    const calculator = new SurebetCalculator([oddsNovibet, oddsSuperbet], lineup);
    const surebets = await calculator.extract();
    console.log(surebets)
}

init()