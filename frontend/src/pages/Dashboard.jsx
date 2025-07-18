import { Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <Box mt={8} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>MyOKR Dashboard</Typography>
      <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => navigate('/organisations')}>Organisations</Button>
        <Button variant="contained" onClick={() => navigate('/departments')}>Departments</Button>
        <Button variant="contained" onClick={() => navigate('/teams')}>Teams</Button>
        <Button variant="contained" onClick={() => navigate('/users')}>Users</Button>
        <Button variant="contained" onClick={() => navigate('/okrs')}>OKRs</Button>
        <Button variant="contained" onClick={() => navigate('/keyresults')}>Key Results</Button>
      </Stack>
      <Button color="secondary" sx={{ mt: 4 }} onClick={handleLogout}>Logout</Button>
    </Box>
  );
} 