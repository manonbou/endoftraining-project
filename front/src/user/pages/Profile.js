import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Profile = () => {

  const auth = useContext(AuthContext);
  const [loadedUser, setLoadedUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  const history = useHistory();

  useEffect(() => {
    const fetchUser= async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/profile/${userId}`
        );

        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

  const userDeletedHandler = () => {
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
      {!isLoading && loadedUser && (
        <UserProfile
          items={loadedUser}
          onDeleteUser={userDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Profile;
