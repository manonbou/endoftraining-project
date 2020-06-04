import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Profile = () => {

  const auth = useContext(AuthContext);
  const [loadedActivities, setLoadedActivities] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  const history = useHistory();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/profile/${userId}`
        );

        setLoadedActivities(responseData.user);
      } catch (err) {}
    };
    fetchActivities();
  }, [sendRequest, userId]);

  const activityDeletedHandler = () => {
    auth.logout();
    history.push("/");
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
        <UserProfile
          items={loadedActivities}
          onDeleteActivity={activityDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Profile;
