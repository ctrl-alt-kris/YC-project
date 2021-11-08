import mockData from "./mockData.json"
import {useState, useEffect} from 'react'

const Dashboard = () => {

    const [quotes, setQuotes] = useState([])

    const apiKey = "c64eft2ad3i8bn4fjpn0"
    const stockData = mockData

    // get all symbols in an array
    const symbols = [];
    stockData.forEach(element => symbols.push(element["Symbol"]))
    console.log({symbols})

    //pass array to api request
    const finnhub = require('finnhub')

    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = apiKey // Replace this
    const finnhubClient = new finnhub.DefaultApi()

    //Quote
    
    // symbols.forEach(element => quotes.push(finnhubClient.quote(element, (error, data, response))))
    useEffect( () => {
        for (let symbol = 0; symbol < symbols.length; symbol++) {
            finnhubClient.quote(symbols[symbol], (error, data, response) => setQuotes(prevstate => [...prevstate, data])) }
        
        console.log(quotes)
    },[])
    

    

    

    

    // var result = {};
    // symbols.forEach((key, i) => result[key] = quotes[i]);
    // console.log(result);


    
    return(

        <div>Hi</div>
    )

}

export default Dashboard;