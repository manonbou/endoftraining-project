import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./ActivityForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const NewActivity = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient(); //_____________

  //setFormData not added here because not needed
  const [formState, inputHandler] = useForm(
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
      },
    },
    false
  );

  const history = useHistory(); //hook to redirect (push method, replace method)
  console.log(auth.userId);

    const activitySubmitHandler = async (event) => {
      event.preventDefault();
      try {
        await sendRequest('http://localhost:5000/api/activity', 'POST', JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        date: formState.inputs.date.value,
        location: formState.inputs.location.value,
        creator: auth.userId
      }),
      {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token}
      );
      history.push('/'); //Redirect user to starting page
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={activitySubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="location"
          element="input"
          label="Location"
          validators={[VALIDATOR_MINLENGTH(3)]}
          errorText="Please enter a valid location (at least 3 characters)."
          onInput={inputHandler}
        />
        <Input
          id="date"
          element="input"
          label="Date"
          validators={[VALIDATOR_MINLENGTH(10)]} //------------61------------- A VOIR AVEC EMAIL VALIDATOR !!!!!!!
          errorText="Please enter a valid date (format dd/mm/yyyy)."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD ACTIVITY
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewActivity;
