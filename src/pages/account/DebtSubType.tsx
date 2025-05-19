
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
import DebtSubTypeApiService from '../../data/services/account/debtSubType/debtSubType_api_service';

const DebtSubType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [DebtSubTypeName, setDebtSubTypeName] = useState('');
  const [DebtSubTypeCode, setDebtSubTypeCode] = useState('');
  const [DebtSubTypes, setDebtSubTypes] = useState<any[]>([]);
  const [blockedDebtSubTypes, setBlockedDebtSubTypes] = useState<any[]>([]);
  const [editingDebtSubType, setEditingDebtSubType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedDebtSubType, setSelectedDebtSubType] = useState<any | null>(null);
  const [blockedDebtSubTypesDialogOpen, setBlockedDebtSubTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const DebtSubTypeService = new DebtSubTypeApiService();

  useEffect(() => {
    fetchDebtSubTypes();
    fetchBlockedDebtSubTypes()
  }, []);

  const fetchDebtSubTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const DebtSubType = await DebtSubTypeService.getDebtSubType();
      const activeDebtSubTypes = DebtSubType.filter((c: any) => !c.isBlocked);
      setDebtSubTypes(activeDebtSubTypes);
    } catch (error) {
      console.error('Error fetching DebtSubTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedDebtSubTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await DebtSubTypeService.getDeactiveDebtSubType();
      setBlockedDebtSubTypes(response);
    } catch (error) {
      console.error('Error fetching blocked DebtSubTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: DebtSubTypeName, code: DebtSubTypeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingDebtSubType !== null) {
        await DebtSubTypeService.updateDebtSubType(editingDebtSubType, payload);
        setEditingDebtSubType(null);
        setSuccessMessage('DebtSubType updated successfully!');

      } else {
        await DebtSubTypeService.CreateDebtSubType(payload);
        setSuccessMessage('DebtSubType added successfully!');

      }

      setOpenSnackbar(true);

      setDebtSubTypeName('');
      setDebtSubTypeCode('');
      setDialogOpen(false);
      fetchDebtSubTypes();
    } catch (error) {
      console.error('Error saving DebtSubType:', error);
      setErrorMessage('Error saving DebtSubType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (DebtSubType: any) => {
    setDebtSubTypeName(DebtSubType.name);
    setDebtSubTypeCode(DebtSubType.code);
    setEditingDebtSubType(DebtSubType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (DebtSubType: any) => {
    setSelectedDebtSubType(DebtSubType);
    setConfirmBlockOpen(true);
  };

  const handleBlockDebtSubType = async () => {
    if (selectedDebtSubType !== null) {
      try {
      await DebtSubTypeService.blockDebtSubType(selectedDebtSubType.id);
      setDebtSubTypes((prevDebtSubTypes) =>
        prevDebtSubTypes.filter((DebtSubType) => DebtSubType.id !== selectedDebtSubType.id)
      );
      setBlockedDebtSubTypes((prevBlocked) => [...prevBlocked, { ...selectedDebtSubType, isBlocked: true }]);
      setSuccessMessage(`DebtSubType  blocked successfully!`);

      setSelectedDebtSubType(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking DebtSubType:', error);
      setErrorMessage('Error blocking DebtSubType.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (DebtSubType: any) => {
    setSelectedDebtSubType(DebtSubType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockDebtSubType = async () => {
    if (selectedDebtSubType !== null) {
      try {
        await DebtSubTypeService.unblockDebtSubType(selectedDebtSubType.id);

        setBlockedDebtSubTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedDebtSubType.id));
        setDebtSubTypes((prevDebtSubTypes) => [...prevDebtSubTypes, { ...selectedDebtSubType, isBlocked: false }]);
        setSuccessMessage(`DebtSubType unblocked successfully!`);

        setSelectedDebtSubType(null);
        setConfirmUnblockOpen(false);
        setBlockedDebtSubTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking DebtSubType:', error);
        setErrorMessage('Error unblocking DebtSubType.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setDebtSubTypeName('');
    setDebtSubTypeCode('');
    setEditingDebtSubType(null);
    setDialogOpen(true);
  };

  const toggleBlockedDebtSubTypes = () => {
    setBlockedDebtSubTypesDialogOpen(true);
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
          <h6 className='allheading'>DebtSubType </h6>
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
              onClick={toggleBlockedDebtSubTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={DebtSubTypes.length > 0 || blockedDebtSubTypes.length > 0}>
          {DebtSubTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active DebtSubTypes available. Please add a new DebtSubType.
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
                    {DebtSubTypes.map((DebtSubType: any,index: number) => (
                      <TableRow key={DebtSubType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{DebtSubType.name}</TableCell>
                        <TableCell className="small-cell">{DebtSubType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(DebtSubType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(DebtSubType)} style={{ padding: '1px' }}>
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
        {/* Blocked DebtSubTypes Dialog */}
        <Dialog open={blockedDebtSubTypesDialogOpen} onClose={() => setBlockedDebtSubTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked DebtSubTypes</DialogTitle>
          <DialogContent>
            {blockedDebtSubTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked DebtSubTypes available.</Typography>
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
                  {blockedDebtSubTypes.map((DebtSubType: any,index:number) => (
                    <TableRow key={DebtSubType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{DebtSubType.name}</TableCell>
                      <TableCell className="small-cell">{DebtSubType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(DebtSubType)}>
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
            <Button onClick={() => setBlockedDebtSubTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedDebtSubType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the DebtSubType "{selectedDebtSubType.name}" (Code: {selectedDebtSubType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockDebtSubType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedDebtSubType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the DebtSubType "{selectedDebtSubType.name}" (Code: {selectedDebtSubType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockDebtSubType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* DebtSubType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingDebtSubType !== null ? 'Edit DebtSubType' : 'Add DebtSubType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="DebtSubType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={DebtSubTypeName}
                onChange={(e) => setDebtSubTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="DebtSubType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={DebtSubTypeCode}
                onChange={(e) => setDebtSubTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingDebtSubType !== null ? 'Update' : 'Add'}
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

export default DebtSubType;
