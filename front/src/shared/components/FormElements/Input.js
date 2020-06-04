import React, { useReducer, useEffect } from "react";

import { validate } from "../../utils/validators";
import "./Input.css";

// ------- Reducer Function -------// Takes 2 argments //Always return a new state
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });
  //useReducer returned array of 2 elements, first one = current state

  const { id, onInput } = props;
  const { value, isValid } = inputState; //no need props and inputState above anymore

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  }; //called on every keystroke

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;

//The input component will manage external state, what user enter and if it is valid or not (external configuration)
// Input component takes validate props (=array)

//To manage differents states connected, better to use hook reducer than hook state.
// Hook reducer allows to manage state in a component + gives function to called to update state + re-render component

// Reducer = function which receives an action (can be dispatch) and the current state.
// When current state is updated based on the action received, return new state +
// reducer take new state and give it back in the component + re-render everything (=> then run more complex state updating logic)
