import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ActivitiesList from "../components/ActivitiesList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserActivities = () => {
  const [loadedActivities, setLoadedActivities] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const activityDeletedHandler = (deletedActivityId) => {
    setLoadedActivities((prevActivities) =>
      prevActivities.filter((activity) => activity.id !== deletedActivityId)
    );
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
