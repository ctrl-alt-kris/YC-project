// import { useEffect, useState } from "react";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import "./News.css";

// function News() {
//   const [data, setData] = useState([{ name: "test", url: "url" }]);
//   const [region, setRegion] = useState("en-GB");
//   const [category, setCategory] = useState("Business");

//   function transformData(d) {
//     const returnData = [];
//     d.forEach((item) => returnData.push([item.name, item.url]));
//     console.log("retdat :", returnData);
//     return returnData;
//   }

//   async function fetchData() {
//     const url = `https://bing-news-search1.p.rapidapi.com/news?textFormat=Raw&mkt=${region}&headlineCount=10&category=${category}`;
//     const opts = {
//       headers: {
//         "x-bingapis-sdk": "true",
//         "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
//         "x-rapidapi-key": "1c101cc536msh5e1966f509b8136p155e01jsna252abe3ca89",
//       },
//     };

//     try {
//       const resp = await fetch(url, opts);
//       const apidata = await resp.json();

//       console.log("data: %o", apidata);
//       setData(transformData(apidata.value));
//       console.log("apidata :", apidata.value);
//     } catch (err) {
//       // debugger;
//       console.error("fetch failed: %o", err);
//     }
//   }

//   useEffect(() => {
//     const timer = setInterval(fetchData, 10000);
//     return () => clearInterval(timer);
//   }, []);

//   function regionHandler(event) {
//     event.preventDefault();
//     console.log(event.target.value);
//     setRegion(event.target.value);
//   }

//   function categoryHandler(event) {
//     event.preventDefault();
//     console.log(event.target.value);
//     setCategory(event.target.value);
//   }

//   return (
//     <div className="col-8 card mt-2 shadow p-3 mb-5 bg-white rounded">
//       <div>
//         {data.map((item) => {
//           return (
//             <div>
//               <a className="link" key={item.name} href={item[1]}>
//                 {item[0]}
//               </a>
//             </div>
//           );
//         })}
//       </div>
//       <form className="col-8 margin-auto padding-0">
//         <label>Choose news region </label>
//         <select onChange={regionHandler}>
//           <option value="en-GB">UK</option>
//           <option value="en-US">US</option>
//           <option value="en-WW">World</option>
//         </select>
//         <label> Choose news </label>
//         <select onChange={categoryHandler}>
//           <option value="Business">Business</option>
//           <option value="Politics">Politics</option>
//           <option value="World">World</option>
//         </select>
//       </form>
//     </div>
//   );
// }

// export default News;
