import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Stack, MenuItem, LinearProgress } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function OKRsPage() {
  const [okrs, setOKRs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOKR, setEditOKR] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');

  const fetchOKRs = async () => {
    const res = await axios.get('http://localhost:4000/api/okrs');
    setOKRs(res.data);
  };
  const fetchTeams = async () => {
    const res = await axios.get('http://localhost:4000/api/teams');
    setTeams(res.data);
  };
  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:4000/api/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchOKRs(); fetchTeams(); fetchUsers(); }, []);

  const handleOpen = (okr = null) => {
    setEditOKR(okr);
    setTitle(okr ? okr.title : '');
    setDescription(okr ? okr.description : '');
    setTeamId(okr ? okr.teamId : '');
    setAssignedUserId(okr ? okr.assignedUserId || '' : '');
    setStartDate(okr ? okr.startDate?.slice(0, 10) : '');
    setEndDate(okr ? okr.endDate?.slice(0, 10) : '');
    setStatus(okr ? okr.status : 'active');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditOKR(null); setTitle(''); setDescription(''); setTeamId(''); setAssignedUserId(''); setStartDate(''); setEndDate(''); setStatus('active'); };

  const handleSave = async () => {
    const data = { title, description, teamId: Number(teamId), assignedUserId: assignedUserId ? Number(assignedUserId) : null, startDate, endDate, status, createdBy: 1 };
    if (editOKR) {
      await axios.put(`http://localhost:4000/api/okrs/${editOKR.id}`, data);
    } else {
      await axios.post('http://localhost:4000/api/okrs', data);
    }
    handleClose();
    fetchOKRs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/okrs/${id}`);
    fetchOKRs();
  };

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">OKRs</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add</Button>
      </Stack>
      <List>
        {okrs.map(okr => (
          <ListItem key={okr.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(okr)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(okr.id)}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={okr.title} secondary={<>
              <div>{okr.description}</div>
              <div>Team: {teams.find(t => t.id === okr.teamId)?.name || 'N/A'}</div>
              <div>Assigned: {users.find(u => u.id === okr.assignedUserId)?.name || 'N/A'}</div>
              <div>Status: {okr.status}</div>
              <div>Progress: <LinearProgress variant="determinate" value={okr.progress || 0} sx={{ width: 100, display: 'inline-block', mr: 1 }} /> {Math.round(okr.progress || 0)}%</div>
            </>} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editOKR ? 'Edit OKR' : 'Add OKR'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
          <TextField margin="dense" label="Description" fullWidth value={description} onChange={e => setDescription(e.target.value)} />
          <TextField select margin="dense" label="Team" fullWidth value={teamId} onChange={e => setTeamId(e.target.value)}>
            {teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>)}
          </TextField>
          <TextField select margin="dense" label="Assigned User" fullWidth value={assignedUserId} onChange={e => setAssignedUserId(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
          </TextField>
          <TextField margin="dense" label="Start Date" type="date" fullWidth value={startDate} onChange={e => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" label="End Date" type="date" fullWidth value={endDate} onChange={e => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField select margin="dense" label="Status" fullWidth value={status} onChange={e => setStatus(e.target.value)}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
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