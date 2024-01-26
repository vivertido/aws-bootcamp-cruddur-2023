import './ConfirmationPage.css';
import React from "react";
import { useParams, useSearchParams } from 'react-router-dom';

import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { confirmSignUp, 
        resendSignUpCode, 
        ResendSignUpCodeInput, 
        ResendSignUpCodeOutput  } from 'aws-amplify/auth';


// [TODO] Authenication
//import Cookies from 'js-cookie'



export default function ConfirmationPage() {
  const [email, setEmail] = React.useState('');
  const [confirmationCode, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [cognitoErrors, setCognitoErrors] = React.useState('');
   
  const [codeSent, setCodeSent] = React.useState(false);
  const [searchParams] = useSearchParams();

  // Extract username from query string:
  const username = searchParams.get('username');

  const params = useParams();

  const code_onchange = (event) => {
    setCode(event.target.value);
    console.log(confirmationCode);
  }
  const email_onchange = (event) => {
    setEmail(event.target.value);
  }

  const resend_code = async (event) => {
    console.log('resend_code')
    setCognitoErrors('')
    // [TODO] Authenication
    try {
      const res = await resendSignUpCode({ username });
      console.log('Code resent successfully:', res);
    } catch (error) {
      console.error('Error resending code:', error);
      // Handle the error appropriately
    }

  

  }

  const onsubmit = async (event) => {
    event.preventDefault();
    console.log('ConfirmationPage.onsubmit')
    setCognitoErrors('')
    // [TODO] Authenication
    console.log("The confirmation code is: " + confirmationCode);
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode,
      });
      window.location.href = "/"
    } catch (error) {
      console.log('error confirming sign up', error);
      setCognitoErrors(error.message)

    }

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
                value={confirmationCode}
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