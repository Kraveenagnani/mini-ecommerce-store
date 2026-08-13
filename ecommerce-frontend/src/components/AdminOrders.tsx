import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination, TextField, Button, Box, Select, MenuItem 
} from '@mui/material';


interface AdminOrdersProps {
  onBack: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ onBack }) => {
  // தேடல் (Search) மற்றும் பக்கமாக்கல் (Pagination) ஸ்டேட்ஸ்
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

const [orders, setOrders] = useState<any[]>([]);
const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

useEffect(() => {
  fetch('http://localhost:5001/orders')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    })
    .then((data) => {
      setOrders(data);
    })
    .catch((error) => {
      console.error('Failed to fetch orders:', error);
    });
}, []);
  // தேடல் வார்த்தைக்கு ஏற்ப ஆர்டர்களை வடிகட்டுதல் (Filter Search)
  const filteredOrders = orders.filter((order) =>
  order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  order.items.some((item: any) =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`http://localhost:5001/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
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
        Admin Panel - வாடிக்கையாளர் ஆர்டர்கள்
      </Typography>

      {/* தனித் தேடல் பெட்டி (Separate Search Bar) */}
      <TextField
        fullWidth
        label="ஆர்டர் ஐடி அல்லது பயனர் பெயர் மூலம் தேடுக..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
  mb: 3,
  bgcolor: 'white',
  borderRadius: 2,
}}
      />

      {/* மெட்டீரியல் டேபிள் (Material Table) */}
     <TableContainer
  component={Paper}
  sx={{
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    overflow: 'hidden',
  }}
>
        <Table aria-label="admin orders table">
          <TableHead sx={{ bgcolor: '#6a1b9a' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ஆர்டர் ஐடி (Order ID)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>வாடிக்கையாளர் (User)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>தேதி (Date)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>மொத்த தொகை (Total)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>நிலை (Status)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow
  key={order._id}
  hover
  onClick={() => setSelectedOrder(order)}
  sx={{ cursor: 'pointer' }}
>
                 <TableCell sx={{ fontWeight: 'medium' }}>{order._id}</TableCell>
                  <TableCell>
  {order.items.map((item: any) => item.product.name).join(', ')}
</TableCell>
                  <TableCell>
  {new Date(order.createdAt).toLocaleDateString()}
</TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    <Select
    size="small"
    value={order.status}
    onChange={(e) =>
      updateOrderStatus(order._id, e.target.value)
    }
  >
    <MenuItem value="Pending">Pending</MenuItem>
    <MenuItem value="Processing">Processing</MenuItem>
    <MenuItem value="Shipped">Shipped</MenuItem>
    <MenuItem value="Delivered">Delivered</MenuItem>
  </Select>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
        {selectedOrder && (
   <Box
  sx={{
    mt: 4,
    p: { xs: 3, md: 4 },
    bgcolor: 'white',
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
    border: '1px solid #eeeeee',
  }}
>
      <Typography
  variant="h5"
  sx={{
    fontWeight: 800,
    mb: 3,
  }}
>
        Order Details
      </Typography>

      <Typography sx={{ mt: 1 }}>
  <strong>Status:</strong>{' '}
  <Box
    component="span"
    sx={{
      fontWeight: 'bold',
      ml: 1,
    }}
  >
    {selectedOrder.status}
  </Box>
</Typography>
      <Typography>
        <strong>Order Date:</strong>{' '}
        {new Date(selectedOrder.createdAt).toLocaleString()}
      </Typography>

      <Typography>
        <strong>Status:</strong> {selectedOrder.status}
      </Typography>

      <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
        Products:
      </Typography>

      {selectedOrder.items.map((item: any, index: number) => (
        <Box key={index} sx={{ ml: 2, mt: 1 }}>
          <Typography>
            {item.product.name} — Quantity: {item.quantity} — Price: ₹{item.product.price}
          </Typography>
        </Box>
      ))}

      <Typography
  sx={{
    mt: 3,
    pt: 2,
    borderTop: '1px solid #eeeeee',
    fontWeight: 800,
    fontSize: '1.2rem',
  }}
>
  Total: ₹{selectedOrder.totalPrice}
</Typography>
    </Box>
  )}

      {/* பக்கமாக்கல் வசதி (Pagination) */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default AdminOrders;
