import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Stack, MenuItem } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [teamId, setTeamId] = useState('');

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:4000/api/users');
    setUsers(res.data);
  };
  const fetchTeams = async () => {
    const res = await axios.get('http://localhost:4000/api/teams');
    setTeams(res.data);
  };

  useEffect(() => { fetchUsers(); fetchTeams(); }, []);

  const handleOpen = (user = null) => {
    setEditUser(user);
    setName(user ? user.name : '');
    setEmail(user ? user.email : '');
    setPassword('');
    setRole(user ? user.role : 'member');
    setTeamId(user ? user.teamId || '' : '');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditUser(null); setName(''); setEmail(''); setPassword(''); setRole('member'); setTeamId(''); };

  const handleSave = async () => {
    if (editUser) {
      await axios.put(`http://localhost:4000/api/users/${editUser.id}`, { name, email, role, teamId: teamId ? Number(teamId) : null });
    } else {
      await axios.post('http://localhost:4000/api/users', { name, email, password, role, teamId: teamId ? Number(teamId) : null });
    }
    handleClose();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/users/${id}`);
    fetchUsers();
  };

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Users</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add</Button>
      </Stack>
      <List>
        {users.map(user => (
          <ListItem key={user.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(user)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(user.id)}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={user.name} secondary={user.email + (user.teamId ? ` (Team: ${teams.find(t => t.id === user.teamId)?.name || 'N/A'})` : '')} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} />
          <TextField margin="dense" label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          {!editUser && <TextField margin="dense" label="Password" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />}
          <TextField select margin="dense" label="Role" fullWidth value={role} onChange={e => setRole(e.target.value)}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="member">Member</MenuItem>
          </TextField>
          <TextField select margin="dense" label="Team" fullWidth value={teamId} onChange={e => setTeamId(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            {teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 