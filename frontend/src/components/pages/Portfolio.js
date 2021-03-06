import "./Dashboard.css"
import { useState, useEffect, useContext} from 'react'
import { FcBookmark, FcSalesPerformance, FcComboChart } from "react-icons/fc";
import { useLinkClickHandler } from "react-router-dom";
import { DataContext } from "../../utils/DataContext";
import Linechart from "../ui/Linechart";


const apiKey = "c64eft2ad3i8bn4fjpn0"
    

//pass array to api request
const finnhub = require('finnhub')

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKey // Replace this
const finnhubClient = new finnhub.DefaultApi()


const Dashboard = () => {

    const [stocks, setStocks] = useState([])
    const [cryptos, setCryptos] = useState([])
    const [stocksData, setStocksData] = useState([])
    const [cryptosData, setCryptosData] = useState([])
    const [symbol, setSymbol] = useState("")
    const [historicData, setHistoricData] = useState([])
    const [historicCrypto, setHistoricCrypto] = useState([])
    const {auth} = useContext(DataContext)
  

    const fetchLiveDataStocks = (stocks) => {
        if (stocks && stocks.length > 0) {
        stocks.forEach((stock) => {
            finnhubClient.quote(stock.Symbol, (error, data, response) => {
                if(data) {
                let stockData = {...stock}
                if (data && Object.keys(data).includes("c"))
                {
                const closingPrice = data["c"]
                stockData["currentValue"] =  closingPrice
                const difference =  ( closingPrice - stockData['CostPrice'])/ stockData['CostPrice']
                stockData["difference"] = Math.round(difference * 10000) / 100


                }
                setStocksData(prevState => [...prevState, stockData])
            }});
        });
        }
    }

   const fetchLiveDataCrypto =(cryptos) => {
       cryptos.forEach(crypto => {
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto.Symbol}&vs_currencies=usd`)
        .then(res => res.json())
        .then(data => {
            let cryptoData = {...crypto}
            if (Object.keys(data).includes(crypto.Symbol))
            {
                const currentValue = data[crypto.Symbol]['usd']
                cryptoData['currentValue'] = currentValue
                const difference = (currentValue - cryptoData['CostPrice']) / cryptoData['CostPrice']
                cryptoData ['difference'] = Math.round(difference *10000) / 100
            }
            setCryptosData( prevState => [...prevState, cryptoData])
        })
    })
}

const fetchPositions = (portfolioType, data, setData) => {
    fetch(`http://localhost:8000/portfolio/${portfolioType}/positions`,
    {
        headers: {
            accept: "application/json",
          'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.access_token}`
          }
    })
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
      });
  };

    useEffect(() => {
        fetchPositions("Stocks", stocks, setStocks)
        fetchPositions("Crypto", cryptos, setCryptos)
    }, [])

    useEffect(() => {
        if (stocks.length > 0)
        {
            fetchLiveDataStocks(stocks)
            
        }
    },[stocks])

    useEffect(() => {
        if (cryptos.length > 0)
        {
            fetchLiveDataCrypto(cryptos)
        }
    },[cryptos])

    useEffect(() => {
        fetchHistoricalData()
    }, [symbol])

    // useEffect(() => {
    //     fetchHistoricCrypto()
    // }, [symbol])


    const clickHandler = (item) => {
        console.log(item)
        setSymbol(item)
    }

    // api for historical stock data
    const apiKey2 = "916d093761e0c97b409e89260083dd31"

    const fetchHistoricalData = () => {
        fetch(`http://api.marketstack.com/v1/eod?access_key=${apiKey2}&symbols=${symbol}&date_from=2020-11-16&date_to=2021-11-16&limit=300`)
        .then(res => res.json())
        .then((data) => setHistoricData(data.data))
    }

    // const apiKey3 = "OKY30MFBW4P3ZWFG"

    // // const request = require('request');

    // // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
    // const fetchHistoricCrypto = () => { 
    //     fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${apiKey3}`)
    //     .then(res => res.json())
    //     .then((data) => setHistoricCrypto(data))
    // }

    // console.log({historicCrypto})
    // // request.get({
    // //     url: url,
    // //     json: true,
    // //     headers: {'User-Agent': 'request'}
    // // }, (err, res, data) => {
    // //     if (err) {
    // //     console.log('Error:', err);
    // //     } else if (res.statusCode !== 200) {
    // //     console.log('Status:', res.statusCode);
    // //     } else {
    // //     // data is successfully parsed as a JSON object:
    // //     console.log(data);
    // //     }
    // // });
    



    return(
        
            <div className="container">
            <div className="row">
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{borderRadius:"25px"}}>
                    <table className="table caption-top">
                        <caption>Stocks / ETFs (price in $)</caption>
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Ticker</th>
                                <th scope="col">Volume</th>
                                <th scope="col">Cost Price</th>
                                <th scope="col">Current Price</th>
                                <th scope="col">% change</th>
                            </tr>
                        </thead>
                        <tbody>
                        {stocksData !== undefined &&
                            stocksData.map((item, index) => {
                                return (
                                <tr key={index} onClick={() => clickHandler(item.Symbol)}>
                                    <td>{item.Symbol}</td>
                                    <td>{item.Volume}</td>
                                    <td>{item.CostPrice.toFixed(2)}</td>
                                    <td>
                                    {item['currentValue'] !== undefined &&
                                        item.currentValue.toFixed(2)}
                                    </td>
                                    <td>
                                    {
                                        item.difference !== undefined
                                        ? `${item.difference}%`: ""}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{borderRadius:"25px"}}>
                    <table className="table caption-top">
                        <caption>Crypto Currencies (price in $)</caption>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Volume</th>
                                <th>Cost Price</th>
                                <th>Current Price</th>
                                <th>% change</th>
                            </tr>
                        </thead>
                        <tbody>
                        {cryptosData !== undefined &&
                            cryptosData.map((item, index) => {
                                return (
                                <tr key={index} onClick={() => clickHandler(item.Symbol)}>
                                    <td>{item.Symbol}</td>
                                    <td>{item.Volume}</td>
                                    <td>{item.CostPrice.toFixed(2)}</td>
                                    <td>
                                    {item['currentValue'] !== undefined &&
                                        item.currentValue.toFixed(2)}
                                    </td>
                                    <td>
                                    {item['difference'] !== undefined
                                        ? `${item.difference}%` : ""}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="card shadow bg-white" style={{borderRadius:"25px", width:"70rem", marginTop: "-30px"}}>
                    <Linechart title={"Historical stock prices"} data={historicData} symbol={symbol}/>
                </div>
            </div>
        </div>
        
        
    )

}

export default Dashboard;