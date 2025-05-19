
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
import PermanentCKYCAddressTypeApiService from '../../data/services/account/permanentCKYCAddressType/permanentCKYCAddressType_api_service';

const PermanentCKYCAddressType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [PermanentCKYCAddressTypeName, setPermanentCKYCAddressTypeName] = useState('');
  const [PermanentCKYCAddressTypeCode, setPermanentCKYCAddressTypeCode] = useState('');
  const [PermanentCKYCAddressTypes, setPermanentCKYCAddressTypes] = useState<any[]>([]);
  const [blockedPermanentCKYCAddressTypes, setBlockedPermanentCKYCAddressTypes] = useState<any[]>([]);
  const [editingPermanentCKYCAddressType, setEditingPermanentCKYCAddressType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedPermanentCKYCAddressType, setSelectedPermanentCKYCAddressType] = useState<any | null>(null);
  const [blockedPermanentCKYCAddressTypesDialogOpen, setBlockedPermanentCKYCAddressTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const PermanentCKYCAddressTypeService = new PermanentCKYCAddressTypeApiService();

  useEffect(() => {
    fetchPermanentCKYCAddressTypes();
    fetchBlockedPermanentCKYCAddressTypes()
  }, []);

  const fetchPermanentCKYCAddressTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const PermanentCKYCAddressType = await PermanentCKYCAddressTypeService.getPermanentCKYCAddressType();
      const activePermanentCKYCAddressTypes = PermanentCKYCAddressType.filter((c: any) => !c.isBlocked);
      setPermanentCKYCAddressTypes(activePermanentCKYCAddressTypes);
    } catch (error) {
      console.error('Error fetching PermanentCKYCAddressTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedPermanentCKYCAddressTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await PermanentCKYCAddressTypeService.getDeactivePermanentCKYCAddressType();
      setBlockedPermanentCKYCAddressTypes(response);
    } catch (error) {
      console.error('Error fetching blocked PermanentCKYCAddressTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: PermanentCKYCAddressTypeName, code: PermanentCKYCAddressTypeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingPermanentCKYCAddressType !== null) {
        await PermanentCKYCAddressTypeService.updatePermanentCKYCAddressType(editingPermanentCKYCAddressType, payload);
        setEditingPermanentCKYCAddressType(null);
        setSuccessMessage('PermanentCKYCAddressType updated successfully!');

      } else {
        await PermanentCKYCAddressTypeService.CreatePermanentCKYCAddressType(payload);
        setSuccessMessage('PermanentCKYCAddressType added successfully!');

      }

      setOpenSnackbar(true);

      setPermanentCKYCAddressTypeName('');
      setPermanentCKYCAddressTypeCode('');
      setDialogOpen(false);
      fetchPermanentCKYCAddressTypes();
    } catch (error) {
      console.error('Error saving PermanentCKYCAddressType:', error);
      setErrorMessage('Error saving PermanentCKYCAddressType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (PermanentCKYCAddressType: any) => {
    setPermanentCKYCAddressTypeName(PermanentCKYCAddressType.name);
    setPermanentCKYCAddressTypeCode(PermanentCKYCAddressType.code);
    setEditingPermanentCKYCAddressType(PermanentCKYCAddressType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (PermanentCKYCAddressType: any) => {
    setSelectedPermanentCKYCAddressType(PermanentCKYCAddressType);
    setConfirmBlockOpen(true);
  };

  const handleBlockPermanentCKYCAddressType = async () => {
    if (selectedPermanentCKYCAddressType !== null) {
      try {
      await PermanentCKYCAddressTypeService.blockPermanentCKYCAddressType(selectedPermanentCKYCAddressType.id);
      setPermanentCKYCAddressTypes((prevPermanentCKYCAddressTypes) =>
        prevPermanentCKYCAddressTypes.filter((PermanentCKYCAddressType) => PermanentCKYCAddressType.id !== selectedPermanentCKYCAddressType.id)
      );
      setBlockedPermanentCKYCAddressTypes((prevBlocked) => [...prevBlocked, { ...selectedPermanentCKYCAddressType, isBlocked: true }]);
      setSuccessMessage(`PermanentCKYCAddressType  blocked successfully!`);

      setSelectedPermanentCKYCAddressType(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking PermanentCKYCAddressType:', error);
      setErrorMessage('Error blocking PermanentCKYCAddressType.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (PermanentCKYCAddressType: any) => {
    setSelectedPermanentCKYCAddressType(PermanentCKYCAddressType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockPermanentCKYCAddressType = async () => {
    if (selectedPermanentCKYCAddressType !== null) {
      try {
        await PermanentCKYCAddressTypeService.unblockPermanentCKYCAddressType(selectedPermanentCKYCAddressType.id);

        setBlockedPermanentCKYCAddressTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedPermanentCKYCAddressType.id));
        setPermanentCKYCAddressTypes((prevPermanentCKYCAddressTypes) => [...prevPermanentCKYCAddressTypes, { ...selectedPermanentCKYCAddressType, isBlocked: false }]);
        setSuccessMessage(`PermanentCKYCAddressType unblocked successfully!`);

        setSelectedPermanentCKYCAddressType(null);
        setConfirmUnblockOpen(false);
        setBlockedPermanentCKYCAddressTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking PermanentCKYCAddressType:', error);
        setErrorMessage('Error unblocking PermanentCKYCAddressType.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setPermanentCKYCAddressTypeName('');
    setPermanentCKYCAddressTypeCode('');
    setEditingPermanentCKYCAddressType(null);
    setDialogOpen(true);
  };

  const toggleBlockedPermanentCKYCAddressTypes = () => {
    setBlockedPermanentCKYCAddressTypesDialogOpen(true);
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
          <h6 className='allheading'>PermanentCKYCAddressType </h6>
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
              onClick={toggleBlockedPermanentCKYCAddressTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={PermanentCKYCAddressTypes.length > 0 || blockedPermanentCKYCAddressTypes.length > 0}>
          {PermanentCKYCAddressTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active PermanentCKYCAddressTypes available. Please add a new PermanentCKYCAddressType.
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
                    {PermanentCKYCAddressTypes.map((PermanentCKYCAddressType: any,index: number) => (
                      <TableRow key={PermanentCKYCAddressType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{PermanentCKYCAddressType.name}</TableCell>
                        <TableCell className="small-cell">{PermanentCKYCAddressType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(PermanentCKYCAddressType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(PermanentCKYCAddressType)} style={{ padding: '1px' }}>
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
        {/* Blocked PermanentCKYCAddressTypes Dialog */}
        <Dialog open={blockedPermanentCKYCAddressTypesDialogOpen} onClose={() => setBlockedPermanentCKYCAddressTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked PermanentCKYCAddressTypes</DialogTitle>
          <DialogContent>
            {blockedPermanentCKYCAddressTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked PermanentCKYCAddressTypes available.</Typography>
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
                  {blockedPermanentCKYCAddressTypes.map((PermanentCKYCAddressType: any,index:number) => (
                    <TableRow key={PermanentCKYCAddressType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{PermanentCKYCAddressType.name}</TableCell>
                      <TableCell className="small-cell">{PermanentCKYCAddressType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(PermanentCKYCAddressType)}>
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
            <Button onClick={() => setBlockedPermanentCKYCAddressTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedPermanentCKYCAddressType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the PermanentCKYCAddressType "{selectedPermanentCKYCAddressType.name}" (Code: {selectedPermanentCKYCAddressType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockPermanentCKYCAddressType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedPermanentCKYCAddressType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the PermanentCKYCAddressType "{selectedPermanentCKYCAddressType.name}" (Code: {selectedPermanentCKYCAddressType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockPermanentCKYCAddressType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* PermanentCKYCAddressType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingPermanentCKYCAddressType !== null ? 'Edit PermanentCKYCAddressType' : 'Add PermanentCKYCAddressType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="PermanentCKYCAddressType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={PermanentCKYCAddressTypeName}
                onChange={(e) => setPermanentCKYCAddressTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="PermanentCKYCAddressType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={PermanentCKYCAddressTypeCode}
                onChange={(e) => setPermanentCKYCAddressTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingPermanentCKYCAddressType !== null ? 'Update' : 'Add'}
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

export default PermanentCKYCAddressType;
