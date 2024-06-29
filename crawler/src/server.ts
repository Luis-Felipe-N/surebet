import axios from "axios"
import { getOddsNovibet } from "./novibet"
import { getOddsBetano } from "./betano"
import { getOddsBetfair } from "./betfair"
import { SurebetCalculator } from "./calculadora"

async function init() {
    // https://br.novibet.com/spt/feed/marketviews/event/4324/33928027/PLAYER_SPECIALS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719425210148&cf_version=d
    // https://br.betano.com/api/odds/republica-tcheca-turquia/45913030/?bt=6&req=la,s,stnf,c,mb
    // let novibetId = '35426323'
    // let betanoId = 'equador-jamaica/47685107'

    let novibetId = '35611213   '
    let betanoId = 'cf-montreal-philadelphia-union/49208262'

    const oddsNovibet = await getOddsNovibet(`https://br.novibet.com/spt/feed/marketviews/event/4324/${novibetId}/PLAYER_SPECIALS?lang=pt-BR&timeZ=E.%20South%20America%20Standard%20Time&oddsR=1&usrGrp=BR&timestamp=1211001719425210148&cf_version=d`)
    const oddsBetano = await getOddsBetano(`https://br.betano.com/api/odds/${betanoId}/?bt=6&req=la,s,stnf,c,mb`)

    const config = {
        earnings: 1000
    };

    const calculator = new SurebetCalculator([oddsNovibet, oddsBetano], config);
    const surebets = calculator.extract();
    console.log(surebets);
}

init()