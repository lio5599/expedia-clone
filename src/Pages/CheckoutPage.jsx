import React, { useEffect } from 'react'
import { Box, Button, HStack, Heading, Icon, Image, Input, SimpleGrid, Text, Flex, useToast } from '@chakra-ui/react'


import {TbBed} from 'react-icons/tb'
import {BsCheck} from 'react-icons/bs'
import {IoIosMan} from 'react-icons/io'
import {AiOutlineWifi} from 'react-icons/ai'

import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCart } from '../Redux/Cart/action';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { data = [], loading } = useSelector((state) => state.CartReducer || {});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = (data || []).reduce((s, it) => s + (Number(it.price) || 0), 0);

  const handleComplete = async () => {
    try {
      await dispatch(clearCart());
      await dispatch(fetchCart());
      toast({ title: 'checkout successful', status: 'success', duration: 3000, isClosable: true });
      navigate('/');
    } catch (err) {
      toast({ title: 'Checkout failed', description: err.message || 'Unable to complete checkout', status: 'error', duration: 4000, isClosable: true });
    }
  };

  return (
    <Box bg={'gray.300'} width={'100%'} minHeight={'600px'} py={8}>
      <Box width={'85%'} margin={'auto'}>
        <Heading fontSize={'26px'} fontWeight={'bold'} textAlign={'left'}>Review and Book</Heading>

        <SimpleGrid mt={4} gridTemplateColumns={'63% 35%'} gap={'1%'}>
          <Box bg={'white'} p={4}>
            <Heading fontSize={'20px'}>Guest Details</Heading>
            <Text mt={3} mb={2}>Fill in guest and payment details below (mock)</Text>
            <Box>
              <Box textAlign={'left'} my={2}>
                <label>First Name : <Input type='text' placeholder='First Name' border='1px solid gray' /></label>
              </Box>
              <Box textAlign={'left'} my={2}>
                <label>Surname Name : <Input type='text' placeholder='Surname' border='1px solid gray' /></label>
              </Box>
              <Box textAlign={'left'} my={2}>
                <label>Mobile No : <Input type='text' placeholder='Mobile No' border='1px solid gray' /></label>
              </Box>
            </Box>
          </Box>

          <Box bg={'white'} p={4}>
            <Heading fontSize={'16px'} mb={3}>Order Summary</Heading>
            {loading && <Text>Loading...</Text>}
            {(data || []).length === 0 && !loading && <Text>No items in cart</Text>}
            <Box>
              {(data || []).map((item) => (
                <Flex key={item.id} justify={'space-between'} align={'center'} mb={3}>
                  <Box>
                    <Text fontWeight={600}>{item.name || item.title || item.airline}</Text>
                    <Text fontSize={'sm'}>Price: Rs {item.price}</Text>
                  </Box>
                  {item.image && <Image src={item.image} boxSize='60px' objectFit='cover' />}
                </Flex>
              ))}
            </Box>
            <Box mt={4}>
              <Flex justify={'space-between'} fontWeight={'bold'}>
                <Box>Total</Box>
                <Box>Rs {total}</Box>
              </Flex>
              <Button mt={4} width={'100%'} colorScheme='orange' onClick={handleComplete}>Complete Booking</Button>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default CheckoutPage
