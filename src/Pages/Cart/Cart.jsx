import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, clearCart } from '../../Redux/Cart/action';
import { Box, Button, Image, Text, Flex, useToast } from '@chakra-ui/react';

export default function Cart() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.CartReducer);
  const toast = useToast();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    try {
      await dispatch(clearCart());
      await dispatch(fetchCart());
      toast({ title: 'checkout successful', status: 'success', duration: 3000, isClosable: true });
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
      {(data || []).length > 0 && (
        <Box mt={6}>
          <Text fontWeight={600}>Total: Rs {total}</Text>
          <Button colorScheme='teal' mt={3} onClick={handleCheckout}>Checkout</Button>
        </Box>
      )}
    </Box>
  );
}
