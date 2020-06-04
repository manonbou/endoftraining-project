import React from "react";

import Card from "../../shared/components/UIElement/Card";
import ActivityItem from "./ActivityItem";
import Button from '../../shared/components/FormElements/Button';
import "./ActivitiesList.css";

const ActivitiesList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No activity found. Maybe create one ?</h2>
          <Button to="/activities/new">Create an Activity</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((activity) => (
        <ActivityItem
          key={activity._id}
          id={activity._id}
          title={activity.title}
          description={activity.description}
          date={activity.date}
          //startTime={activity.startTime}
          location={activity.location}
          creatorId={activity.creator}
          onDelete={props.onDeleteActivity}
        />
      ))}
    </ul>
  );
};

export default ActivitiesList;
