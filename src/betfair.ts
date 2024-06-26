
import axios from 'axios'
import { Bet, Odd } from './types'

export async function getOddsBetfair() {
    const url = 'https://smp.betfair.com/www/sports/fixedodds/readonly/v1/getMarketPrices?priceHistory=1&_ak=K61C39rIC0WKzoQ7'

    const config = {
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/json',
            'Cookie': 'wsid=a3809681-3323-11ef-a2b7-fa163e9cd916; vid=b504b844-5d70-40b7-852f-b7b6826a2c76; language=pt_BR; PI=4546; pi=4546; StickyTags=prod_vertical=ecommerce&rfr=4546; TrackingTags=prod_vertical=ecommerce&rfr=4546; rfr=partner4546; storageSSC=lsSSC%3D1; RuK=iv0NCnzphOrj3IwT28SVN8vvESIlPHpkV2gYpTYcLEFe4Idq9x03UbmgLhuuTBA9PSDQmZJ%2F8Bz1FcjUPnunVciY55w9EA9LPlJqcnCbQU2iCCpQ%0A%2FGck%2FnECfQ%3D%3D; ssoid=Dh0XeuukXaSODuYGmdIA5qLpcmgmu2C+66nAXfTF/SA=; loggedIn=true; lka=1719341379777; bfsd=ts=1719341379777|st=reg; ccawa=17740091717838855677661780896461106698391; betexPtk=betexLocale%3Dpt%7EbetexRegion%3DGBR%7EbetexCurrency%3DBRL; tbd_dp=sportsbook; tbd_lvp=sportsbook; tbdlcsp=SBK%7CGAM; locale=pt_BR; exp=bf; theme=1; BETEX_ESD=accountservices',
            'Origin': 'https://www.betfair.com',
            'Referer': 'https://www.betfair.com/',
            'Sec-Ch-Ua': '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Linux"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Gpc': '1',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        }
    }

    const body = {}; // Se necessário, adicione o corpo da requisição aqui

    const response = axios.post(url, body, config)

    console.log(response)
    // const items = response.data.marketCategories[0].items
    // const odds: Odd[] = []

    // for (const category of items) {
    //     if (category.betViews) {
    //         let bets: Bet[] = []

    //         let categoryIsValid = false
    //         let categoryTitle = ""

    //         switch (category.betViews[0].marketSysname) {
    //             case "SOCCER_PLAYER_SHOTSONTARGET_UNDER_OVER":
    //                 categoryIsValid = true
    //                 categoryTitle = "TOTALCHUTESAOGOL"
    //                 break;
    //             case "SOCCER_PLAYER_SHOTS_UNDER_OVER":
    //                 categoryIsValid = true
    //                 categoryTitle = "TOTALCHUTES"
    //                 break;
    //             case "SOCCER_PLAYER_TACKLES_UNDER_OVER":
    //                 categoryIsValid = true
    //                 categoryTitle = "TOTALDESARMES"
    //                 break;

    //             default:
    //                 break;
    //         }

    //         if (!categoryIsValid) continue

    //         for (const item of category.betViews) {
    //             for (const betItem of item.betItems) {
    //                 if (betItem?.caption) {
    //                     const parts = betItem.caption.split(/\s+(Mais|Menos) de/);
    //                     console.log(betItem)
    //                     const bet = {
    //                         caption: betItem.caption,
    //                         price: betItem.price,
    //                         code: betItem.code,
    //                         player: parts[0],
    //                         line: parts[2]
    //                     }

    //                     bets.push(bet)
    //                 }
    //             }
    //         }

    //         let betsOver: Bet[] = []
    //         let betsUnder: Bet[] = []

    //         for (const bet of bets) {

    //             if (bet.code === "U") {
    //                 betsUnder.push(bet)
    //             }

    //             if (bet.code === "O") {
    //                 betsOver.push(bet)
    //             }
    //         }

    //         const odd = {
    //             caption: categoryTitle,
    //             bets: [
    //                 {
    //                     type: "OVER",
    //                     items: betsOver
    //                 },
    //                 {
    //                     type: "UNDER",
    //                     items: betsUnder
    //                 }
    //             ]
    //         }

    //         odds.push(odd)
    //     }
    // }

    // return odds
};
