import React, {useState} from "react";
import "./Modal.css"

const Modal = (props) => {
  const [ticker, setTicker] = useState()
  const [volume, setVolume] = useState()
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
          <input type="text" name="" placeholder="Ticker" onChange={e => setTicker(e.target.value)}/> 
          <input type="text" name="" placeholder="Volume" onChange={e => setVolume(e.target.value)}/> 
          <input type="text" name="" placeholder="Value" onChange={e => setValue(e.target.value)}/> 
          </div>
          <div className="modal-footer">
          <input onClick={props.onClose} type="submit" name="" value="Cancel" />
          <input onClick={props.onClose} type="submit" name="" value="Submit" />
   
          </div>
        </div>
      </div>
    );
};

export default Modal;


