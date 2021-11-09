import { useEffect, useState } from "react";
import "./Upload.css";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/get_user?id=1")
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
    });
  };
  return (
    <div className="card box">
      <h1>Upload</h1>
      {portfolios.length > 0 && (
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
              {portfolios.map((portfolio, index) => {
                return (
                  <option value={portfolio.id} key={index}>
                    {portfolio.portfolio_type}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-3">
            <label for="positionsFile" className="form-label">
              File
            </label>
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
      )}
    </div>
  );
};

export default Upload;
