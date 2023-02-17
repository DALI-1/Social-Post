import React, { Component,useState,useRef } from 'react';
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
  import {Helmet} from "react-helmet";
  import { useToast } from '@chakra-ui/react'
export const PasswordRecovery=(props)=> {
    //let { isOpen, onOpen, onClose } = useDisclosure()
    let [isOpen, setisOpen] = useState(props.Open);
    let [onClose, setonClose] = useState(props.Close);
    let [onOpen, setonOpen] = useState(props.Close);
    const [input, setInput] = useState('')
    const form = useRef();
    const Email = useRef();
    const token = useRef();
    let EmailFoundStatus = useRef(false);
  const handleInputChange = (e) => setInput(e.target.value)

  const isError = input === ''
    
  let APIError = useRef(false);

  const toast = useToast()

  
  //This is an Async method which will call our API, url is the API path, data is the json data, the format should follow our User.DTO in the backend.
  const CALLAPI = async (url,data)=>
  {
    
    try {
      const response = await fetch(url,{
        method: "POST",
        
        headers: { 
          "Content-Type": "application/json"  
        },
        body: data
      });
      
      const json = await response.json();  
      APIError.current=false;
      return(json)
    } catch (error) {
      console.log(" DEVELOPER ONLY : ERROR", error);

      toast({
        title: 'Connection Error!',
        description: "There is an Error with our server, please retry again",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      APIError.current=true;
      return(error);
    }
  }
  const handleEmailsubmit=(props)=>
  {
    props.preventDefault()
  
    
    
   
    let url=process.env.REACT_APP_BACKENDURL+process.env.REACT_APP_FORGOTPWAPINAME
    let JsonString="{\"Email\": "+"\""+Email.current.value+"\"}"

  let JsonObject=JSON.parse(JSON.stringify(JsonString))
  
    let APIResult=CALLAPI(url,JsonObject)
   
    APIResult.then(result=>{
    EmailFoundStatus.current=false
     for( var property in result)
         {
          
           if( property=="token")
           {
            EmailFoundStatus.current=true;
            token.current.value=result[property]
           }
         
          
         
         }
         
         if(EmailFoundStatus.current==false && APIError==false)
         {
          toast({
                  
            title: 'Password Recovery',
            description: "The Email you entered doesn't exist please check your email",
            status: 'info',
            duration: 3000,
            isClosable: true,
          })
         }
         else
         {
           if(APIError==false)
           {
            emailjs.sendForm('service_z9p6g6b', 'template_ypuv019', form.current, 'Th956W69Ljmfmz7sP')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
                 
        
                  toast({
                          
                    title: 'Password Recovery',
                    description: "A link was sent to your Email successfully!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                 }
           }
          
         
    }).catch(error=>{
    console.log(error)
    })

 

   
   
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

      
      <Input ref={Email} type='email' name="email" value={input} onChange={handleInputChange} />
      <Input ref={token} type='text' name="token"  hidden={true} />
      <Input  type='text' name="BackLink" value={process.env.REACT_APP_FRONTENDURL+"/ChangePassword"}  hidden={true} />
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