import "./Dashboard.css"
import mockDataStocks from "./mockDataStocks.json"
import MockDataCrypto from './MockDataCrypto.json'
import { useState, useEffect} from 'react'
import { FcBookmark, FcSalesPerformance, FcComboChart } from "react-icons/fc";
import Piechart from "../UI/Piechart";

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

    // // query for each symbol (company) in portfolio
    // const [quotes, setQuotes] = useState({})
    // const [cryptos, setCryptos] = useState({})

    // useEffect(() => {
    //     stockSymbols.forEach( symbol => {
    //          finnhubClient.quote(symbol, (error, data, response) => {
    //             quotes[symbol] = data;
    //             setQuotes({...quotes})
    //         })
    //     })

    //     cryptoNames.forEach(name => {
    //         fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`)
    //         .then(response => response.json())
    //         .then(data => {
                
    //             cryptos[name] = data
    //             setCryptos({...cryptos})
    //          }
    //         )
    //     })
    // } , [])

    
    // // create object for all stock closing prices from response
    // const closingPrices = {}
    // const tickers = []
    // const prices = []
    // const differences = []

    // for (let i = 0; i < stockSymbols.length; i++) {
    //     if(quotes[stockSymbols[i]]!== undefined) {
    //      tickers.push(stockSymbols[i])
    //      prices.push(quotes[stockSymbols[i]]['c'])
    //      differences.push((quotes[stockSymbols[i]]['c'] - stockData[i]['CostPrice'])*stockData[i]["Volume"])
        
    //     tickers.forEach((key, i) => closingPrices[key] = prices[i])
    //     }
    // }

    // const totalStockDifferences = differences.reduce(function(differences, b) { return differences + b; }, 0);
    
    
    // // create object for all current crypto prices
    // const cryptoPrices = {}
    // const names = []
    // const cryptoPricesArray = []
    // const cryptoDifferences = []
    
    // for (let i = 0; i < cryptoNames.length; i++) {
    //     if(cryptos[cryptoNames[i]]!== undefined) {
    //         names.push(cryptoNames[i])
    //         cryptoPricesArray.push(cryptos[cryptoNames[i]][cryptoNames[i]]["usd"])
    //         names.forEach((key, i) => cryptoPrices[key] = cryptoPricesArray[i])
    //         cryptoDifferences.push((cryptos[cryptoNames[i]][cryptoNames[i]]["usd"] - cryptoData[i]['CostPrice'])*cryptoData[i]['Volume'])
    //     }
    // }

    // const totalCryptoDifferences = cryptoDifferences.reduce(function(cryptoDifferences, b) { return cryptoDifferences + b; }, 0);

    // const totalPortfolioReturn = (totalStockDifferences + totalCryptoDifferences).toFixed(2)

    // console.log(totalPortfolioReturn)


    return(
        
            <div className="container">
                <div className="row">
                <div class="card mt-5 shadow mb-1 bg-white" style={{borderRadius:"25px", width:"23rem", marginTop: "-20px"}}>
                    <div class="card-body">
                        <div className="card-icon">
                            <FcBookmark />
                        </div>
                        <div className="card-title">
                            Starting Balance
                        </div>
                        <div className="card-text">
                            $677657
                            {/* ${totalPortfolioCosts} */}
                        </div>
                    </div>
                </div>
                <div class="card mt-5 shadow mb-2 bg-white" style={{borderRadius:"25px", width:"23rem", marginTop: "-20px"}}>
                    <div class="card-body">
                    <div className="card-icon">
                        <FcSalesPerformance />
                        </div>
                        <div className="card-title">
                            Total gains / losses
                        </div>
                        <div className="card-text">
                            $457476
                            {/* ${totalPortfolioReturn} */}
                        </div>
                    </div>
                </div>
                <div class="card mt-5 shadow mb-2 bg-white" style={{borderRadius:"25px", width:"23rem", marginTop: "-20px"}}>
                    <div class="card-body">
                        <div className="card-icon">
                            <FcComboChart />
                        </div>
                        <div className="card-title">
                            % return
                        </div>
                        <div className="card-text">
                            15%
                            {/* {Math.round((totalPortfolioReturn - totalPortfolioCosts)/(totalPortfolioCosts) * 100)}% */}
                        </div>
                    </div>
                </div>
                </div>
            <div className="row">
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{borderRadius:"25px"}}>
                    <Piechart title={"Stock distribution (top 10 largest positions)"} data={stockData}/>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{borderRadius:"25px"}}>
                    <Piechart title={"Crypto distribution (top 10 largest positions)"} data={cryptoData}/>
                    </div>
                </div>
            </div>
        </div>
        
        
    )

}

export default Dashboard;