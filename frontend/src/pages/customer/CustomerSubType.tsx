
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
import CustomerSubTypeApiService from '../../data/services/customer/customerSubType/customerSubType_api_services';

const CustomerSubType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [CustomerSubTypeName, setCustomerSubTypeName] = useState('');
  const [CustomerSubTypeCode, setCustomerSubTypeCode] = useState('');
  const [CustomerSubTypes, setCustomerSubTypes] = useState<any[]>([]);
  const [blockedCustomerSubTypes, setBlockedCustomerSubTypes] = useState<any[]>([]);
  const [editingCustomerSubType, setEditingCustomerSubType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedCustomerSubType, setSelectedCustomerSubType] = useState<any | null>(null);
  const [blockedCustomerSubTypesDialogOpen, setBlockedCustomerSubTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const CustomerSubTypeService = new CustomerSubTypeApiService();

  useEffect(() => {
    fetchCustomerSubTypes();
    fetchBlockedCustomerSubTypes()
  }, []);

  const fetchCustomerSubTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const CustomerSubType = await CustomerSubTypeService.getCustomerSubType();
      const activeCustomerSubTypes = CustomerSubType.filter((c: any) => !c.isBlocked);
      setCustomerSubTypes(activeCustomerSubTypes);
    } catch (error) {
      console.error('Error fetching CustomerSubTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedCustomerSubTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await CustomerSubTypeService.getDeactiveCustomerSubType();
      setBlockedCustomerSubTypes(response);
    } catch (error) {
      console.error('Error fetching blocked CustomerSubTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: CustomerSubTypeName, code: CustomerSubTypeCode,  uid: loginDetails.id };
    try {
      if (editingCustomerSubType !== null) {
        await CustomerSubTypeService.updateCustomerSubType(editingCustomerSubType, payload);
        setEditingCustomerSubType(null);
        setSuccessMessage('CustomerSubType updated successfully!');

      } else {
        await CustomerSubTypeService.CreateCustomerSubType(payload);
        setSuccessMessage('CustomerSubType added successfully!');

      }
      setOpenSnackbar(true);
      setCustomerSubTypeName('');
      setCustomerSubTypeCode('');
      setDialogOpen(false);
      fetchCustomerSubTypes();
    } catch (error) {
      console.error('Error saving CustomerSubType:', error);
      setErrorMessage('Error saving CustomerSubType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (CustomerSubType: any) => {
    setCustomerSubTypeName(CustomerSubType.name);
    setCustomerSubTypeCode(CustomerSubType.code);
    setEditingCustomerSubType(CustomerSubType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (CustomerSubType: any) => {
    setSelectedCustomerSubType(CustomerSubType);
    setConfirmBlockOpen(true);
  };

  const handleBlockCustomerSubType = async () => {
    if (selectedCustomerSubType !== null) {
      try {
        const euid = 1;  
        await CustomerSubTypeService.deActivateCustomerSubType(selectedCustomerSubType.id, euid);
  
        setCustomerSubTypes((prevCustomerSubTypes) =>
          prevCustomerSubTypes.filter((CustomerSubType) => CustomerSubType.id !== selectedCustomerSubType.id)
        );
  
        setBlockedCustomerSubTypes((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedCustomerSubType, isBlocked: true }
        ]);
  
        setSuccessMessage(`CustomerSubType blocked successfully!`);
        setSelectedCustomerSubType(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking CustomerSubType:', error);
        setErrorMessage('Error blocking CustomerSubType.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (CustomerSubType: any) => {
    setSelectedCustomerSubType(CustomerSubType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockCustomerSubType = async () => {
    if (selectedCustomerSubType !== null) {
      try {
        await CustomerSubTypeService.unblockCustomerSubType(selectedCustomerSubType.id);

        setBlockedCustomerSubTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCustomerSubType.id));
        setCustomerSubTypes((prevCustomerSubTypes) => [...prevCustomerSubTypes, { ...selectedCustomerSubType, isBlocked: false }]);
        setSuccessMessage(`CustomerSubType unblocked successfully!`);

        setSelectedCustomerSubType(null);
        setConfirmUnblockOpen(false);
        setBlockedCustomerSubTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking CustomerSubType:', error);
        setErrorMessage('Error unblocking CustomerSubType.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setCustomerSubTypeName('');
    setCustomerSubTypeCode('');
    setEditingCustomerSubType(null);
    setDialogOpen(true);
  };

  const toggleBlockedCustomerSubTypes = () => {
    setBlockedCustomerSubTypesDialogOpen(true);
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
          <h6 className='allheading'> SUBTYPE </h6>
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
              onClick={toggleBlockedCustomerSubTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={CustomerSubTypes.length > 0 || blockedCustomerSubTypes.length > 0}>
          {CustomerSubTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active CustomerSubTypes available. Please add a new CustomerSubType.
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
                    {CustomerSubTypes.map((CustomerSubType: any,index: number) => (
                      <TableRow key={CustomerSubType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{CustomerSubType.name}</TableCell>
                        <TableCell className="small-cell">{CustomerSubType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(CustomerSubType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(CustomerSubType)} style={{ padding: '1px' }}>
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
        {/* Blocked CustomerSubTypes Dialog */}
        <Dialog open={blockedCustomerSubTypesDialogOpen} onClose={() => setBlockedCustomerSubTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked CustomerSubTypes</DialogTitle>
          <DialogContent>
            {blockedCustomerSubTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked CustomerSubTypes available.</Typography>
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
                  {blockedCustomerSubTypes.map((CustomerSubType: any,index:number) => (
                    <TableRow key={CustomerSubType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{CustomerSubType.name}</TableCell>
                      <TableCell className="small-cell">{CustomerSubType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(CustomerSubType)}>
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
            <Button onClick={() => setBlockedCustomerSubTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedCustomerSubType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the CustomerSubType "{selectedCustomerSubType.name}" (Code: {selectedCustomerSubType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockCustomerSubType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedCustomerSubType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the CustomerSubType "{selectedCustomerSubType.name}" (Code: {selectedCustomerSubType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockCustomerSubType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* CustomerSubType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingCustomerSubType !== null ? 'Edit CustomerSubType' : 'Add CustomerSubType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="CustomerSubType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={CustomerSubTypeName}
                onChange={(e) => setCustomerSubTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="CustomerSubType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={CustomerSubTypeCode}
                onChange={(e) => setCustomerSubTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingCustomerSubType !== null ? 'Update' : 'Add'}
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

export default CustomerSubType;
