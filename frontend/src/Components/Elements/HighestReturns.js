// symbol, cost-price*volume
import mockDataStocks from "../Pages/mockDataStocks.json";
import "./HighestReturns.css";
import { useState, useEffect } from "react";

const apiKey = "c65764qad3i9pn79lmc0";

//pass array to api request
const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = apiKey; // Replace this
const finnhubClient = new finnhub.DefaultApi();

function HighestReturns() {
  const [quotes, setQuotes] = useState({});
  const stockData = mockDataStocks;
  // get all symbols in an array
  const stockSymbols = [];

  stockData.forEach((element) => {
    stockSymbols.push([
      element["Symbol"],
      element["CostPrice"],
      element["Volume"],
    ]);
  });

  // ROI = (((current price - purchase price) * volume) / (purchase price * volume)) * 100

  function calculateROI(currentPrice, purchasePrice, volume) {
    return (
      (((currentPrice - purchasePrice) * volume) / (purchasePrice * volume)) *
      100
    );
  }

  useEffect(() => {
    stockData.forEach((element) => {
      let symbol = element["Symbol"];
      finnhubClient.quote(symbol, (error, data, response) => {
          console.log("in quotes: ", quotes);
        setQuotes({ ...quotes, [symbol]: data.c });
      });
    });
  }, []);

  console.log("quotes: ", quotes);
  console.log(stockSymbols);

  stockSymbols.forEach((element) => {
    element.push(calculateROI(quotes[element["Symbol"]], element[1], element[2]));
  });

  console.log("With ROI added: ", stockSymbols);

  console.log(stockData);

  stockSymbols.sort((a, b) => (a[1] < b[1] ? 1 : -1));
  console.log("THIS ONE HERE: ", stockSymbols);

  return (
    <div>
      <div className="col-11 card mt-2 shadow p-3 mb-5 bg-white rounded flex-row">
        {stockSymbols.map((elem) => {
          if (stockSymbols.indexOf(elem) < 10) {
            return (
              // <div key={elem[0]} style={{margin: "auto", borderStyle: "solid", borderWidth: "1px", padding: "10px"}}>
              <div key={elem[1]} style={{ margin: "auto", padding: "10px" }}>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                  {elem[0]}
                </div>
                <div style={{ textAlign: "center" }}>{elem[1]}%</div>
              </div>
            );
          } else {
            return <div />;
          }
        })}
      </div>
    </div>
  );
}

export default HighestReturns;
