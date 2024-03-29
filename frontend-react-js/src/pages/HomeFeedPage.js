import "./HomeFeedPage.css";
import React from "react";

import DesktopNavigation from "../components/DesktopNavigation";
import DesktopSidebar from "../components/DesktopSidebar";
import ActivityFeed from "../components/ActivityFeed";
import ActivityForm from "../components/ActivityForm";
import ReplyForm from "../components/ReplyForm";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";


export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);

  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }

  getCurrentUser;

  const loadData = async () => {
    console.log("Loading data in Home Feed Page.");
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`;
      const res = await fetch(backend_url, {
        method: "GET",
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log(resJson);
        setActivities(resJson);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAuth = async () => {
    console.log("checkAuth...");

    try {
      let currentUser = await getCurrentUser();

      console.log(`The username: ${currentUser.username}`);
      console.log(`The userId: ${currentUser.userId}`);
      //console.log(`The signInDetails: ${currentUser.signInDetails}`);
      console.log(Object.keys(currentUser));

      try {
        const userAttributes = await fetchUserAttributes();
        console.log("authenticated user Attributes:");
        console.log(userAttributes);

        setUser({
          display_name: userAttributes.name,
          handle: userAttributes.preferred_username,
        });
      } catch (err) {
        console.log("Error fetchingUserAttributes: " + err);
      }

      let cognito_user = currentUser;
    } catch (err) {
      console.log(err);
      console.log("The User is not yet Authenticated.");
    }

  };

  React.useEffect(() => {
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth();
  }, []);

  return (
    <article>
      <DesktopNavigation user={user} active={"home"} setPopped={setPopped} />
      <div className="content">
        <ActivityForm
          popped={popped}
          setPopped={setPopped}
          setActivities={setActivities}
        />
        <ReplyForm
          activity={replyActivity}
          popped={poppedReply}
          setPopped={setPoppedReply}
          setActivities={setActivities}
          activities={activities}
        />
        <ActivityFeed
          title="Home"
          setReplyActivity={setReplyActivity}
          setPopped={setPoppedReply}
          activities={activities}
        />
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}
