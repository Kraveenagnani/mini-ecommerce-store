import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from '@mui/material';

interface RegisterProps {
  onBack: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      const response = await fetch('http://mini-ecommerce-store-9epp.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setMessage('Registration successful! 🎉');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper
  sx={{
    p: { xs: 3, sm: 5 },
    borderRadius: 4,
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  }}
>
        <Typography
          variant="h4"
          align="center"
          sx={{
  mb: 4,
  fontWeight: 800,
}}
        >
          Create Account
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
  py: 1.5,
  borderRadius: 2,
  fontWeight: 'bold',
  textTransform: 'none',
}}
          >
            Register
          </Button>

          <Button
  fullWidth
  variant="outlined"
  onClick={onBack}
  sx={{
    mt: 2,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 'bold',
    textTransform: 'none',
  }}
>
            Back to Products
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
