import './Sign_up.css';

import React, { useState, useRef } from 'react';
import LoadingSpinner from '../../components/UI/SpinnerComps/LoadingSpinner';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { useTheme } from '@mui/material/styles';
import logo from '../../Assets/SocialPost-Logo.png';
import { CALLAPI } from '../../libs/APIAccessAndVerification';
import { toast } from 'react-toastify';
import { APIStatus, APIStatuses } from '../../variables/variables';
import MainCard from '../../components/UI/cards/MainCard';

function App() {
  const theme = useTheme();
  let [LoadingSpinnerStatus, setLoadingSpinnerStatus] = useState(false);
  let UserExistStatus = useRef(false); //Flag indicated if the User exist or not
  let GroupExistStatus = useRef(false); //flag indicate if the default group name exist or not
  let EmailExistStatus = useRef(false); //flag indicated if the Email used or not
  let PhoneNumberExistStatus = useRef(false); //flag indicated if the PhoneNumber used or not

  const handlesubmit = (props) => {
    props.preventDefault();
    //turning on the spinner till the API call is finished
    setLoadingSpinnerStatus(true);
    UserExistStatus.current = false;
    //Converting Form Data to a Json object
    let JsonObject;
    let ConfirmPassword = '';
    let Password = '';
    let JsonString = '{';
    for (let i = 0; i < 9; i++) {
      if (i === 8) {
        ConfirmPassword = props.target[i].value;
        JsonString += '}';
      }

      if (i === 7) {
        JsonString +=
          '"' +
          props.target[i].name +
          '": ' +
          '"' +
          props.target[i].value +
          '"';
        Password = props.target[i].value;
      } else if (i !== 8) {
        JsonString +=
          '"' +
          props.target[i].name +
          '": ' +
          '"' +
          props.target[i].value +
          '",';
      }
    }

    JsonObject = JSON.parse(JSON.stringify(JsonString));
    //Sending a POST HTTP To the API with the Json Object
    let url =
      process.env.REACT_APP_BACKENDURL + process.env.REACT_APP_REGISTERAPINAME;
    if (ConfirmPassword === Password) {
      if (Password.length > 5) {
        let APIResult = CALLAPI(url, JsonObject);

        APIResult.then((result) => {
          if (APIStatus.Status === APIStatuses.APICallSuccess) {
            for (var property in result) {
              if (property === 'UsernameExist' && result[property] === 'true') {
                UserExistStatus.current = true;
                toast.info(
                  'The Username you used exist, please pick an other Username',
                  {
                    position: 'bottom-left',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  }
                );
                setLoadingSpinnerStatus(false);
              } else {
                UserExistStatus.current = false;
              }

              if (
                property === 'GroupNameExist' &&
                result[property] === 'true'
              ) {
                GroupExistStatus.current = true;

                toast.info(
                  'The Campaign Name you re trying to use already exist, please pick an other one!',
                  {
                    position: 'bottom-left',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  }
                );
                setLoadingSpinnerStatus(false);
              } else {
                GroupExistStatus.current = false;
              }

              if (
                property === 'PhoneNumberUsed' &&
                result[property] === 'true'
              ) {
                PhoneNumberExistStatus.current = true;
                toast.info(
                  'The Phone Number you typed already used in an other account.',
                  {
                    position: 'bottom-left',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  }
                );
                setLoadingSpinnerStatus(false);
              } else {
                PhoneNumberExistStatus.current = false;
              }

              if (property === 'EmailUsed' && result[property] === 'true') {
                EmailExistStatus.current = true;
                toast.info('The Email is already used in an other account!', {
                  position: 'bottom-left',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'light',
                });
                setLoadingSpinnerStatus(false);
              } else {
                EmailExistStatus.current = false;
              }
            }

            if (
              UserExistStatus.current === false &&
              GroupExistStatus.current === false &&
              APIStatus.Status === APIStatuses.APICallSuccess &&
              EmailExistStatus.current === false &&
              PhoneNumberExistStatus.current === false
            ) {
              toast.success('You registered successfully!', {
                position: 'bottom-left',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              });
              setLoadingSpinnerStatus(false);
              window.location.replace('/login');
            }
          }
        }).catch((error) => {
          console.log(error);
        });
      } else {
        setLoadingSpinnerStatus(false);
        toast.info('The Password should contain at least six character', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setLoadingSpinnerStatus(false);
      }
    } else {
      setLoadingSpinnerStatus(false);
      toast.info('Your confirm password doesnt match your password', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setLoadingSpinnerStatus(false);
    }
  };

  return (
    <MDBContainer
      fluid
      className=" background-radial-gradient overflow-hidden"
      style={{
        backgroundImage: `url("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp")`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <MDBRow>
        <MDBCol
          md="5"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <div className="container-sm">
            <img src={logo} className="img-fluid" alt="Sample image" />
          </div>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            className="position-absolute shadow-5-strong"
          ></div>

          <MainCard
            className="my-5 bg-glass"
            style={{
              borderColor: theme.palette.divider,
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
              ':hover': {
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <MDBCardBody className="p-5">
              <form onSubmit={handlesubmit}>
                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="First name"
                      id="form1"
                      type="text"
                      name="FirstName"
                      required={true}
                    />
                  </MDBCol>

                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Last name"
                      id="form2"
                      type="text"
                      name="LastName"
                      required={true}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Username"
                  id="form3"
                  type="text"
                  name="UserName"
                  required={true}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  id="form4"
                  type="email"
                  name="Email"
                  required={true}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Birthday Date"
                  id="form5"
                  type="date"
                  name="BirthdayDate"
                  required={true}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Campaign Name"
                  id="form6"
                  name="CampaignName"
                  type="text"
                  required={true}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Phone Number"
                  id="form7"
                  name="PhoneNumber"
                  type="number"
                  required={true}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="form8"
                  name="Password"
                  type="password"
                  required={true}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Confirm Password"
                  id="form9"
                  name="CPassword"
                  type="password"
                  required={true}
                />
                <div className="d-flex justify-content-center mb-4">
                  {/*<MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' />*/}
                  <p className="small fw-bold mt-2 pt-1">
                    You Already have an account?{' '}
                    <a href="/Login" style={{ color: '#3b71ca' }}>
                      Sign In
                    </a>
                  </p>
                </div>

                <MDBBtn className="w-100 mb-4" size="md" type="submit">
                  sign up
                </MDBBtn>
                <div className="d-flex justify-content-center ">
                  {LoadingSpinnerStatus && <LoadingSpinner />}
                </div>
              </form>

              {/*
            <div className="text-center">

                <p>Or sign up with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn>

               

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                

              </div>
             */}
            </MDBCardBody>
          </MainCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
