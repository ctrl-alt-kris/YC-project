import {Line} from "react-chartjs-2"

const Linechart = (props) => {

    const data = props.data
    console.log({data})


    return(
        <div className="my-line-chart" style={{width: "500px", height: "300px"}}>
            <Line data={data} options={props.options}></Line>
        </div>
    )
}

export default Linechart;