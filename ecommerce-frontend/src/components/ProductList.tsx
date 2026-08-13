import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Container,
  TextField,
  Alert,
   Box,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
imageUrl: string;
}

export const ProductList: React.FC<{
  onProductClick: (product: any) => void;
}> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://localhost:5001/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError('Unable to load products');
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        எங்கள் தயாரிப்புகள் (Products)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Search Products"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
onClick={() => onProductClick(product)}
              sx={{
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: 3,
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
  },
}}
            >
              <CardContent>
                <Box
  component="img"
  src={product.imageUrl}
  alt={product.name}
  sx={{
    width: '100%',
    height: 240,
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  }}
/>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  noWrap
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  ₹{product.price}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Category: {product.category}
                </Typography>

                <Typography variant="body2">
                  Stock: {product.stock}
                </Typography>
              </CardContent>

              <CardActions sx={{ pb: 2, px: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    dispatch(
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                      })
                    )
                  }
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
