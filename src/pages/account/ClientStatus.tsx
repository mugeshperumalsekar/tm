import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import ClientStatusApiService from '../../data/services/account/clientStatus/clientStatus_api_service';

const ClientStatus: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ClientStatusName, setClientStatusName] = useState('');
  const [ClientStatusCode, setClientStatusCode] = useState('');
  const [ClientStatuss, setClientStatuss] = useState<any[]>([]);
  const [blockedClientStatuss, setBlockedClientStatuss] = useState<any[]>([]);
  const [editingClientStatus, setEditingClientStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedClientStatus, setSelectedClientStatus] = useState<any | null>(null);
  const [blockedClientStatussDialogOpen, setBlockedClientStatussDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ClientStatusService = new ClientStatusApiService();

  useEffect(() => {
    fetchClientStatuss();
    fetchBlockedClientStatuss()
  }, []);

  const fetchClientStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ClientStatus = await ClientStatusService.getClientStatus();
      const activeClientStatuss = ClientStatus.filter((c: any) => !c.isBlocked);
      setClientStatuss(activeClientStatuss);
    } catch (error) {
      console.error('Error fetching ClientStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedClientStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ClientStatusService.getDeactiveClientStatus();
      setBlockedClientStatuss(response);
    } catch (error) {
      console.error('Error fetching blocked ClientStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ClientStatusName, code: ClientStatusCode, uid: loginDetails.id, euid: '1' };
    try {
      if (editingClientStatus !== null) {
        await ClientStatusService.updateClientStatus(editingClientStatus, payload);
        setEditingClientStatus(null);
        setSuccessMessage('ClientStatus updated successfully!');
      } else {
        await ClientStatusService.CreateClientStatus(payload);
        setSuccessMessage('ClientStatus added successfully!');
      }
      setOpenSnackbar(true);
      setClientStatusName('');
      setClientStatusCode('');
      setDialogOpen(false);
      fetchClientStatuss();
    } catch (error) {
      console.error('Error saving ClientStatus:', error);
      setErrorMessage('Error saving ClientStatus.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ClientStatus: any) => {
    setClientStatusName(ClientStatus.name);
    setClientStatusCode(ClientStatus.code);
    setEditingClientStatus(ClientStatus.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ClientStatus: any) => {
    setSelectedClientStatus(ClientStatus);
    setConfirmBlockOpen(true);
  };

  const handleBlockClientStatus = async () => {
    if (selectedClientStatus !== null) {
      try {
        await ClientStatusService.blockClientStatus(selectedClientStatus.id);
        setClientStatuss((prevClientStatuss) =>
          prevClientStatuss.filter((ClientStatus) => ClientStatus.id !== selectedClientStatus.id)
        );
        setBlockedClientStatuss((prevBlocked) => [...prevBlocked, { ...selectedClientStatus, isBlocked: true }]);
        setSuccessMessage(`ClientStatus  blocked successfully!`);
        setSelectedClientStatus(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error blocking ClientStatus:', error);
        setErrorMessage('Error blocking ClientStatus.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (ClientStatus: any) => {
    setSelectedClientStatus(ClientStatus);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockClientStatus = async () => {
    if (selectedClientStatus !== null) {
      try {
        await ClientStatusService.unblockClientStatus(selectedClientStatus.id);

        setBlockedClientStatuss((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedClientStatus.id));
        setClientStatuss((prevClientStatuss) => [...prevClientStatuss, { ...selectedClientStatus, isBlocked: false }]);
        setSuccessMessage(`ClientStatus unblocked successfully!`);

        setSelectedClientStatus(null);
        setConfirmUnblockOpen(false);
        setBlockedClientStatussDialogOpen(false);
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking ClientStatus:', error);
        setErrorMessage('Error unblocking ClientStatus.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setClientStatusName('');
    setClientStatusCode('');
    setEditingClientStatus(null);
    setDialogOpen(true);
  };

  const toggleBlockedClientStatuss = () => {
    setBlockedClientStatussDialogOpen(true);
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
          <h6 className='allheading'>ClientStatus </h6>
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
              onClick={toggleBlockedClientStatuss}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={ClientStatuss.length > 0 || blockedClientStatuss.length > 0}>
          {ClientStatuss.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active ClientStatuss available. Please add a new ClientStatus.
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
                    {ClientStatuss.map((ClientStatus: any, index: number) => (
                      <TableRow key={ClientStatus.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>

                        <TableCell className="small-cell">{ClientStatus.name}</TableCell>
                        <TableCell className="small-cell">{ClientStatus.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ClientStatus)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ClientStatus)} style={{ padding: '1px' }}>
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
        {/* Blocked ClientStatuss Dialog */}
        <Dialog open={blockedClientStatussDialogOpen} onClose={() => setBlockedClientStatussDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ClientStatuss</DialogTitle>
          <DialogContent>
            {blockedClientStatuss.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ClientStatuss available.</Typography>
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
                  {blockedClientStatuss.map((ClientStatus: any, index: number) => (
                    <TableRow key={ClientStatus.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{ClientStatus.name}</TableCell>
                      <TableCell className="small-cell">{ClientStatus.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ClientStatus)}>
                          <Block style={{ fontSize: '16px', color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockedClientStatussDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedClientStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ClientStatus "{selectedClientStatus.name}" (Code: {selectedClientStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockClientStatus} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedClientStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ClientStatus "{selectedClientStatus.name}" (Code: {selectedClientStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockClientStatus} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ClientStatus Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingClientStatus !== null ? 'Edit ClientStatus' : 'Add ClientStatus'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ClientStatus Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ClientStatusName}
                onChange={(e) => setClientStatusName(e.target.value)}
              />

              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ClientStatus Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ClientStatusCode}
                onChange={(e) => setClientStatusCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingClientStatus !== null ? 'Update' : 'Add'}
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

export default ClientStatus;
