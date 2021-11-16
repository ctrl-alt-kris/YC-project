import {Line} from "react-chartjs-2"
import { useEffect } from "react"


const Linechart = (props) => {

    const historicData = props.data
    const lineData = {}

//     if (historicData!==undefined) {
//     console.log(historicData)
//     //historicData.forEach(element => dates.push(element.date))
// }

    if (historicData!==undefined && historicData.length!==0) {
        console.log(historicData)
        historicData.forEach(element => lineData[element.date] = element.close)
        console.log(lineData)
    }




    

    //console.log({dates}

    //const labels = ['november','december', 'januari', 'februari', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november']
    const labels = Object.keys(lineData).reverse()
    const data = {
    labels: labels,
    datasets: [{
        data: Object.values(lineData).reverse(),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
    
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: props.title
            },
            tooltip:{
                display: false
            },
            datalabels: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio:false
    }


    return(
        <div className="my-line-chart" style={{width: "1000px", height: "300px"}}>
            <Line data={data} options={options}></Line>
        </div>
    )
}

export default Linechart;