import "./Dashboard.css"
import { useState, useEffect} from 'react'
import { FcBookmark, FcSalesPerformance, FcComboChart } from "react-icons/fc";
import Piechart from "../Ui/Piechart";

const apiKey = "c64eft2ad3i8bn4fjpn0";

const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = apiKey; // Replace this
const finnhubClient = new finnhub.DefaultApi();

const Dashboard = () => {
    const [stocks, setStocks] = useState([])
    const [cryptos, setCryptos] = useState([])
    const [stocksData, setStocksData] = useState([])
    const [cryptosData, setCryptosData] = useState([])

    const fetchLiveDataStocks = (stocks) => {
      if (stocks && stocks.length > 0) {
        stocks.forEach((stock) => {
          finnhubClient.quote(stock.Symbol, (error, data, response) => {
              let stockData = {...stock}
              if (Object.keys(data).includes("c"))
              {
              const closingPrice = data["c"]
              stockData["currentValue"] =  closingPrice
              const difference =  ( closingPrice - stockData['CostPrice'])/ stockData['CostPrice']
              stockData["difference"] = Math.round(difference * 10000) / 100
  
  
              }
              console.log(stockData)
              setStocksData(prevState => [...prevState, stockData])
          });
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
  
    const fetchPositions = (portfolioId, data, setData) => {
      fetch(`http://localhost:8000/portfolio/${portfolioId}/positions`)
        .then((res) => res.json())
        .then((payload) => {
          setData(payload);
        });
    };
  
    useEffect(() => {
        fetchPositions(3, stocks, setStocks)
        fetchPositions(5, cryptos, setCryptos)
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
  
  
  const totalCosts = (investments => {
      let total = 0
      investments.map(investment => {
          total += investment.Volume * investment.CostPrice
      })
      return total
  })
  
  const totalGain = (investments) => {
      let total = 0
      investments.map(investment => {
          total += investment.Volume * (investment.currentValue - investment.CostPrice)
      })
      return total
  }
  
  const convertToDollars = (number) => {
      return `${Math.round(number * 100)/100}`
  }


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
                    <Piechart title={"Stock distribution (top 10 largest positions)"} data={stocksData}/>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card mt-2 shadow p-3 mb-5 bg-white" style={{borderRadius:"25px"}}>
                    <Piechart title={"Crypto distribution (top 10 largest positions)"} data={cryptosData}/>
                    </div>
                </div>
            </div>
        </div>
        
        
    )


};

export default Dashboard;
