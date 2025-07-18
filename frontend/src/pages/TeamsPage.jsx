import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Stack, MenuItem } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const fetchTeams = async () => {
    const res = await axios.get('http://localhost:4000/api/teams');
    setTeams(res.data);
  };
  const fetchDepts = async () => {
    const res = await axios.get('http://localhost:4000/api/departments');
    setDepartments(res.data);
  };

  useEffect(() => { fetchTeams(); fetchDepts(); }, []);

  const handleOpen = (team = null) => {
    setEditTeam(team);
    setName(team ? team.name : '');
    setDepartmentId(team ? team.departmentId : '');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditTeam(null); setName(''); setDepartmentId(''); };

  const handleSave = async () => {
    if (editTeam) {
      await axios.put(`http://localhost:4000/api/teams/${editTeam.id}`, { name });
    } else {
      await axios.post('http://localhost:4000/api/teams', { name, departmentId: Number(departmentId) });
    }
    handleClose();
    fetchTeams();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/teams/${id}`);
    fetchTeams();
  };

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Teams</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add</Button>
      </Stack>
      <List>
        {teams.map(team => (
          <ListItem key={team.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(team)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(team.id)}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={team.name} secondary={departments.find(d => d.id === team.departmentId)?.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editTeam ? 'Edit Team' : 'Add Team'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
          {!editTeam && (
            <TextField select margin="dense" label="Department" fullWidth value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
              {departments.map(dept => <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>)}
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