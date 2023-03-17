import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import SelectPageModal from "../FacebookComps/SelectPageModal";
import {AppContext} from "../../context/Context"

const LoginPage = (props) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [picture, setPicture] = useState('');
  const [pages, setPages] = useState([]);

  const responseFacebook = (response) => {
    console.log(response);
    setUserID(response.userID);
    setName(response.name);
    setEmail(response.email);
    setAccessToken(response.accessToken);
    setPicture(response.picture.data.url);
 
  };

  const onFailure = () => {

    props.SetAddPageFlag(false)
    console.log("Failed to connect to Facebook");
  };


  return (
    <div>
        <FacebookLogin        
            appId="948984963212598"
            version="16.0"
            autoLoad={true}
            fields="name,email,picture"
            scope="public_profile,pages_show_list,pages_read_user_content,manage_pages"
            callback={responseFacebook} 
            onFailure={onFailure}
            cssClass="facebook-button-hidden"
            />

     <style>
        {`
          .facebook-button-hidden {
            opacity: 0;
          }

          .facebook-button-visible {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
