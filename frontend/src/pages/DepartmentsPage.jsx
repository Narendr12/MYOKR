import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Stack, MenuItem } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [open, setOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [name, setName] = useState('');
  const [organisationId, setOrganisationId] = useState('');

  const fetchDepts = async () => {
    const res = await axios.get('http://localhost:4000/api/departments');
    setDepartments(res.data);
  };
  const fetchOrgs = async () => {
    const res = await axios.get('http://localhost:4000/api/organisations');
    setOrganisations(res.data);
  };

  useEffect(() => { fetchDepts(); fetchOrgs(); }, []);

  const handleOpen = (dept = null) => {
    setEditDept(dept);
    setName(dept ? dept.name : '');
    setOrganisationId(dept ? dept.organisationId : '');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditDept(null); setName(''); setOrganisationId(''); };

  const handleSave = async () => {
    if (editDept) {
      await axios.put(`http://localhost:4000/api/departments/${editDept.id}`, { name });
    } else {
      await axios.post('http://localhost:4000/api/departments', { name, organisationId: Number(organisationId) });
    }
    handleClose();
    fetchDepts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/departments/${id}`);
    fetchDepts();
  };

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Departments</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add</Button>
      </Stack>
      <List>
        {departments.map(dept => (
          <ListItem key={dept.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(dept)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(dept.id)}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={dept.name} secondary={organisations.find(o => o.id === dept.organisationId)?.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
          {!editDept && (
            <TextField select margin="dense" label="Organisation" fullWidth value={organisationId} onChange={e => setOrganisationId(e.target.value)}>
              {organisations.map(org => <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>)}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 