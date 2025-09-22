import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, clearCart } from '../../Redux/Cart/action';
import { Box, Button, Image, Text, Flex, useToast } from '@chakra-ui/react';

export default function Cart() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.CartReducer);
  const toast = useToast();
  const [customerName, setCustomerName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // load saved payment details (if any)
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('cart_customerName') || '';
      const savedCard = localStorage.getItem('cart_cardNumber') || '';
      setCustomerName(savedName);
      setCardNumber(savedCard);
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  // persist payment details when changed
  useEffect(() => {
    try {
      localStorage.setItem('cart_customerName', customerName || '');
    } catch (e) {}
  }, [customerName]);

  useEffect(() => {
    try {
      localStorage.setItem('cart_cardNumber', cardNumber || '');
    } catch (e) {}
  }, [cardNumber]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    try {
      await dispatch(clearCart());
      await dispatch(fetchCart());
      toast({ title: 'Your purchase has been made!', status: 'success', duration: 3000, isClosable: true });
      setCustomerName('');
      setCardNumber('');
    } catch (err) {
      toast({ title: 'Checkout failed', description: err.message || 'Error clearing cart', status: 'error', duration: 4000, isClosable: true });
    }
  };

  const total = (data || []).reduce((s, item) => s + (Number(item.price) || 0), 0);

  return (
    <Box p={6} mt={'60px'}>
      <Text fontSize={'2xl'} fontWeight={600} mb={4}>Your Cart</Text>
      {loading && <Text>Loading...</Text>}
      {(data || []).length === 0 && !loading && <Text>Your cart is empty</Text>}
      <Box>
        {(data || []).map((item) => (
          <Flex key={item.id} p={3} borderWidth={1} borderRadius={8} mb={3} align={'center'}>
            {item.image && <Image src={item.image} boxSize='80px' objectFit='cover' mr={4} />}
            <Box flex={1}>
              <Text fontWeight={600}>{item.name || item.title || item.airline}</Text>
              <Text>Price: Rs {item.price}</Text>
            </Box>
            <Button colorScheme='red' onClick={() => handleRemove(item.id)}>Remove</Button>
          </Flex>
        ))}
      </Box>
      <Box mt={6}>
        <Text fontWeight={600}>Total: Rs {total}</Text>
        <Box mt={4}>
          <Text mb={2}>Name</Text>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder='Full name' style={{padding:8, width:'100%', marginBottom:8, borderRadius:4, border:'1px solid #ddd'}} />
          <Text mb={2}>Credit card number</Text>
          <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder='1234 5678 9012 3456' style={{padding:8, width:'100%', marginBottom:8, borderRadius:4, border:'1px solid #ddd'}} />
          <Button colorScheme='teal' mt={3} onClick={handleCheckout} isDisabled={(data || []).length === 0}>Checkout</Button>
        </Box>
      </Box>
    </Box>
  );
}
