import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import ActivitiesList from "../components/ActivitiesList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";


const UserActivities = () => {
  const [loadedActivities, setLoadedActivities] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory()
  const userId = useParams().userId;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/activity/user/${userId}`
        );

        setLoadedActivities(responseData.activities);
      } catch (err) {}
    };
    fetchActivities();
  }, [sendRequest, userId]);

  const activityDeletedHandler = () => {
    history.push("/")
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedActivities && (
        <ActivitiesList
          items={loadedActivities}
          onDeleteActivity={activityDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UserActivities;
