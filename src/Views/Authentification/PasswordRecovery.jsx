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
    emailjs.sendForm('service_z9p6g6b', 'template_ypuv019', form.current, 'Th956W69Ljmfmz7sP')
    .then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
   
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

      
      <Input type='email' name="email" value={input} onChange={handleInputChange} />
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