import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom"; //useParams to get the actual activity ID which is part of the url, and store it in a constant

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./ActivityForm.css";

const UpdateActivity = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); //_____________
  const [loadedActivity, setLoadedActivity] = useState();
  const activityId = useParams().activityId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      date: {
        value: "",
        isValid: false,
      },
      location: {
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
          `http://localhost:5000/api/activity/${activityId}`
        );

        setLoadedActivity(responseData.activity);
        setFormData(
          {
            title: {
              value: responseData.activity.title,
              isValid: true,
            },
            description: {
              value: responseData.activity.description,
              isValid: true,
            },
            location: {
              value: responseData.activity.location,
              isValid: true,
            },
            date: {
              value: responseData.activity.date,
              isValid: true,
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchActivityToUpdate();
  }, [sendRequest, activityId, setFormData]);

  const activityUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/activity/${activityId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          location: formState.inputs.location.value,
          date: formState.inputs.date.value,
        }),
        { "Content-Type": "application/json", Authorization: 'Bearer ' + auth.token }
      );
      history.push("/" + auth.userId + "/activities");
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
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedActivity.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedActivity.description}
            initialValid={true}
          />
          <Input
            id="location"
            element="input"
            type="text"
            label="Location"
            validators={[VALIDATOR_MINLENGTH(3)]}
            errorText="Please enter a valid location (at least 3 characters)."
            onInput={inputHandler}
            initialValue={loadedActivity.location}
            initialValid={true}
          />
          <Input
            id="date"
            element="input"
            type="text"
            label="Date"
            validators={[VALIDATOR_MINLENGTH(10)]}
            errorText="Please enter a valid date (format dd/mm/yyyy). Conditions de validation à adapter"
            onInput={inputHandler}
            initialValue={loadedActivity.date}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE ACTIVITY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateActivity;
