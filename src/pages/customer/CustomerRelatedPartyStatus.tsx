
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
import CustomerRelatedPartyStatusApiService from '../../data/services/customer/customerRelatedPartyStatus/customerRelatedPartyStatus_api_services';

const CustomerRelatedPartyStatus: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [CustomerRelatedPartyStatusName, setCustomerRelatedPartyStatusName] = useState('');
  const [CustomerRelatedPartyStatusCode, setCustomerRelatedPartyStatusCode] = useState('');
  const [CustomerRelatedPartyStatuss, setCustomerRelatedPartyStatuss] = useState<any[]>([]);
  const [blockedCustomerRelatedPartyStatuss, setBlockedCustomerRelatedPartyStatuss] = useState<any[]>([]);
  const [editingCustomerRelatedPartyStatus, setEditingCustomerRelatedPartyStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedCustomerRelatedPartyStatus, setSelectedCustomerRelatedPartyStatus] = useState<any | null>(null);
  const [blockedCustomerRelatedPartyStatussDialogOpen, setBlockedCustomerRelatedPartyStatussDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const CustomerRelatedPartyStatusService = new CustomerRelatedPartyStatusApiService();

  useEffect(() => {
    fetchCustomerRelatedPartyStatuss();
    fetchBlockedCustomerRelatedPartyStatuss()
  }, []);

  const fetchCustomerRelatedPartyStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const CustomerRelatedPartyStatus = await CustomerRelatedPartyStatusService.getCustomerRelatedPartyStatus();
      const activeCustomerRelatedPartyStatuss = CustomerRelatedPartyStatus.filter((c: any) => !c.isBlocked);
      setCustomerRelatedPartyStatuss(activeCustomerRelatedPartyStatuss);
    } catch (error) {
      console.error('Error fetching CustomerRelatedPartyStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedCustomerRelatedPartyStatuss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await CustomerRelatedPartyStatusService.getDeactiveCustomerRelatedPartyStatus();
      setBlockedCustomerRelatedPartyStatuss(response);
    } catch (error) {
      console.error('Error fetching blocked CustomerRelatedPartyStatuss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: CustomerRelatedPartyStatusName, code: CustomerRelatedPartyStatusCode,  uid: loginDetails.id };
    try {
      if (editingCustomerRelatedPartyStatus !== null) {
        await CustomerRelatedPartyStatusService.updateCustomerRelatedPartyStatus(editingCustomerRelatedPartyStatus, payload);
        setEditingCustomerRelatedPartyStatus(null);
        setSuccessMessage('CustomerRelatedPartyStatus updated successfully!');

      } else {
        await CustomerRelatedPartyStatusService.CreateCustomerRelatedPartyStatus(payload);
        setSuccessMessage('CustomerRelatedPartyStatus added successfully!');

      }
      setOpenSnackbar(true);
      setCustomerRelatedPartyStatusName('');
      setCustomerRelatedPartyStatusCode('');
      setDialogOpen(false);
      fetchCustomerRelatedPartyStatuss();
    } catch (error) {
      console.error('Error saving CustomerRelatedPartyStatus:', error);
      setErrorMessage('Error saving CustomerRelatedPartyStatus.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (CustomerRelatedPartyStatus: any) => {
    setCustomerRelatedPartyStatusName(CustomerRelatedPartyStatus.name);
    setCustomerRelatedPartyStatusCode(CustomerRelatedPartyStatus.code);
    setEditingCustomerRelatedPartyStatus(CustomerRelatedPartyStatus.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (CustomerRelatedPartyStatus: any) => {
    setSelectedCustomerRelatedPartyStatus(CustomerRelatedPartyStatus);
    setConfirmBlockOpen(true);
  };

  const handleBlockCustomerRelatedPartyStatus = async () => {
    if (selectedCustomerRelatedPartyStatus !== null) {
      try {
        const euid = 1;  
        await CustomerRelatedPartyStatusService.deActivateCustomerRelatedPartyStatus(selectedCustomerRelatedPartyStatus.id, euid);
  
        setCustomerRelatedPartyStatuss((prevCustomerRelatedPartyStatuss) =>
          prevCustomerRelatedPartyStatuss.filter((CustomerRelatedPartyStatus) => CustomerRelatedPartyStatus.id !== selectedCustomerRelatedPartyStatus.id)
        );
  
        setBlockedCustomerRelatedPartyStatuss((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedCustomerRelatedPartyStatus, isBlocked: true }
        ]);
  
        setSuccessMessage(`CustomerRelatedPartyStatus blocked successfully!`);
        setSelectedCustomerRelatedPartyStatus(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking CustomerRelatedPartyStatus:', error);
        setErrorMessage('Error blocking CustomerRelatedPartyStatus.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (CustomerRelatedPartyStatus: any) => {
    setSelectedCustomerRelatedPartyStatus(CustomerRelatedPartyStatus);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockCustomerRelatedPartyStatus = async () => {
    if (selectedCustomerRelatedPartyStatus !== null) {
      try {
        await CustomerRelatedPartyStatusService.unblockCustomerRelatedPartyStatus(selectedCustomerRelatedPartyStatus.id);

        setBlockedCustomerRelatedPartyStatuss((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCustomerRelatedPartyStatus.id));
        setCustomerRelatedPartyStatuss((prevCustomerRelatedPartyStatuss) => [...prevCustomerRelatedPartyStatuss, { ...selectedCustomerRelatedPartyStatus, isBlocked: false }]);
        setSuccessMessage(`CustomerRelatedPartyStatus unblocked successfully!`);

        setSelectedCustomerRelatedPartyStatus(null);
        setConfirmUnblockOpen(false);
        setBlockedCustomerRelatedPartyStatussDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking CustomerRelatedPartyStatus:', error);
        setErrorMessage('Error unblocking CustomerRelatedPartyStatus.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setCustomerRelatedPartyStatusName('');
    setCustomerRelatedPartyStatusCode('');
    setEditingCustomerRelatedPartyStatus(null);
    setDialogOpen(true);
  };

  const toggleBlockedCustomerRelatedPartyStatuss = () => {
    setBlockedCustomerRelatedPartyStatussDialogOpen(true);
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
          <h6 className='allheading'> RELATED PARTY STATUS </h6>
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
              onClick={toggleBlockedCustomerRelatedPartyStatuss}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={CustomerRelatedPartyStatuss.length > 0 || blockedCustomerRelatedPartyStatuss.length > 0}>
          {CustomerRelatedPartyStatuss.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active CustomerRelatedPartyStatuss available. Please add a new CustomerRelatedPartyStatus.
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
                    {CustomerRelatedPartyStatuss.map((CustomerRelatedPartyStatus: any,index: number) => (
                      <TableRow key={CustomerRelatedPartyStatus.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{CustomerRelatedPartyStatus.name}</TableCell>
                        <TableCell className="small-cell">{CustomerRelatedPartyStatus.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(CustomerRelatedPartyStatus)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(CustomerRelatedPartyStatus)} style={{ padding: '1px' }}>
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
        {/* Blocked CustomerRelatedPartyStatuss Dialog */}
        <Dialog open={blockedCustomerRelatedPartyStatussDialogOpen} onClose={() => setBlockedCustomerRelatedPartyStatussDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked CustomerRelatedPartyStatuss</DialogTitle>
          <DialogContent>
            {blockedCustomerRelatedPartyStatuss.length === 0 ? (
              <Typography className='confirmation-text'>No blocked CustomerRelatedPartyStatuss available.</Typography>
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
                  {blockedCustomerRelatedPartyStatuss.map((CustomerRelatedPartyStatus: any,index:number) => (
                    <TableRow key={CustomerRelatedPartyStatus.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{CustomerRelatedPartyStatus.name}</TableCell>
                      <TableCell className="small-cell">{CustomerRelatedPartyStatus.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(CustomerRelatedPartyStatus)}>
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
            <Button onClick={() => setBlockedCustomerRelatedPartyStatussDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedCustomerRelatedPartyStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the CustomerRelatedPartyStatus "{selectedCustomerRelatedPartyStatus.name}" (Code: {selectedCustomerRelatedPartyStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockCustomerRelatedPartyStatus} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedCustomerRelatedPartyStatus && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the CustomerRelatedPartyStatus "{selectedCustomerRelatedPartyStatus.name}" (Code: {selectedCustomerRelatedPartyStatus.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockCustomerRelatedPartyStatus} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* CustomerRelatedPartyStatus Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingCustomerRelatedPartyStatus !== null ? 'Edit CustomerRelatedPartyStatus' : 'Add CustomerRelatedPartyStatus'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="CustomerRelatedPartyStatus Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={CustomerRelatedPartyStatusName}
                onChange={(e) => setCustomerRelatedPartyStatusName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="CustomerRelatedPartyStatus Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={CustomerRelatedPartyStatusCode}
                onChange={(e) => setCustomerRelatedPartyStatusCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingCustomerRelatedPartyStatus !== null ? 'Update' : 'Add'}
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

export default CustomerRelatedPartyStatus;
