// symbol, cost-price*volume
import mockDataStocks from "../Pages/mockDataStocks.json";
import "./HighestReturns.css";
import { useState, useEffect, useContext, useRef } from "react";

const apiKey = "c65764qad3i9pn79lmc0";

//pass array to api request
const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = apiKey; // Replace this
const finnhubClient = new finnhub.DefaultApi();

function HighestReturns() {
  const [stockData, setStockData] = useState(mockDataStocks);

  // get current price for all stocks in stockData
  let currentPrices = {};

  function calculateROI(currentPrice, purchasePrice, volume) {
    // ROI = (((current price - purchase price) * volume) / (purchase price * volume)) * 100
    return (
      (((currentPrice - purchasePrice) * volume) / (purchasePrice * volume)) *
      100
    );
  }

  useEffect(() => {
    stockData.forEach((element) => {
      let symbol = element["Symbol"];
      finnhubClient.quote(symbol, (error, data, response) => {
        currentPrices[symbol] = data.c;
        element["ROI"] = calculateROI(
          currentPrices[element["Symbol"]],
          element["CostPrice"],
          element["Volume"]
        ).toFixed(2);
        stockData.sort((a, b) => (a["ROI"] < b["ROI"] ? 1 : -1));
        // setStockData([...stockData]);
      });
    });
  }, [currentPrices, stockData]);

  console.log("sorted: ", stockData);

  return (
    <div>
      <div className="col-11 card mt-2 shadow p-3 mb-5 bg-white rounded flex-row">
        {stockData.map((elem) => {
          // if (x.indexOf(elem) < 10)
          return (
            <div
              key={elem["Symbol"]}
              style={{ margin: "auto", padding: "10px" }}
            >
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                {elem["Symbol"]}
              </div>
              <div style={{ textAlign: "center" }}>{elem["ROI"]}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HighestReturns;
