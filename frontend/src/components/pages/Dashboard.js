import mockDataStocks from "./mockDataStocks.json"
import MockDataCrypto from './MockDataCrypto.json'
import { useState, useEffect} from 'react'

const stockData = mockDataStocks
const cryptoData = MockDataCrypto

// get all symbols in an array
const stockSymbols = [];
const costs = []

stockData.forEach(element => stockSymbols.push(element["Symbol"]))
stockData.forEach(element => costs.push(element['CostPrice']*element["Volume"]))

const totalStockCosts = costs.reduce(function(costs, b) { return costs + b; }, 0);

const cryptoNames = []
const cryptoCosts = []

cryptoData.forEach(element => cryptoNames.push(element["name"]))
cryptoData.forEach(element => cryptoCosts.push(element['CostPrice']*element["Volume"]))

const totalCryptoCosts = cryptoCosts.reduce(function(cryptoCosts, b) { return cryptoCosts + b; }, 0);

const totalPortfolioCosts = (totalStockCosts + totalCryptoCosts).toFixed(2)


const apiKey = "c64eft2ad3i8bn4fjpn0"
    

//pass array to api request
const finnhub = require('finnhub')

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKey // Replace this
const finnhubClient = new finnhub.DefaultApi()


const Dashboard = () => {

    // query for each symbol (company) in portfolio
    const [quotes, setQuotes] = useState({})
    const [cryptos, setCryptos] = useState({})

    useEffect(() => {
        stockSymbols.forEach( symbol => {
             finnhubClient.quote(symbol, (error, data, response) => {
                quotes[symbol] = data;
                setQuotes({...quotes})
            })
        })

        cryptoNames.forEach(name => {
            fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`)
            .then(response => response.json())
            .then(data => {
                
                cryptos[name] = data
                setCryptos({...cryptos})
             }
            )
        })
    } , [])

    //console.log({cryptos})
    // create object for all closing prices from response
    const closingPrices = {}
    const tickers = []
    const prices = []
    const differences = []

    for (let i = 0; i < stockSymbols.length; i++) {
        if(quotes[stockSymbols[i]]!== undefined) {
         tickers.push(stockSymbols[i])
         prices.push(quotes[stockSymbols[i]]['c'])
         differences.push((quotes[stockSymbols[i]]['c'] - stockData[i]['CostPrice'])*stockData[i]["Volume"])
        
        tickers.forEach((key, i) => closingPrices[key] = prices[i])
        }
    }

    const totalStockDifferences = differences.reduce(function(differences, b) { return differences + b; }, 0);
    
    
    // create object for all current crypto prices
    const cryptoPrices = {}
    const names = []
    const cryptoPricesArray = []
    const cryptoDifferences = []
    
    for (let i = 0; i < cryptoNames.length; i++) {
        if(cryptos[cryptoNames[i]]!== undefined) {
            names.push(cryptoNames[i])
            cryptoPricesArray.push(cryptos[cryptoNames[i]][cryptoNames[i]]["usd"])
            names.forEach((key, i) => cryptoPrices[key] = cryptoPricesArray[i])
            cryptoDifferences.push((cryptos[cryptoNames[i]][cryptoNames[i]]["usd"] - cryptoData[i]['CostPrice'])*cryptoData[i]['Volume'])
        }
    }

    const totalCryptoDifferences = cryptoDifferences.reduce(function(cryptoDifferences, b) { return cryptoDifferences + b; }, 0);

    const totalPortfolioReturn = (totalStockDifferences + totalCryptoDifferences).toFixed(2)

    console.log(totalPortfolioReturn)


    return(
        
            <div className="container">
                <div class="card mt-5 shadow p-3 mb-2 bg-white" style={{ borderRadius: "25px"}}>
                    <div class="card-body">
                        <h4>Portfolio overview</h4>
                        <h5>Starting Balance: {totalPortfolioCosts}</h5>
                        <h5>Total gains: {totalPortfolioReturn}</h5>
                    </div>
                </div>
            <div className="row">
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{ borderRadius: "25px"}}>
                    <table className="table caption-top">
                        <caption>Stocks / ETFs (price in $)</caption>
                        <thead className="table-dark">
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
                                    <td>{((closingPrices!== undefined ? (closingPrices[item.Symbol]-(item.CostPrice)):0) / (item.CostPrice)*100).toFixed(2)}%</td>
                                </tr>
                                )
                                }
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{ borderRadius: "25px"}}>
                    <table className="table caption-top">
                        <caption>Crypto Currencies (price in $)</caption>
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Ticker</th>
                                <th scope="col">Volume</th>
                                <th scope="col">Cost Price</th>
                                <th scope="col">Current Price</th>
                                <th scope="col">% change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptoData!== undefined && cryptoData.map((item, index) => {
                                return(
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.Volume}</td>
                                    <td>{item.CostPrice}</td>
                                    <td>{cryptoPrices!== undefined && cryptoPrices[item.name]}</td>
                                    <td>{((cryptoPrices!== undefined ? (cryptoPrices[item.name]-(item.CostPrice)):0) / (item.CostPrice)*100).toFixed(2)}%</td>
                                </tr>
                                )
                                }
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
        
        
    )

}

export default Dashboard;