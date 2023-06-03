import React, {useState,useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import emailjs from '@emailjs/browser';
import Button from '@mui/material/Button';
  import {CALLAPI} from '../../libs/APIAccessAndVerification'
  import {toast } from 'react-toastify';

  import { APIStatus,APIStatuses} from '../../variables/variables';
export const PasswordRecovery=(props)=> {
    //let { isOpen, onOpen, onClose } = useDisclosure()
    let [isOpen, setisOpen] = useState(props.Open);
    const [input, setInput] = useState('')
    const form = useRef();
    const Email = useRef();
    const token = useRef();
    let EmailFoundStatus = useRef(false);
  const handleInputChange = (e) => setInput(e.target.value)

  const isError = input === ''

  const handleEmailsubmit=(props)=>
  {
    props.preventDefault()
   if(Email.current.value!='')
   {
    let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_FORGOTPWAPINAME
    let JsonString="{\"Email\": "+"\""+Email.current.value+"\"}"

  let JsonObject=JSON.parse(JSON.stringify(JsonString))
  
    let APIResult=CALLAPI(url,JsonObject)
   
    APIResult.then(result=>{
    
    EmailFoundStatus.current=false
     for( var property in result)
         {
          
           if( property==="token")
           {
            EmailFoundStatus.current=true;
           
            token.current.value=result[property]
           }
         }
          
         if(EmailFoundStatus.current===false && APIStatus.Status===APIStatuses.APICallSuccess)
         {
          
          
          toast.info('The Email you entered doesnt exist please check your email', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
         }
         else
         {
          
           if(APIStatus.Status===APIStatuses.APICallSuccess)
           {
            emailjs.sendForm('service_z9p6g6b', 'template_ypuv019', form.current, 'Th956W69Ljmfmz7sP')
            .then((result) => {
              toast.success('A link was sent to your Email successfully!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            }, (error) => {
                console.log(error.text);
            });
            
          }
                 
           }
          
         
    }).catch(error=>{
    console.log(error)
    })
   }
   else
   {
    toast.info('The email cannot be empty!"', {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
   }
   }
  
  
   
   
  
    return (
      <>
     
     <Dialog fullWidth={true} open={isOpen} onClose={()=>{setisOpen(false)
                props.passedhandleclose()}} >
        <DialogTitle> Password Recovery</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {!isError ? (
        <p>
          Please enter your account Email Address.
        </p>
      ) : (
        <strong>Email is required.</strong>
      )}
          </DialogContentText>
          <form ref={form}>
          <input ref={Email} className="form-control" type='email' name="email" defaultValue={input} onChange={handleInputChange} />
      <input ref={token}className="form-control"  type='text' name="token"  hidden={true} />
      <input  type='text'  className="form-control" name="BackLink" defaultValue={process.env.REACT_APP_FRONTENDURL+"/ChangePassword"}  hidden={true} />
      </form>
      
      
       </DialogContent>


        <DialogActions>
        <Button variant="outlined"color="primary" mr={3} onClick={()=>{
                setisOpen(false)
                props.passedhandleclose()
            }}>Close
              </Button>
              <Button variant="outlined"color="primary" mr={3} type="submit" onClick={handleEmailsubmit}> Send to recovery Email
              </Button>
        </DialogActions>
      </Dialog>
      </>
    )
  }