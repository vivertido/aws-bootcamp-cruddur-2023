
import './HomeFeedPage.css';
import React from "react";

import DesktopNavigation  from '../components/DesktopNavigation';
import DesktopSidebar     from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';
//import { Auth } from 'aws-amplify';
import { getCurrentUser, Auth } from 'aws-amplify/auth';
// [TODO] Authenication
//import Cookies from 'js-cookie'

export default function HomeFeedPage() {
  const [activities, setActivities] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);
  
  

  const loadData = async () => {
    console.log("Loading data in Home Feed Page.")
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
      const res = await fetch(backend_url, {
        method: "GET"
      });
      let resJson = await res.json();
      if (res.status === 200) {
        console.log(resJson)
        setActivities(resJson)
      } else {
        console.log(res)
      }
    } catch (err) {
      console.log(err);
    }
  };


/*

try {
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log(`The username: ${username}`);
    console.log(`The userId: ${userId}`);
    console.log(`The signInDetails: ${signInDetails}`);
  } catch (err) {
    console.log(err);
  }

*/


  const checkAuth = async () => {

    console.log("checkAuth...")

    Auth.fetchAuthSession()
  .then(session => {
    if (session) {
      // User is authenticated
      const userId = session.user.username; // Get user ID from session
      console.log("Current user ID:", userId);
      // Use userId with getUserAttributes if needed
    } else {
      // User is not authenticated
      console.log("User is not authenticated");
    }
  })
  .catch(error => {
    console.error("Error fetching auth session:", error);
  });



    // try{
    // let currentUser = await getCurrentUser();
  
    // console.log(`The username: ${currentUser.username}`);
    // console.log(`The userId: ${currentUser.userId}`);
    // //console.log(`The signInDetails: ${currentUser.signInDetails}`);
    // console.log( Object.keys(currentUser));

    // let cognito_user = currentUser;
    // setUser({
    //   display_name: cognito_user.attributes.name,
    //   handle: cognito_user.attributes.preferred_username
    // })

    // } catch (err){
    //   console.log(err)
    //   console.log("The User is not yet Authenticated.")

    // }




    // Auth.currentAuthenticatedUser({
    //   // Optional, By default is false. 
    //   // If set to true, this call will send a 
    //   // request to Cognito to get the latest user data
    //   bypassCache: false 
    // })
    // .then((user) => {
    //   console.log('user',user);
    //   return Auth.currentAuthenticatedUser()
    // }).then((cognito_user) => {
    //     setUser({
    //       display_name: cognito_user.attributes.name,
    //       handle: cognito_user.attributes.preferred_username
    //     })
    // })
    // .catch((err) => console.log(err));
  };

  React.useEffect(()=>{
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth();
  }, [])

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
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
