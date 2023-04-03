import React, {useState,useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'
  import emailjs from '@emailjs/browser';
  
  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,Input
  } from '@chakra-ui/react'
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
     
        <Modal isOpen={isOpen} onClose={()=>{setisOpen(false)
                props.passedhandleclose()}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Password Recovery</ModalHeader>
            <ModalCloseButton />
            

            
            <ModalBody>
            <FormControl isInvalid={isError}>
      <FormLabel>Email</FormLabel>
      <form ref={form}>

      
      <Input ref={Email} type='email' name="email" defaultValue={input} onChange={handleInputChange} />
      <Input ref={token} type='text' name="token"  hidden={true} />
      <Input  type='text' name="BackLink" defaultValue={process.env.REACT_APP_FRONTENDURL+"/ChangePassword"}  hidden={true} />
      </form>
      {!isError ? (
        <FormHelperText>
          Enter the email you'd like to receive the recovery mail on
        </FormHelperText>
      ) : (
        <FormErrorMessage>Email is required.</FormErrorMessage>
      )}
    </FormControl>
              
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={()=>{
                setisOpen(false)
                props.passedhandleclose()
            }}>Close
              </Button>
              <Button colorScheme='blue' mr={3} type="submit" onClick={handleEmailsubmit}> Send to recovery Email
              </Button>
            </ModalFooter>
            
          </ModalContent>
        </Modal>
      </>
    )
  }