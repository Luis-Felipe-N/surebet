import axios from 'axios'
import * as jsdom from 'jsdom';
const { JSDOM } = jsdom;


const URL = "https://sbepalmasatcp.dataprom.com/sbe-web/login/login.html"

const data = {
    "nomeUsuario": "07112593131",
    "senha": "Luis55948"
}

export async function login() {
    const getResponse = await axios.get(URL)

    const cookie = getResponse.headers['set-cookie']
    
    const config = {
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': cookie,
            'Origin': 'https://sbepalmasatcp.dataprom.com',
            'Referer': 'https://sbepalmasatcp.dataprom.com/sbe-web/login/login.html',
            'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Linux"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Gpc': '1',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    const response = await axios.post(URL, new URLSearchParams(data).toString(), config)

    return cookie
}