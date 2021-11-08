import mockData from "./mockData.json"
import { useState, useEffect} from 'react'

const stockData = mockData

// get all symbols in an array
const symbols = [];
stockData.forEach(element => symbols.push(element["Symbol"]))
// console.log({symbols})

const apiKey = "c64eft2ad3i8bn4fjpn0"
    

//pass array to api request
const finnhub = require('finnhub')

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKey // Replace this
const finnhubClient = new finnhub.DefaultApi()


const Dashboard = () => {

    // query for each symbol (company) in portfolio
    const [quotes, setQuotes] = useState({})
    useEffect(() => {
        symbols.forEach( symbol => {
             finnhubClient.quote(symbol, (error, data, response) => {
                quotes[symbol] = data;
                setQuotes({...quotes})
            })
        })
    } , [])


    // create object for all closing prices from response
    const closingPrices = {}
    const tickers = []
    const prices = []

    for (let i = 0; i < symbols.length; i++) {
        if(quotes[symbols[i]]!== undefined) {
         tickers.push(symbols[i])
         prices.push(quotes[symbols[i]]['c'])
        
        tickers.forEach((key, i) => closingPrices[key] = prices[i])
        }
    }
    
    console.log(closingPrices)
    console.log({stockData})
    

    
    return(
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Ticker</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Cost Price</th>
                        <th scope="col">Current Price</th>
                        <th scope="col">% change</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData!== undefined && stockData.map((item, index) => {
                        return(
                        <tr>
                            <td>{item.Symbol}</td>
                            <td>{item.Volume}</td>
                            <td>{item.CostPrice}</td>
                            <td>{closingPrices!== undefined && closingPrices[item.Symbol]}</td>
                            <td>{((closingPrices!== undefined ? (closingPrices[item.Symbol]-(item.CostPrice)):0) / (item.CostPrice))}%</td>
                        </tr>
                        )
                        }
                    )}
                </tbody>
                </table>
        </div>
    )

}

export default Dashboard;