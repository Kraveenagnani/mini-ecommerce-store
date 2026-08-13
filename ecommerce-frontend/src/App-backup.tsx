import { useState } from 'react';
import { AppBar, Toolbar, Typography, Badge, IconButton, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';
import ProductList from './components/ProductList';
import { MyCart } from './components/MyCart';
import { AdminOrders } from './components/AdminOrders'; // அட்மின் பக்கம் இம்போர்ட் செய்யப்பட்டுள்ளது
import Register from './components/Register';
import Login from './components/Login';
import ProductDetails from './components/ProductDetails';
function App() {
  // பக்கங்களை மாற்றுவதற்கான ஸ்டேட் ('products', 'cart', 'admin')
  const [view, setView] = useState<'products' | 'cart' | 'admin' | 'register' | 'login' | 'details'>('products');
const [user, setUser] = useState(() => {
  return JSON.parse(localStorage.getItem('user') || 'null');
});
const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* மேல் பகுதி நேவிகேஷன் பார் (Navbar) */}
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => setView('products')}
          >
            Mini E-Commerce Store
          </Typography>
<Button
  color="inherit"
  onClick={() => setView('login')}
  sx={{ mr: 2, fontWeight: 'bold' }}
>
  Login
</Button>
{user && (
  <Button
    color="inherit"
    onClick={() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
setUser(null);   
   setView('products');
    }}
    sx={{ mr: 2, fontWeight: 'bold' }}
  >
    Logout
  </Button>
)}
          {/* அட்மின் பக்கத்திற்குச் செல்ல புதிய பொத்தான் (Admin Button) */}
          <Button
  color="inherit"
  onClick={() => setView('register')}
  sx={{ mr: 2, fontWeight: 'bold' }}
>
  Register
</Button>
{user?.role === 'admin' && (
  <Button
    color="inherit"
    onClick={() => setView('admin')}
    sx={{ mr: 2, fontWeight: 'bold' }}
  >
    Admin Panel
  </Button>
)}
          
          {/* கார்ட் ஐகான் */}
          <IconButton size="large" aria-label="cart" color="inherit" onClick={() => setView('cart')}>
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* எந்தப் பக்கம் தெரிய வேண்டும் என்ற கண்டிஷன் செக் */}
      {view === 'admin' ? (
  <AdminOrders onBack={() => setView('products')} />
) : view === 'details' && selectedProduct ? (
  <ProductDetails
    product={selectedProduct}
    onBack={() => setView('products')}
  />
): view === 'cart' ? (
  <MyCart
onBack={() => setView('products')}
onLogin={() => setView('login')}
/>
) : view === 'register' ? (
  <Register onBack={() => setView('products')} />
) : view === 'login' ? (
  <Login onBack={() => setView('products')}
  onLogin={(loggedInUser) => setUser(loggedInUser)}
   />
) : (
  <ProductList
  onProductClick={(product) => {
    setSelectedProduct(product);
    setView('details');
  }}
/>
)}
    </Box>
  );
}

export default App;
