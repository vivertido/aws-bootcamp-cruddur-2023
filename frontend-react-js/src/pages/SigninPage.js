import './SigninPage.css';
import React from "react";
import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { Link } from "react-router-dom";

// [TODO] Authenication
//import Cookies from 'js-cookie'
//import { Auth } from 'aws-amplify'
import { signIn , fetchUserAttributes } from 'aws-amplify/auth';



export default function SigninPage() {

  let signInStatus = "Idle";
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const [cognitoErrors, setCognitoErrors] = React.useState('');

  async function onsubmit(event) {
    setCognitoErrors('');
    event.preventDefault();
    signInStatus = "Logging in..."
  
    try {
      let username = email;
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log("is signedIn: " + isSignedIn);
      console.log("next step: " + nextStep);

      try {
              const userAttributes = await fetchUserAttributes();
              console.log("User Attributes: ")
              console.log(userAttributes);
            } catch (error) {
              console.log("Error fetching user attributes:", error);
              // Handle the error appropriately
            }

  
      // Redirect to confirmation page only if necessary and exit the function
      if (!isSignedIn && error.code === "UserNotConfirmedException") {
        window.location.href = "/confirm";
        return;
      }
  
      // Handle successful sign-in or other errors here
    } catch (error) {
      console.log("Error signing in:", error);
      setCognitoErrors(error.message);
    }
  
    return false;
  }

  // async function onsubmit(event, { username, password }) {
  //   setErrors('')
  //   event.preventDefault();



  //     // const signInResult = await signIn({ username, password });
  //     // console.log("Signin result: ")
  //     // console.log(signInResult)
     
  //     // try {
  //     //   const userAttributes = await fetchUserAttributes();
  //     //   console.log("User Attributes: ")
  //     //   console.log(userAttributes);
  //     // } catch (error) {
  //     //   console.log("Error fetching user attributes:", error);
  //     //   // Handle the error appropriately
  //     // }
    
  //     // Handle signInResult if applicable (e.g., check isSignedIn)
  //   try {
  //       const { isSignedIn, nextStep } = await signIn({ username, password });
  //         console.log("is signedIn: " + isSignedIn);
  //         console.log("next step: " +nextStep);
  //   } catch (error) {
  //     console.log("Error signing in:", error);
    
  //     if (error.code === "UserNotConfirmedException") {
  //       window.location.href = "/confirm";
  //     } else {
  //       setCognitoErrors(error.message);
  //     }
  //   }


  //   return false
  // }



  const email_onchange = (event) => {
    setEmail(event.target.value);
  }
  const password_onchange = (event) => {
    setPassword(event.target.value);
  }

  let el_errors;
  if (cognitoErrors){
    el_errors = <div className='errors'>{cognitoErrors}</div>;
  }

  
  
  return (
    <article className="signin-article">
      <div className='signin-info'>
        <Logo className='logo' />
      </div>
      <div className='signin-wrapper'>
        <form 
          className='signin_form'
          onSubmit={onsubmit}
        >
          <h2>Sign into your Cruddur account</h2>
          <div className='fields'>
            <div className='field text_field username'>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={email_onchange} 
              />
            </div>
            <div className='field text_field password'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={password_onchange} 
              />
            </div>
          </div>
          {el_errors}
          <div className='submit'>
            <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
            
            <button type='submit'>Sign In</button>

          </div>
          <div className='errors'>Status:{signInStatus}</div>
        </form>
        <div className="dont-have-an-account">
          <span>
            Don't have an account?
          </span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>

    </article>
  );
}