import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group"; //animation librairy for the modal

import Backdrop from "./Backdrop"; // darker background behind the modal
import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
          <ModalOverlay {...props} /> 
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;

// <React.Fragment /> groups list of children without adding extra nodes to the DOM

// {...props} "..." = spread operator: to forward all the props which get from outside the modal overlay
// it takes props passed to modal to forward them to modal overlay (internal component not exported)
// spread operator takes key-value pairs of the props object & spreads them as attributes onto modal overlay