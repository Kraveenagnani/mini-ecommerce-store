import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  description?: string;
  stock?: number;
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      })
    );
  };

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
        ← Back to Products
      </Button>

      <Card
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    overflow: 'hidden',
    borderRadius: 4,
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  }}
>
        <Box
          component="img"
          src={product.imageUrl}
          alt={product.name}
          sx={{
  width: { xs: '100%', md: '50%' },
  height: { xs: 300, md: 500 },
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
}}
        />

        <CardContent
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            {product.name}
          </Typography>

          <Typography
            variant="h5"
            color="primary"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            ₹{product.price}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Category:</strong>{' '}
            {product.category || 'Not specified'}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            <strong>Stock:</strong>{' '}
            {product.stock ?? 0}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            Description
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.7 }}
          >
            {product.description ||
              'No description available for this product.'}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
  sx={{
    mt: 2,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 'bold',
    textTransform: 'none',
  }}
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock <= 0}
          >
            {product.stock && product.stock > 0
              ? 'Add to Cart'
              : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetails;
