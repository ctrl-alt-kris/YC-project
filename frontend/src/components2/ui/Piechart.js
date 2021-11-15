import {Pie} from "react-chartjs-2"


const Piechart = (props) => {

    const labels = []
    const shares = []

    const dataSet = props.data
    for (let i = 0; i < dataSet.length; i++) {
        labels.push(dataSet[i]["Symbol"])
        shares.push(dataSet[i]["Volume"]*dataSet[i]["CostPrice"])
    }


    

    // if (volumesPerSymbol[0]["Symbol"] !== undefined){
    //     volumesPerSymbol.forEach((element, index) => labels.push(Object.keys(volumesPerSymbol[index])))
    //     volumesPerSymbol.forEach((element, index) => shares.push(Object.values(volumesPerSymbol[index])))
        
    // }

    console.log({labels})
    console.log({shares})

    const data = {
        // datasets: [{
        //     data: [10, 20, 30]
        // }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: shares,
            backgroundColor: [
                '#003f5c',
                '#2f4b7c',
                '#0e0270',
                '#665191',
                '#a05195',
                '#49054a',
                '#d45087',
                '#f95d6a',
                '#ff7c43',
                '#ffa600',
            ],
            hoverOffset: 4
          }]

    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: props.title
            },
            tooltip:{
                display: true
            },
            datalabels: {
                display: true
            }
        },
    }





    return(
        <div>
            <Pie data={data} options={options} 
	></Pie>
        </div>
    )
}

export default Piechart;

