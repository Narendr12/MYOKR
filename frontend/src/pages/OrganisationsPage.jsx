import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Stack } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function OrganisationsPage() {
  const [organisations, setOrganisations] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOrg, setEditOrg] = useState(null);
  const [name, setName] = useState('');

  const fetchOrgs = async () => {
    const res = await axios.get('http://localhost:4000/api/organisations');
    setOrganisations(res.data);
  };

  useEffect(() => { fetchOrgs(); }, []);

  const handleOpen = (org = null) => {
    setEditOrg(org);
    setName(org ? org.name : '');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditOrg(null); setName(''); };

  const handleSave = async () => {
    if (editOrg) {
      await axios.put(`http://localhost:4000/api/organisations/${editOrg.id}`, { name });
    } else {
      await axios.post('http://localhost:4000/api/organisations', { name });
    }
    handleClose();
    fetchOrgs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/organisations/${id}`);
    fetchOrgs();
  };

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Organisations</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add</Button>
      </Stack>
      <List>
        {organisations.map(org => (
          <ListItem key={org.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(org)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(org.id)}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={org.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editOrg ? 'Edit Organisation' : 'Add Organisation'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 