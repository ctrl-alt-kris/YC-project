import "./Dashboard.css";
import { useState, useEffect, useContext } from "react";
import { FcBookmark, FcSalesPerformance, FcComboChart } from "react-icons/fc";
import Piechart from "../ui/Piechart";


import { DataContext } from "../../utils/DataContext";
import { useNavigate } from "react-router-dom";
import HighestReturns from "../elements/HighestReturns";



//const apiKey = "c69rbnaad3idi8g5i3mg";

const apiKey = "c64eft2ad3i8bn4fjpn0";
//pass array to api request
const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = apiKey; // Replace this
const finnhubClient = new finnhub.DefaultApi();

// get all symbols in an array
const stockSymbols = [];
const costs = [];

// stockData.forEach(element => stockSymbols.push(element["Symbol"]))
// stockData.forEach(element => costs.push(element['CostPrice']*element["Volume"]))

const totalStockCosts = costs.reduce(function (costs, b) {
  return costs + b;
}, 0);

const Dashboard = () => {
    const [stocks, setStocks] = useState([])
    const [cryptos, setCryptos] = useState([])
    const [stocksData, setStocksData] = useState([])
    const [cryptosData, setCryptosData] = useState([])
    const {auth} = useContext(DataContext)
    const navigate = useNavigate()
  

const checkData = () => {
    fetch("http://localhost:8000/users/me", {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((payload) => {
        const portfolios = payload["portfolios"]
        console.log(portfolios)
        const portfolio_types = portfolios.map(portfolio => portfolio.portfolio_type)
        if (portfolios && portfolio_types.includes("Stocks") && portfolio_types.includes("Crypto"))
        {
          const stockTransActions = portfolios.filter(portfolio => portfolio.portfolio_type === "Stocks")[0]["transactions"]
          const cryptoTransActions = portfolios.filter(portfolio => portfolio.portfolio_type === "Crypto")[0]["transactions"]
        //   setPortfolios(payload["portfolios"]);
          if (cryptoTransActions.length === 0 && stockTransActions.length === 0)
          navigate("/upload")
        }
      });
}

  const fetchLiveDataStocks = (stocks) => {
    if (stocks && stocks.length > 0) {
      stocks.forEach((stock) => {
        finnhubClient.quote(stock.Symbol, (error, data, response) => {
            let stockData = {...stock}
            if ( data && Object.keys(data).includes("c"))
            {
            const closingPrice = data["c"]
            stockData["currentValue"] =  closingPrice
            const difference =  ( closingPrice - stockData['CostPrice'])/ stockData['CostPrice']
            stockData["difference"] = Math.round(difference * 10000) / 100


            }
            
            setStocksData(prevState => [...prevState, stockData])
        });
      });
    }
  };

  const fetchLiveDataCrypto = (cryptos) => {
    cryptos.forEach((crypto) => {
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.Symbol}&vs_currencies=usd`
      )
        .then((res) => res.json())
        .then((data) => {
          let cryptoData = { ...crypto };
          if (Object.keys(data).includes(crypto.Symbol)) {
            const currentValue = data[crypto.Symbol]["usd"];
            cryptoData["currentValue"] = currentValue;
            const difference =
              (currentValue - cryptoData["CostPrice"]) /
              cryptoData["CostPrice"];
            cryptoData["difference"] = Math.round(difference * 10000) / 100;
          }
          setCryptosData((prevState) => [...prevState, cryptoData]);
        });
    });
  };

  const fetchPositions = (portfolioType, data, setData) => {
    fetch(`http://localhost:8000/portfolio/${portfolioType}/positions`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
      });
  };

  useEffect(() => {
      checkData()
      fetchPositions("Stocks", stocks, setStocks)
      fetchPositions("Crypto", cryptos, setCryptos)
  }, [])

  useEffect(() => {
    if (stocks.length > 0) {
      fetchLiveDataStocks(stocks);
    }
  }, [stocks]);

  useEffect(() => {
    if (cryptos.length > 0) {
      fetchLiveDataCrypto(cryptos);
    }
  }, [cryptos]);

  const totalCosts = (investments) => {
    let total = 0;
    investments.map((investment) => {
      total += investment.Volume * investment.CostPrice;
    });
    return total;
  };

  const totalGain = (investments) => {
    let total = 0;
    investments.map((investment) => {
      total +=
        investment.Volume * (investment.currentValue - investment.CostPrice);
    });
    return total;
  };

  const convertToDollars = (number) => {
    return `$${Math.round(number * 100) / 100}`;
  };

  return (
    <div className="container">
        <HighestReturns stocksData={stocksData}/>
      <div className="row">
        <div
          class="card mt-3 shadow mb-1 bg-white"
          style={{ borderRadius: "25px", width: "30%", marginTop: "-20px" }}
        >
          <div class="card-body">
            <div className="card-icon">
              <FcBookmark />
            </div>
            <div className="card-title">Starting Balance</div>
            <div className="card-text">
              {convertToDollars(
                totalCosts(stocksData) + totalCosts(cryptosData)
              )}
            </div>
          </div>
        </div>
        <div
          class="card mt-3 shadow mb-2 bg-white"
          style={{ borderRadius: "25px", width: "30%", marginTop: "-20px" }}
        >
          <div class="card-body">
            <div className="card-icon">
              <FcSalesPerformance />
            </div>
            <div className="card-title">Total gains / losses</div>
            <div className="card-text">
              {convertToDollars(totalGain(stocksData) + totalGain(cryptosData))}
            </div>
          </div>
        </div>
        <div
          class="card mt-3 shadow mb-2 bg-white"
          style={{ borderRadius: "25px", width: "30%", marginTop: "-20px" }}
        >
          <div class="card-body">
            <div className="card-icon">
              <FcComboChart />
            </div>
            <div className="card-title">% return</div>
            <div className="card-text">
              {(
                ((totalGain(stocksData) +
                  totalGain(cryptosData) -
                  totalCosts(stocksData) -
                  totalCosts(cryptosData)) /
                  (totalCosts(stocksData) + totalCosts(cryptosData))) *
                100
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-10 col-xl-6">
          <div
            className="card mt-2 shadow p-3 mb-5 bg-white"
            style={{ borderRadius: "25px" }}
          >
            <Piechart
              title={"Stock distribution (top 10 largest positions)"}
              data={stocksData}
            />
          </div>
        </div>
        <div className="col-10 col-xl-6">
          <div
            className="card mt-2 shadow p-3 mb-5 bg-white"
            style={{ borderRadius: "25px" }}
          >
            <Piechart
              title={"Crypto distribution (top 10 largest positions)"}
              data={cryptosData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
