import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
     
      try {
        const responseData = await sendRequest("http://localhost:5000/api/users/");
        
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

    //   const sendRequest = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response = await fetch("http://localhost:5000/api/users/");
    //       console.log(response);
    //       const responseData = await response.json();
    //       if (!response.ok) {
    //         throw new Error(responseData.message);
    //       }

    //       setLoadedUsers(responseData.users);
    //     } catch (err) {
    //       setError(err.message);
    //     }
    //     setIsLoading(false);
    //   };
    //   sendRequest();
    // }, []);

    // const errorHandler = () => {
    //   setError(null);
  // };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
