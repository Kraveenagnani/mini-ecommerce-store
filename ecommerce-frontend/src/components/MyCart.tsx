import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Button, Box, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';
import { useState } from 'react';
interface CartProps {
  onBack: () => void;
 onLogin: () => void;
}

export const MyCart: React.FC<CartProps> = ({ onBack, onLogin }) => {
  const dispatch = useDispatch();
  const [orderMessage, setOrderMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <Container sx={{ py: 4 }}>
<Button
  variant="outlined"
  onClick={onBack}
  sx={{
    mb: 3,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 'bold',
    px: 3,
  }}
>
  Back to Products
</Button>

<Typography
  variant="h4"
  gutterBottom
  sx={{
    fontWeight: 800,
    mb: 3,
  }}
>
  Your Cart
</Typography>
      {items.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          Your cart is empty!
        </Typography>
      ) : (
        <Box
  sx={{
    mt: 2,
    borderRadius: 3,
    backgroundColor: '#fff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  }}
>
          <List>
            {items.map((item) => (
              <Box key={item.product.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      
                      <Typography sx={{ fontWeight: 'bold', px: 1 }}>{item.quantity}</Typography>
                      
                      <IconButton 
                        size="small"
                        onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity + 1 }))}
                      >
                        <AddIcon />
                      </IconButton>

                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        color="error"
                        onClick={() => dispatch(removeFromCart(item.product.id))}
                        sx={{ ml: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={item.product.imageUrl} alt={item.product.name} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Price: ₹${item.product.price} | Total: ₹${item.product.price * item.quantity}`}
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>

          <Box
  sx={{
    mt: 4,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
    borderRadius: 3,
    backgroundColor: '#fff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  }}
>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Total Price: ₹{totalPrice}
            </Typography>
            <Button
  variant="contained"
  color="success"
  size="large"
  fullWidth
  sx={{ maxWidth: 300 }}
  onClick={async () => {
if (!user) {
  onLogin();
  return;
}
    try {
      const response = await fetch('https://mini-ecommerce-store-9epp.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
user,
          items,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderMessage(`Order placed successfully! Order ID: ${data.orderId}`);
    } catch (error) {
      setOrderMessage('Failed to place order');
    }
  }}
>
  Checkout (Mock Payment)
</Button>
{orderMessage && (
  <Typography color="success.main">
    {orderMessage}
  </Typography>
)}
          </Box>
        </Box>
      )}
    </Container>
  );
};
