import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElement/Card";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No user found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            login={user.login}
            activityCount={user.activities.length}
          />
        );
      })}
    </ul>
  );
};

export default UsersList;
