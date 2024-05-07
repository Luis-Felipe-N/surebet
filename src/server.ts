import axios from 'axios'
import * as jsdom from 'jsdom';
import { login } from './login';
const { JSDOM } = jsdom;


const URL = "https://sbepalmasatcp.dataprom.com/sbe-web/v2/usuario/consultarInformacoesCartaoUsuarioContaCorrente.html"

const data = {
    "filtro.idUsuario": "374845",
    "filtro.dataInicial": "01/04/2024",
    "filtro.dataFinal": "30/04/2024",
}

async function getAccountInfo() {
    const cookie = await login()
    
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
    const responseJson = htmlToJson(response.data)
    console.log(responseJson)
}

function htmlToJson(html: string): any {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Get the table element
    const table = document.querySelector('table');
    
    // Check if the table exists
    if (!table) {
        throw new Error('No table found in the HTML');
    }

    // Initialize an empty JSON array to store the data
    const jsonData: any[] = [];

    // Iterate through each table row (excluding the header row)
    for (const row of table.querySelectorAll('tr:not(:first-child)')) {
        const dataRow = {};
            
        dataRow['date'] = row.querySelector('td:nth-child(1)').textContent.trim();
        dataRow['serialNumber'] = row.querySelector('td:nth-child(2)').textContent.trim();            
        dataRow['card'] = row.querySelector('td:nth-child(3)').textContent.trim(); 
        dataRow['operation'] = row.querySelector('td:nth-child(4)').textContent.trim();           
        dataRow['line'] = row.querySelector('td:nth-child(5)').textContent.trim();
        dataRow['segment'] = row.querySelector('td:nth-child(6)').textContent.trim();            
        dataRow['vehicle'] = row.querySelector('td:nth-child(7)').textContent.trim();            
        dataRow['registration'] = row.querySelector('td:nth-child(8)').textContent.trim();  
        dataRow['amount'] = parseFloat(row.querySelector('td:nth-child(9)').textContent.trim().replace(',', '.')); // Convert to number  
        dataRow['cardBalance'] = parseFloat(row.querySelector('td:nth-child(10)').textContent.trim().replace(',', '.')); // Convert to number 
        dataRow['scheduledBalance'] = parseFloat(row.querySelector('td:nth-child(11)').textContent.trim().replace(',', '.')); // Convert to number

        jsonData.push(dataRow);
    }

    return jsonData;
}


getAccountInfo()