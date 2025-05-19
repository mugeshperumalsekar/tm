
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
import CustomerTypeApiService from '../../data/services/customer/customerType/customerType_api_services';

const CustomerType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [CustomerTypeName, setCustomerTypeName] = useState('');
  const [CustomerTypeCode, setCustomerTypeCode] = useState('');
  const [CustomerTypes, setCustomerTypes] = useState<any[]>([]);
  const [blockedCustomerTypes, setBlockedCustomerTypes] = useState<any[]>([]);
  const [editingCustomerType, setEditingCustomerType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState<any | null>(null);
  const [blockedCustomerTypesDialogOpen, setBlockedCustomerTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const customerTypeService = new CustomerTypeApiService();

  useEffect(() => {
    fetchCustomerTypes();
    fetchBlockedCustomerTypes()
  }, []);

  const fetchCustomerTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const CustomerType = await customerTypeService.getCustomerType();
      const activeCustomerTypes = CustomerType.filter((c: any) => !c.isBlocked);
      setCustomerTypes(activeCustomerTypes);
    } catch (error) {
      console.error('Error fetching CustomerTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedCustomerTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await customerTypeService.getDeactiveCustomerType();
      setBlockedCustomerTypes(response);
    } catch (error) {
      console.error('Error fetching blocked CustomerTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: CustomerTypeName, customercategory: CustomerTypeCode,  uid: loginDetails.id };
    try {
      if (editingCustomerType !== null) {
        await customerTypeService.updateCustomerType(editingCustomerType, payload);
        setEditingCustomerType(null);
        setSuccessMessage('CustomerType updated successfully!');

      } else {
        await customerTypeService.CreateCustomerType(payload);
        setSuccessMessage('CustomerType added successfully!');

      }
      setOpenSnackbar(true);
      setCustomerTypeName('');
      setCustomerTypeCode('');
      setDialogOpen(false);
      fetchCustomerTypes();
    } catch (error) {
      console.error('Error saving CustomerType:', error);
      setErrorMessage('Error saving CustomerType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (CustomerType: any) => {
    setCustomerTypeName(CustomerType.name);
    setCustomerTypeCode(CustomerType.code);
    setEditingCustomerType(CustomerType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (CustomerType: any) => {
    setSelectedCustomerType(CustomerType);
    setConfirmBlockOpen(true);
  };

  const handleBlockCustomerType = async () => {
    if (selectedCustomerType !== null) {
      try {
        const euid = 1;  
        await customerTypeService.deActivateCustomerType(selectedCustomerType.id, euid);
  
        setCustomerTypes((prevCustomerTypes) =>
          prevCustomerTypes.filter((CustomerType) => CustomerType.id !== selectedCustomerType.id)
        );
  
        setBlockedCustomerTypes((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedCustomerType, isBlocked: true }
        ]);
  
        setSuccessMessage(`CustomerType blocked successfully!`);
        setSelectedCustomerType(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking CustomerType:', error);
        setErrorMessage('Error blocking CustomerType.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (CustomerType: any) => {
    setSelectedCustomerType(CustomerType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockCustomerType = async () => {
    if (selectedCustomerType !== null) {
      try {
        await customerTypeService.unblockCustomerType(selectedCustomerType.id);

        setBlockedCustomerTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedCustomerType.id));
        setCustomerTypes((prevCustomerTypes) => [...prevCustomerTypes, { ...selectedCustomerType, isBlocked: false }]);
        setSuccessMessage(`CustomerType unblocked successfully!`);

        setSelectedCustomerType(null);
        setConfirmUnblockOpen(false);
        setBlockedCustomerTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking CustomerType:', error);
        setErrorMessage('Error unblocking CustomerType.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setCustomerTypeName('');
    setCustomerTypeCode('');
    setEditingCustomerType(null);
    setDialogOpen(true);
  };

  const toggleBlockedCustomerTypes = () => {
    setBlockedCustomerTypesDialogOpen(true);
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
              onClick={toggleBlockedCustomerTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={CustomerTypes.length > 0 || blockedCustomerTypes.length > 0}>
          {CustomerTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active CustomerTypes available. Please add a new CustomerType.
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
                    {CustomerTypes.map((CustomerType: any,index: number) => (
                      <TableRow key={CustomerType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{CustomerType.name}</TableCell>
                        <TableCell className="small-cell">{CustomerType.customercategory}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(CustomerType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(CustomerType)} style={{ padding: '1px' }}>
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
        {/* Blocked CustomerTypes Dialog */}
        <Dialog open={blockedCustomerTypesDialogOpen} onClose={() => setBlockedCustomerTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked CustomerTypes</DialogTitle>
          <DialogContent>
            {blockedCustomerTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked CustomerTypes available.</Typography>
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
                  {blockedCustomerTypes.map((CustomerType: any,index:number) => (
                    <TableRow key={CustomerType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{CustomerType.name}</TableCell>
                      <TableCell className="small-cell">{CustomerType.customercategory}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(CustomerType)}>
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
            <Button onClick={() => setBlockedCustomerTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedCustomerType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the CustomerType "{selectedCustomerType.name}" (Code: {selectedCustomerType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockCustomerType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedCustomerType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the CustomerType "{selectedCustomerType.name}" (Code: {selectedCustomerType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockCustomerType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* CustomerType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingCustomerType !== null ? 'Edit CustomerType' : 'Add CustomerType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="CustomerType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={CustomerTypeName}
                onChange={(e) => setCustomerTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="CustomerType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={CustomerTypeCode}
                onChange={(e) => setCustomerTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingCustomerType !== null ? 'Update' : 'Add'}
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

export default CustomerType;
