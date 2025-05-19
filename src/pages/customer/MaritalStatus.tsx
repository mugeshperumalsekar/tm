
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card,
  Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import MaritalStatusApiService from '../../data/services/customer/maritalStatus/maritalStatus_api_services';

const MaritalStatus: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [MaritalStatusName, setMaritalStatusName] = useState('');
  const [MaritalStatusCode, setMaritalStatusCode] = useState('');
  const [MaritalStatuss, setMaritalStatuss] = useState<any[]>([]);
  const [blockedMaritalStatuss, setBlockedMaritalStatuss] = useState<any[]>([]);
  const [editingMaritalStatus, setEditingMaritalStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<any | null>(null);
  const [blockedMaritalStatussDialogOpen, setBlockedMaritalStatussDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const MaritalStatusService = new MaritalStatusApiService();

  useEffect(() => {
    fetchMaritalStatuss();
    fetchBlockedMaritalStatuss()
  }, []);

  const fetchMaritalStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const MaritalStatus = await MaritalStatusService.getMaritalStatus();
      const activeMaritalStatuss = MaritalStatus.filter((c: any) => !c.isBlocked);
      setMaritalStatuss(activeMaritalStatuss);
    } catch (error) {
      console.error('Error fetching MaritalStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedMaritalStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await MaritalStatusService.getDeactiveMaritalStatus();
      setBlockedMaritalStatuss(response);
    } catch (error) {
      console.error('Error fetching blocked MaritalStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: MaritalStatusName, code: MaritalStatusCode,  uid: loginDetails.id };
    try {
      if (editingMaritalStatus !== null) {
        await MaritalStatusService.updateMaritalStatus(editingMaritalStatus, payload);
        setEditingMaritalStatus(null);
        setSuccessMessage('MaritalStatus updated successfully!');

      } else {
        await MaritalStatusService.CreateMaritalStatus(payload);
        setSuccessMessage('MaritalStatus added successfully!');

      }
      setOpenSnackbar(true);
      setMaritalStatusName('');
      setMaritalStatusCode('');
      setDialogOpen(false);
      fetchMaritalStatuss();
    } catch (error) {
      console.error('Error saving MaritalStatus:', error);
      setErrorMessage('Error saving MaritalStatus.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (MaritalStatus: any) => {
    setMaritalStatusName(MaritalStatus.name);
    setMaritalStatusCode(MaritalStatus.code);
    setEditingMaritalStatus(MaritalStatus.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (MaritalStatus: any) => {
    setSelectedMaritalStatus(MaritalStatus);
    setConfirmBlockOpen(true);
  };

  const handleBlockMaritalStatus = async () => {
    if (selectedMaritalStatus !== null) {
      try {
        const euid = 1;  
        await MaritalStatusService.deActivateMaritalStatus(selectedMaritalStatus.id, euid);
  
        setMaritalStatuss((prevMaritalStatuss) =>
          prevMaritalStatuss.filter((MaritalStatus) => MaritalStatus.id !== selectedMaritalStatus.id)
        );
  
        setBlockedMaritalStatuss((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedMaritalStatus, isBlocked: true }
        ]);
  
        setSuccessMessage(`MaritalStatus blocked successfully!`);
        setSelectedMaritalStatus(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking MaritalStatus:', error);
        setErrorMessage('Error blocking MaritalStatus.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (MaritalStatus: any) => {
    setSelectedMaritalStatus(MaritalStatus);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockMaritalStatus = async () => {
    if (selectedMaritalStatus !== null) {
      try {
        await MaritalStatusService.unblockMaritalStatus(selectedMaritalStatus.id);

        setBlockedMaritalStatuss((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedMaritalStatus.id));
        setMaritalStatuss((prevMaritalStatuss) => [...prevMaritalStatuss, { ...selectedMaritalStatus, isBlocked: false }]);
        setSuccessMessage(`MaritalStatus unblocked successfully!`);

        setSelectedMaritalStatus(null);
        setConfirmUnblockOpen(false);
        setBlockedMaritalStatussDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking MaritalStatus:', error);
        setErrorMessage('Error unblocking MaritalStatus.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setMaritalStatusName('');
    setMaritalStatusCode('');
    setEditingMaritalStatus(null);
    setDialogOpen(true);
  };

  const toggleBlockedMaritalStatuss = () => {
    setBlockedMaritalStatussDialogOpen(true);
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
          <h6 className='allheading'> MARITAL STATUS </h6>
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
              onClick={toggleBlockedMaritalStatuss}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={MaritalStatuss.length > 0 || blockedMaritalStatuss.length > 0}>
          {MaritalStatuss.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active MaritalStatuss available. Please add a new MaritalStatus.
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
                    {MaritalStatuss.map((MaritalStatus: any,index: number) => (
                      <TableRow key={MaritalStatus.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{MaritalStatus.name}</TableCell>
                        <TableCell className="small-cell">{MaritalStatus.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(MaritalStatus)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(MaritalStatus)} style={{ padding: '1px' }}>
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
        {/* Blocked MaritalStatuss Dialog */}
        <Dialog open={blockedMaritalStatussDialogOpen} onClose={() => setBlockedMaritalStatussDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked MaritalStatuss</DialogTitle>
          <DialogContent>
            {blockedMaritalStatuss.length === 0 ? (
              <Typography className='confirmation-text'>No blocked MaritalStatuss available.</Typography>
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
                  {blockedMaritalStatuss.map((MaritalStatus: any,index:number) => (
                    <TableRow key={MaritalStatus.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{MaritalStatus.name}</TableCell>
                      <TableCell className="small-cell">{MaritalStatus.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(MaritalStatus)}>
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
            <Button onClick={() => setBlockedMaritalStatussDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedMaritalStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the MaritalStatus "{selectedMaritalStatus.name}" (Code: {selectedMaritalStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockMaritalStatus} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedMaritalStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the MaritalStatus "{selectedMaritalStatus.name}" (Code: {selectedMaritalStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockMaritalStatus} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* MaritalStatus Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingMaritalStatus !== null ? 'Edit MaritalStatus' : 'Add MaritalStatus'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="MaritalStatus Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={MaritalStatusName}
                onChange={(e) => setMaritalStatusName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="MaritalStatus Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={MaritalStatusCode}
                onChange={(e) => setMaritalStatusCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingMaritalStatus !== null ? 'Update' : 'Add'}
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

export default MaritalStatus;
