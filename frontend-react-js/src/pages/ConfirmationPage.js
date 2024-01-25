import './ConfirmationPage.css';
import React from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { confirmSignUp } from 'aws-amplify/auth';


// [TODO] Authenication
//import Cookies from 'js-cookie'



export default function ConfirmationPage() {
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [cognitoErrors, setCognitoErrors] = React.useState('');
   
  const [codeSent, setCodeSent] = React.useState(false);
  const [searchParams] = useSearchParams();

  // Extract username from query string:
  const username = searchParams.get('username');

  const params = useParams();

  const code_onchange = (event) => {
    setCode(event.target.value);
    console.log(code);
  }
  const email_onchange = (event) => {
    setEmail(event.target.value);
  }

  const resend_code = async (event) => {
    console.log('resend_code')
    setCognitoErrors('')
    // [TODO] Authenication

    







  }

  const onsubmit = async (event) => {
    event.preventDefault();
    console.log('ConfirmationPage.onsubmit')
    setCognitoErrors('')
    // [TODO] Authenication
    console.log("The confirmation code is: " + code);
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        code
      });
      window.location.href = "/"
    } catch (error) {
      console.log('error confirming sign up', error);
      setCognitoErrors(error.message)

    }








    // if (Cookies.get('user.email') === undefined || Cookies.get('user.email') === '' || Cookies.get('user.email') === null){
    //   setErrors("You need to provide an email in order to send Resend Activiation Code")   
    // } else {
    //   if (Cookies.get('user.email') === email){
    //     if (Cookies.get('user.confirmation_code') === code){
    //       Cookies.set('user.logged_in',true)
    //       window.location.href = "/"
    //     } else {
    //       setErrors("Code is not valid")
    //     }
    //   } else {
    //     setErrors("Email is invalid or cannot be found.")   
    //   }
    // }
    return false
  }

  let el_errors;
  if (cognitoErrors){
    el_errors = <div className='errors'>{cognitoErrors}</div>;
  }


  let code_button;
  if (codeSent){
    code_button = <div className="sent-message">A new activation code has been sent to your email</div>
  } else {
    code_button = <button className="resend" onClick={resend_code}>Resend Activation Code</button>;
  }

  React.useEffect(()=>{
    if (params.email) {
      setEmail(params.email)
      setUsername(params.username)
    }
  }, [])

  return (
    <article className="confirm-article">
      <div className='recover-info'>
        <Logo className='logo' />
      </div>
      <div className='recover-wrapper'>
        <form
          className='confirm_form'
          onSubmit={onsubmit}
        >
          <h2>Confirm your Email</h2>
          <div className='fields'>
            <div className='field text_field email'>
              <p>Welcome {username}</p>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={email_onchange} 
              />
            </div>
            <div className='field text_field code'>
              <label>Confirmation Code</label>
              <input
                type="text"
                value={code}
                onChange={code_onchange} 
              />
            </div>
          </div>
          {el_errors}
          <div className='submit'>
            <button type='submit'>Confirm Email</button>
          </div>
        </form>
      </div>
      {code_button}
    </article>
  );
}