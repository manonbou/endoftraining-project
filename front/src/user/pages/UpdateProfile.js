import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom"; //useParams to get the actual activity ID which is part of the url, and store it in a constant

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./ProfileForm.css";

const UpdateProfile = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); 
  const [loadedActivity, setLoadedActivity] = useState();
  const userId = useParams().userId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
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
      }
    },
    false
  );

  useEffect(() => {
    const fetchActivityToUpdate = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/profile/${userId}`
        );

        setLoadedActivity(responseData.user);
        setFormData(
          {
            login: {
              value: responseData.user.login,
              isValid: true,
            },
            email: {
              value: responseData.user.email,
              isValid: true,
            },
            password: {
              value: responseData.user.password,
              isValid: true,
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchActivityToUpdate();
  }, [sendRequest, userId, setFormData]);

  const activityUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/users/profile/edit/${userId}`,
        "PATCH",
        JSON.stringify({
          login: formState.inputs.login.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }),
        { "Content-Type": "application/json", Authorization: 'Bearer ' + auth.token }
      );
      history.push("/" + auth.userId + "/profile");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedActivity && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find activity</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedActivity && (
        <form className="place-form" onSubmit={activityUpdateSubmitHandler}>
          <Input
            id="login"
            element="input"
            type="text"
            label="Login"
            validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(20)]}
            errorText="Please enter a valid login (between 6 and 20 characters)."
            onInput={inputHandler}
            initialValue={loadedActivity.login}
            initialValid={true}
          />
          <Input
            id="email"
            element="input"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email adress."
            onInput={inputHandler}
            initialValue={loadedActivity.email}
            initialValid={true}
          />
          <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_MAXLENGTH(30)]}
            errorText="Please enter a valid password (between 6 and 30 characters)."
            onInput={inputHandler}
            initialValue={loadedActivity.password}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PROFILE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProfile;
