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
  const [current, setCurrent] = useState();
  const [quotes, setQuotes] = useState({});
  const stockData = mockDataStocks;
  // get all symbols in an array
  const stockSymbols = [];

//   stockData.forEach((element) => {
//     stockSymbols.push([
//       element["Symbol"],
//       element["CostPrice"],
//       element["Volume"],
//     ]);
//   });

  useEffect(() => {
    stockData.forEach((element) => {
      finnhubClient.quote(element["Symbol"], (error, data, response) => {
        stockSymbols.push([
          element["Symbol"],
          element["CostPrice"],
          element["Volume"],
          data.c,
        ]);
      });
    });
  }, []);

  stockSymbols.sort((a, b) => (a[1] < b[1] ? 1 : -1));

  return (
    <div>
      <div className="col-11 card mt-2 shadow p-3 mb-5 bg-white rounded flex-row">
        {stockSymbols.map((elem) => {
          if (stockSymbols.indexOf(elem) < 10) {
            return (
              // <div key={elem[0]} style={{margin: "auto", borderStyle: "solid", borderWidth: "1px", padding: "10px"}}>
              <div key={elem[0]} style={{ margin: "auto", padding: "10px" }}>
                <div style={{ textAlign: "center", fontWeight: "bold" }}>
                  {elem[0]}
                </div>
                <div style={{ textAlign: "center" }}>${elem[1]}</div>
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
