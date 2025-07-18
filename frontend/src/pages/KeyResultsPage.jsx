import { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Stack, MenuItem, LinearProgress } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function KeyResultsPage() {
  const [keyResults, setKeyResults] = useState([]);
  const [okrs, setOKRs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editKR, setEditKR] = useState(null);
  const [okrId, setOKRId] = useState('');
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [status, setStatus] = useState('active');

  const fetchKRs = async () => {
    const res = await axios.get('http://localhost:4000/api/keyresults');
    setKeyResults(res.data);
  };
  const fetchOKRs = async () => {
    const res = await axios.get('http://localhost:4000/api/okrs');
    setOKRs(res.data);
  };

  useEffect(() => { fetchKRs(); fetchOKRs(); }, []);

  const handleOpen = (kr = null) => {
    setEditKR(kr);
    setOKRId(kr ? kr.okrId : '');
    setTitle(kr ? kr.title : '');
    setTargetValue(kr ? kr.targetValue : '');
    setCurrentValue(kr ? kr.currentValue : '');
    setStatus(kr ? kr.status : 'active');
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditKR(null); setOKRId(''); setTitle(''); setTargetValue(''); setCurrentValue(''); setStatus('active'); };

  const handleSave = async () => {
    const data = { okrId: Number(okrId), title, targetValue: Number(targetValue), currentValue: Number(currentValue), status };
    if (editKR) {
      await axios.put(`http://localhost:4000/api/keyresults/${editKR.id}`, data);
    } else {
      await axios.post('http://localhost:4000/api/keyresults', data);
    }
    handleClose();
    fetchKRs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/keyresults/${id}`);
    fetchKRs();
  };

  return (
    <Box mt={8}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Key Results</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add</Button>
      </Stack>
      <List>
        {keyResults.map(kr => (
          <ListItem key={kr.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => handleOpen(kr)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(kr.id)}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={kr.title} secondary={<>
              <div>OKR: {okrs.find(o => o.id === kr.okrId)?.title || 'N/A'}</div>
              <div>Target: {kr.targetValue} | Current: {kr.currentValue}</div>
              <div>Status: {kr.status}</div>
              <div>Progress: <LinearProgress variant="determinate" value={kr.targetValue ? (kr.currentValue / kr.targetValue) * 100 : 0} sx={{ width: 100, display: 'inline-block', mr: 1 }} /> {kr.targetValue ? Math.round((kr.currentValue / kr.targetValue) * 100) : 0}%</div>
            </>} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editKR ? 'Edit Key Result' : 'Add Key Result'}</DialogTitle>
        <DialogContent>
          <TextField select margin="dense" label="OKR" fullWidth value={okrId} onChange={e => setOKRId(e.target.value)}>
            {okrs.map(okr => <MenuItem key={okr.id} value={okr.id}>{okr.title}</MenuItem>)}
          </TextField>
          <TextField autoFocus margin="dense" label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
          <TextField margin="dense" label="Target Value" type="number" fullWidth value={targetValue} onChange={e => setTargetValue(e.target.value)} />
          <TextField margin="dense" label="Current Value" type="number" fullWidth value={currentValue} onChange={e => setCurrentValue(e.target.value)} />
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