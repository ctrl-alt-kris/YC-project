// symbol, cost-price*volume
import mockDataStocks from "../pages/mockDataStocks.json";
import "./HighestReturns.css";
import { useState, useEffect, useContext, useRef } from "react";

const apiKey = "c69rbnaad3idi8g5i3mg";

//pass array to api request
const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = apiKey; // Replace this
const finnhubClient = new finnhub.DefaultApi();

function HighestReturns(props) {
  const [stockData, setStockData] = useState(props.stocksData);

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
        element["ROI"] = calculateROI(
          currentPrices[element["Symbol"]],
          element["CostPrice"],
          element["Volume"]
        ).toFixed(2);
        //stockData.sort((a, b) => (a["ROI"] < b["ROI"] ? 1 : -1));
        setStockData([...stockData]);
        console.log(stockData);
    });
  }, []);

  // console.log("sorted: ", stockData);

  return (
    <div>
      <div className="col-12 card mt-3 shadow p-3 mb-5 bg-white rounded flex-row">
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
