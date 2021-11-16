
import "./Home.css"
import Dashboard from "./Dashboard"
import News from '../Elements/News'
import HighestReturns from "../Elements/HighestReturns"

const Home = () => {

    return(
        <div className="d-flex">
            <div className="col-12">
                <HighestReturns />
                {/* <News /> */}
                <Dashboard></Dashboard>
            </div>
        </div>
    )
}

export default Home