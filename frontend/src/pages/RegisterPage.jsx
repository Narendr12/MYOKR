import { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box mt={8} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField margin="normal" required fullWidth label="Name" value={name} onChange={e => setName(e.target.value)} />
        <TextField margin="normal" required fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <TextField margin="normal" required fullWidth select label="Role" value={role} onChange={e => setRole(e.target.value)}>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="member">Member</MenuItem>
        </TextField>
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Register</Button>
        <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>Back to Login</Button>
      </Box>
    </Box>
  );
} 