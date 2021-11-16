import { useEffect, useState, useContext } from "react";
import Modal from "../ui/Modal";
import "./Upload.css";
import { DataContext } from "../../utils/DataContext";
import { useNavigate } from "react-router";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const { auth } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8000/users/me", {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((payload) => {
        setPortfolios(payload["portfolios"]);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    var form = new FormData();
    form.append("file", selectedFile);

    fetch(`http://localhost:8000/upload-csv/${currentPortfolio}`, {
      method: "POST",
      body: form,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${auth.access_token}`,
      },
    }).then(res => res.json()).then(payload => {
      navigate("/home")
    });
  };

  const addTransaction = (data) => {
    setShowModal(false);
    console.log(data);
    fetch(
      `http://localhost:8000/portfolio/${currentPortfolio}/add-transaction`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };
  return (
    <div className="card box">
      <div className="row">
        <h1 className="col-8">Upload</h1>
        <button className="btn btn-primary col-4" onClick={() => setShowModal(true)}>Add Transaction</button>
      </div>
      {portfolios && portfolios.length > 0 && (
        <div className="row">
 
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="portfolios" className="form-label">
                  Choose a Portfolio:
                </label>
                <select
                  className="form-select"
                  name="portfolios"
                  id="portfolios"
                  onChange={(e) => {
                    setCurrentPortfolio(e.target.value);
                  }}
                >
                  <option>Select a portfolio</option>
                  {portfolios.map((portfolio, index) => {
                    return (
                      <option value={portfolio.id} key={index}>
                        {portfolio.portfolio_type}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3 col-12">
                
                <input
                  className="form-control"
                  type="file"
                  id="positionsFile"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <button type="submit" className="btn btn-primary my-3 float-end">
                Submit
              </button>
            </form>

        </div>
      )}


      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        setCurrentPortfolio={setCurrentPortfolio}
        portfolios={portfolios}
        onSubmit={(data) => addTransaction(data)}
      />
    </div>
  );
};

export default Upload;
