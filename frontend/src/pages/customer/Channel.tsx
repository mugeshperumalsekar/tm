
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
  Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import ChannelApiService from '../../data/services/customer/channel/channel_api_service';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

const Channel: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [channelName, setChannelName] = useState('');
  const [channelCode, setChannelCode] = useState('');
  const [channels, setChannels] = useState<any[]>([]);
  const [blockedChannels, setBlockedChannels] = useState<any[]>([]);
  const [editingChannel, setEditingChannel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
  const [blockedChannelsDialogOpen, setBlockedChannelsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const channelService = new ChannelApiService();

  useEffect(() => {
    fetchChannels();
    fetchBlockedChannels()
  }, []);

  const fetchChannels = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const channel = await channelService.getactiveChannel();
      const activeChannels = channel.filter((c: any) => !c.isBlocked);
      setChannels(activeChannels);
    } catch (error) {
      console.error('Error fetching channels:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedChannels = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await channelService.getDeactiveChannel();
      setBlockedChannels(response);
    } catch (error) {
      console.error('Error fetching blocked channels:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: channelName, code: channelCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingChannel !== null) {
        await channelService.updateChannel(editingChannel, payload);
        setEditingChannel(null);
        setSuccessMessage('Channel updated successfully!');

      } else {
        await channelService.CreateChannel(payload);
        setSuccessMessage('Channel added successfully!');

      }
      setOpenSnackbar(true);

      setChannelName('');
      setChannelCode('');
      setDialogOpen(false);
      fetchChannels();
    } catch (error) {
      console.error('Error saving Channel:', error);
      setErrorMessage('Error saving Channel.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (channel: any) => {
    setChannelName(channel.name);
    setChannelCode(channel.code);
    setEditingChannel(channel.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (channel: any) => {
    setSelectedChannel(channel);
    setConfirmBlockOpen(true);
  };

  const handleBlockChannel = async () => {
    if (selectedChannel !== null) {
      try {
      await channelService.blockChannel(selectedChannel.id);
      setChannels((prevChannels) =>
        prevChannels.filter((channel) => channel.id !== selectedChannel.id)
      );
      setBlockedChannels((prevBlocked) => [...prevBlocked, { ...selectedChannel, isBlocked: true }]);
      setSuccessMessage(`Channel  blocked successfully!`);

      setSelectedChannel(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking Channel:', error);
      setErrorMessage('Error blocking Channel.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (channel: any) => {
    setSelectedChannel(channel);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockChannel = async () => {
    if (selectedChannel !== null) {
      try {
        await channelService.unblockChannel(selectedChannel.id);

        setBlockedChannels((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedChannel.id));
        setChannels((prevChannels) => [...prevChannels, { ...selectedChannel, isBlocked: false }]);
        setSuccessMessage(`Channel unblocked successfully!`);

        setSelectedChannel(null);
        setConfirmUnblockOpen(false);
        setBlockedChannelsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Channel:', error);
        setErrorMessage('Error unblocking Channel.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setChannelName('');
    setChannelCode('');
    setEditingChannel(null);
    setDialogOpen(true);
  };

  const toggleBlockedChannels = () => {
    setBlockedChannelsDialogOpen(true);
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSuccessMessage('');
    setErrorMessage('');
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h6 className='allheading'>CHANNEL </h6>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              className='MuiButton-root'
              variant="contained"
              color="primary"
              onClick={openDialog}
            >
              Add New
            </Button>
            <Button
              className='MuiButton-root'
              variant="contained"
              color="primary"
              onClick={toggleBlockedChannels}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={channels.length > 0 || blockedChannels.length > 0}>
          {channels.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active channels available. Please add a new channel.
            </Typography>
          ) : (
            <>

              <TableContainer
                component={Card}
                style={{
                  maxHeight: '450px',
                  overflow: 'auto',

                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="MuiTableCell-head"> S.No</TableCell>
                      <TableCell className="MuiTableCell-head">Name</TableCell>
                      <TableCell className="MuiTableCell-head">Code</TableCell>
                      <TableCell className="MuiTableCell-head">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {channels.map((channel: any,index: number) => (
                      <TableRow key={channel.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{channel.name}</TableCell>
                        <TableCell className="small-cell">{channel.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(channel)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(channel)} style={{ padding: '1px' }}>
                            <Edit style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </>
          )}
        </Loading>
        {/* Blocked Channels Dialog */}
        <Dialog open={blockedChannelsDialogOpen} onClose={() => setBlockedChannelsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Channels</DialogTitle>
          <DialogContent>
            {blockedChannels.length === 0 ? (
              <Typography className='confirmation-text'>No blocked channels available.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell className="MuiTableCell-head"> S.No</TableCell>
                      <TableCell className="MuiTableCell-head">Name</TableCell>
                      <TableCell className="MuiTableCell-head">Code</TableCell>
                      <TableCell className="MuiTableCell-head">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockedChannels.map((channel: any,index:number) => (
                    <TableRow key={channel.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{channel.name}</TableCell>
                      <TableCell className="small-cell">{channel.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(channel)}>
                          <Block style={{ fontSize: '16px',color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockedChannelsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedChannel && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the channel "{selectedChannel.name}" (Code: {selectedChannel.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockChannel} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedChannel && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the channel "{selectedChannel.name}" (Code: {selectedChannel.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockChannel} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Channel Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingChannel !== null ? 'Edit Channel' : 'Add Channel'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Channel Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Channel Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={channelCode}
                onChange={(e) => setChannelCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingChannel !== null ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          {successMessage ? (
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          ) : (
            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          )}
        </Snackbar>
    </Box>
  );
};

export default Channel;
