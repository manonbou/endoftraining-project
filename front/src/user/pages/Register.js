import React, { useState, useContext } from "react";

import "./Authentication.css";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_PASSWORD,
} from "../../shared/utils/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Register = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient(); 

  const [formState, inputHandler] = useForm(
    {
      login: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      password2: {
        value: "",
        isValid: false,
      },
    },
    false
  );


  const registrationSubmitHandler = async (event) => {
    event.preventDefault();

try{
  const responseData = await sendRequest(
        "http://localhost:5000/api/users/register",
        "POST",
        JSON.stringify({
          login: formState.inputs.login.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          password2: formState.inputs.password2.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(responseData.userId, responseData.token);
} catch (err) {

}
       
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Register Page</h2>
        <hr />
        <form onSubmit={registrationSubmitHandler}>
          <Input
            id="login"
            element="input"
            type="text"
            label="Login"
            validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(20)]}
            errorText="Please enter a valid login (between 6 and 20 characters)."
            onInput={inputHandler}
          />
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email adress."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(30)]}
            errorText="Please enter a valid password (between 6 and 30 characters)."
            onInput={inputHandler}
          />
          <Input
            id="password2"
            element="input"
            type="password"
            label="Confirm password"
            validators={[VALIDATOR_PASSWORD(formState.inputs.password.value)]}
            errorText="The passwords does not match."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            REGISTER
          </Button>
        </form>
        <Button inverse to="/login">
          SWITCH TO LOGIN
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Register;
