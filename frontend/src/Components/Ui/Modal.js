import React from "react";

const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "blue"
};

const Modal = ({ canShow, updateModalState }) => {
  if (canShow) {
    return (
      <div style={modalStyles}>
        <h1>I'm a Modal!</h1>
        <button onClick={updateModalState}>Hide Me</button>
      </div>
    );
  }

  return null;
};

export default Modal;


