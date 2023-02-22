import React from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';
import { Spinner } from '@chakra-ui/react'
export default function App() {
  return (
    <Spinner
  thickness='4px'
  speed='0.65s'
  emptyColor='gray.200'
  color='blue.500'
  size='xl'
/>
  );
}