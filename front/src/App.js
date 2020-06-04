import React from "react"; //useCallback to avoid infinite loop (never have to be recreated)
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewActivity from "./activities/pages/NewActivity";
import UserActivities from "./activities/pages/UserActivities";
import UpdateActivity from "./activities/pages/UpdateActivity";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import Profile from "./user/pages/Profile";
import UpdateProfile from "./user/pages/UpdateProfile";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from './shared/hooks/auth-hook';


const App = () => {
  const { token, login, logout, userId } = useAuth();

  //conditionnal routes if user is logged in or not
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path="/:userId/activities" exact>
          <UserActivities />
        </Route>

        <Route path="/:userId/profile" exact>
          <Profile />
        </Route>

        <Route path="/profile/:userId">
          <UpdateProfile />
        </Route>

        <Route path="/activities/new" exact>
          <NewActivity />
        </Route>

        <Route path="/activities/:activityId">
          <UpdateActivity />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>

        <Route path="/register" exact>
          <Register />
        </Route>

        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

// Order of the routes very important !
