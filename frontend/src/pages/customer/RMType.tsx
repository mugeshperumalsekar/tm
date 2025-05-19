
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
import RMTypeApiService from '../../data/services/customer/rmType/rmType_api_service';

const RMType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [RMTypeName, setRMTypeName] = useState('');
  const [RMTypeCode, setRMTypeCode] = useState('');
  const [RMTypes, setRMTypes] = useState<any[]>([]);
  const [blockedRMTypes, setBlockedRMTypes] = useState<any[]>([]);
  const [editingRMType, setEditingRMType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedRMType, setSelectedRMType] = useState<any | null>(null);
  const [blockedRMTypesDialogOpen, setBlockedRMTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const RMTypeService = new RMTypeApiService();

  useEffect(() => {
    fetchRMTypes();
    fetchBlockedRMTypes()
  }, []);

  const fetchRMTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const RMType = await RMTypeService.getRMType();
      const activeRMTypes = RMType.filter((c: any) => !c.isBlocked);
      setRMTypes(activeRMTypes);
    } catch (error) {
      console.error('Error fetching RMTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedRMTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await RMTypeService.getDeactiveRMType();
      setBlockedRMTypes(response);
    } catch (error) {
      console.error('Error fetching blocked RMTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: RMTypeName, code: RMTypeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingRMType !== null) {
        await RMTypeService.updateRMType(editingRMType, payload);
        setEditingRMType(null);
        setSuccessMessage('RMType updated successfully!');

      } else {
        await RMTypeService.CreateRMType(payload);
        setSuccessMessage('RMType added successfully!');

      }

      setOpenSnackbar(true);

      setRMTypeName('');
      setRMTypeCode('');
      setDialogOpen(false);
      fetchRMTypes();
    } catch (error) {
      console.error('Error saving RMType:', error);
      setErrorMessage('Error saving RMType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (RMType: any) => {
    setRMTypeName(RMType.name);
    setRMTypeCode(RMType.code);
    setEditingRMType(RMType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (RMType: any) => {
    setSelectedRMType(RMType);
    setConfirmBlockOpen(true);
  };

  const handleBlockRMType = async () => {
    if (selectedRMType !== null) {
      try {
      await RMTypeService.blockRMType(selectedRMType.id);
      setRMTypes((prevRMTypes) =>
        prevRMTypes.filter((RMType) => RMType.id !== selectedRMType.id)
      );
      setBlockedRMTypes((prevBlocked) => [...prevBlocked, { ...selectedRMType, isBlocked: true }]);
      setSuccessMessage(`RMType  blocked successfully!`);

      setSelectedRMType(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking RMType:', error);
      setErrorMessage('Error blocking RMType.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (RMType: any) => {
    setSelectedRMType(RMType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockRMType = async () => {
    if (selectedRMType !== null) {
      try {
        await RMTypeService.unblockRMType(selectedRMType.id);

        setBlockedRMTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedRMType.id));
        setRMTypes((prevRMTypes) => [...prevRMTypes, { ...selectedRMType, isBlocked: false }]);
        setSuccessMessage(`RMType unblocked successfully!`);

        setSelectedRMType(null);
        setConfirmUnblockOpen(false);
        setBlockedRMTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking RMType:', error);
        setErrorMessage('Error unblocking RMType.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setRMTypeName('');
    setRMTypeCode('');
    setEditingRMType(null);
    setDialogOpen(true);
  };

  const toggleBlockedRMTypes = () => {
    setBlockedRMTypesDialogOpen(true);
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
          <h6 className='allheading'>RMType </h6>
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
              onClick={toggleBlockedRMTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={RMTypes.length > 0 || blockedRMTypes.length > 0}>
          {RMTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active RMTypes available. Please add a new RMType.
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
                    {RMTypes.map((RMType: any,index: number) => (
                      <TableRow key={RMType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{RMType.name}</TableCell>
                        <TableCell className="small-cell">{RMType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(RMType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(RMType)} style={{ padding: '1px' }}>
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
        {/* Blocked RMTypes Dialog */}
        <Dialog open={blockedRMTypesDialogOpen} onClose={() => setBlockedRMTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked RMTypes</DialogTitle>
          <DialogContent>
            {blockedRMTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked RMTypes available.</Typography>
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
                  {blockedRMTypes.map((RMType: any,index:number) => (
                    <TableRow key={RMType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{RMType.name}</TableCell>
                      <TableCell className="small-cell">{RMType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(RMType)}>
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
            <Button onClick={() => setBlockedRMTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedRMType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the RMType "{selectedRMType.name}" (Code: {selectedRMType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockRMType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedRMType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the RMType "{selectedRMType.name}" (Code: {selectedRMType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockRMType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* RMType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingRMType !== null ? 'Edit RMType' : 'Add RMType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="RMType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={RMTypeName}
                onChange={(e) => setRMTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="RMType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={RMTypeCode}
                onChange={(e) => setRMTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingRMType !== null ? 'Update' : 'Add'}
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

export default RMType;
