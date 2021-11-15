import mockDataStocks from "./mockDataStocks.json";
import MockDataCrypto from "./MockDataCrypto.json";
import { useState, useEffect } from "react";

const apiKey = "c64eft2ad3i8bn4fjpn0";

//pass array to api request
const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = apiKey; // Replace this
const finnhubClient = new finnhub.DefaultApi();

const Dashboard = () => {
    const [stocks, setStocks] = useState([])
    const [cryptos, setCryptos] = useState([])
    const [stocksData, setStocksData] = useState([])
    const [cryptosData, setCryptosData] = useState([])
  // query for each symbol (company) in portfolio
//   const [quotes, setQuotes] = useState({});
//   const [cryptos, setCryptos] = useState({});
//   const [stockData, setStockData] = useState([]);
//   const [cryptoData, setCryptoData] = useState([]);
//   const [stockNames, setStockNames] = useState([])
//   const [cryptoNames, setCryptoNames] = useState([])
//   const [stockCosts, setStockCosts] = useState([])
//   const [cryptoCosts, setCryptoCosts] = useState([])
//   const [totalStockCosts, setTotalStockCosts] = useState(undefined)
//   const [totalCryptoCosts, setTotalCryptoCosts] = useState(undefined)
//   const [totalPortfolioCosts, setTotalPortfolioCosts] = useState(undefined)

  // const stockData = mockDataStocks
  // const cryptoData = MockDataCrypto

  // get all symbols in an array
  // const stockSymbols = [];
  // const costs = []

  // stockData.forEach(element => stockSymbols.push(element["Symbol"]))
  // stockData.forEach(element => costs.push(element['CostPrice']*element["Volume"]))

  // const totalStockCosts = costs.reduce(function(costs, b) { return costs + b; }, 0);

  // const cryptoNames = []
  // const cryptoCosts = []

  // cryptoData.forEach(element => cryptoNames.push(element["Symbol"]))
  // cryptoData.forEach(element => cryptoCosts.push(element['CostPrice']*element["Volume"]))

  // const totalCryptoCosts = cryptoCosts.reduce(function(cryptoCosts, b) { return cryptoCosts + b; }, 0);

  // const totalPortfolioCosts = (totalStockCosts + totalCryptoCosts).toFixed(2)

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

//   useEffect(() => {
//     fetchPositions(3, stocks, setStocks);
//     fetchPositions(5, cryptos, setCryptos)
//   }, []);


//   //console.log({cryptos})
//   // create object for all closing prices from response
//   const closingPrices = {};
//   const tickers = [];
//   const prices = [];
//   const differences = [];

//   for (let i = 0; i < stockNames.length; i++) {
//     if (quotes[stockNames[i]] !== undefined && Object.keys(quotes[stockNames[i]]).includes("c")) {
//       tickers.push(stockNames[i]);
//       prices.push(quotes[stockNames[i]]["c"]);
//       differences.push(
//         (quotes[stockNames[i]]["c"] - stockData[i]["CostPrice"]) *
//           stockData[i]["Volume"]
//       );

//       tickers.forEach((key, i) => (closingPrices[key] = prices[i]));
//     }
//   }

//   const totalStockDifferences = differences.reduce(function (differences, b) {
//     return differences + b;
//   }, 0);

//   // create object for all current crypto prices

//   const cryptoPrices = {};
//   const names = [];
//   const cryptoPricesArray = [];
//   const cryptoDifferences = [];

// useEffect( () => {
//     console.log("called", cryptoNames, cryptos)
//   for (let i = 0; i < cryptoNames.length; i++) {
//       console.log(cryptos[cryptoNames[i]])
//     if (cryptos[cryptoNames[i]] !== undefined) {
//       names.push(cryptoNames[i]);
//       console.log(cryptos[cryptoNames[i]])
//       cryptoPricesArray.push(cryptos[cryptoNames[i]][cryptoNames[i]]["usd"]);
//       names.forEach((key, i) => (cryptoPrices[key] = cryptoPricesArray[i]));
//       cryptoDifferences.push(
//         (cryptos[cryptoNames[i]][cryptoNames[i]]["usd"] -
//           cryptoData[i]["CostPrice"]) *
//           cryptoData[i]["Volume"]
//       );
//       console.log(cryptoDifferences)
//     }
//   }
// },[cryptoNames, cryptos])

//   const totalCryptoDifferences = cryptoDifferences.reduce(function (
//     cryptoDifferences,
//     b
//   ) {
//     return cryptoDifferences + b;
//   },
//   0);

//   const totalPortfolioReturn = (
//     totalStockDifferences + totalCryptoDifferences
//   ).toFixed(2);

//   console.log(totalPortfolioReturn);

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
    return `$${Math.round(number * 100)/100}`
}

  return (
    <div className="container">
      <div class="card mt-5 shadow p-3 mb-2 bg-white rounded">
        <div class="card-body">
          <h4>Portfolio overview</h4>
          <h5>Starting Balance: {convertToDollars(totalCosts(stocksData) + totalCosts(cryptosData))}</h5>
          <h5>Total gains: {convertToDollars(totalGain(stocksData) + totalGain(cryptosData))}</h5>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="card mt-2 shadow p-3 mb-5 bg-white rounded">
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
                {stocksData !== undefined &&
                  stocksData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.Symbol}</td>
                        <td>{item.Volume}</td>
                        <td>{item.CostPrice}</td>
                        <td>
                          {item['currentValue'] !== undefined &&
                            item.currentValue}
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
          <div className="card mt-2 shadow p-3 mb-5 bg-white rounded">
            <table className="table caption-top">
              <caption>Crypto Currencies (price in $)</caption>
              <thead className="table-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Volume</th>
                  <th scope="col">Cost Price</th>
                  <th scope="col">Current Price</th>
                  <th scope="col">% change</th>
                </tr>
              </thead>
              <tbody>
                {cryptosData !== undefined &&
                  cryptosData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.Symbol}</td>
                        <td>{item.Volume}</td>
                        <td>{item.CostPrice}</td>
                        <td>
                          {item['currentValue'] !== undefined &&
                            item.currentValue}
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
      </div>
    </div>
  );
};

export default Dashboard;
