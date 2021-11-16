import React, {useState} from "react";
import "./Modal.css"

const Modal = (props) => {
  const [ticker, setTicker] = useState()
  const [amount, setAmount] = useState()
  const [value, setValue] = useState()


  if(!props.show) {
    return null
  }
  
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Add a new transaction</h4>
          </div>

          <div className="modal-body">
          <select
              className="form-select"
              name="portfolios"
              id="portfolios"
              onChange={(e) => {
                props.setCurrentPortfolio(e.target.value);
              }}
            >                  <option >
            Select a portfolio
          </option>
              {props.portfolios.map((portfolio, index) => {
                return (
                  <option value={portfolio.id} key={index}>
                    {portfolio.portfolio_type}
                  </option>
                );
              })}
            </select>
          <input type="text" name="" placeholder="Ticker" onChange={e => setTicker(e.target.value)}/> 
          <input type="text" name="" placeholder="Volume" onChange={e => setAmount(e.target.value)}/> 
          <input type="text" name="" placeholder="Value" onChange={e => setValue(e.target.value)}/> 
          </div>
          <div className="modal-footer">
          <input onClick={props.onClose} type="submit" name="" value="Cancel" />
          <input onClick={() => props.onSubmit({ticker,amount,value})} type="submit" name="" value="Submit" />
   
          </div>
        </div>
      </div>
    );
};

export default Modal;

