
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
import KYCAttesationApiService from '../../data/services/customer/kycAttesation/kycAttesation_api_service';

const KYCAttesation: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [KYCAttesationName, setKYCAttesationName] = useState('');
  const [KYCAttesationCode, setKYCAttesationCode] = useState('');
  const [KYCAttesations, setKYCAttesations] = useState<any[]>([]);
  const [blockedKYCAttesations, setBlockedKYCAttesations] = useState<any[]>([]);
  const [editingKYCAttesation, setEditingKYCAttesation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedKYCAttesation, setSelectedKYCAttesation] = useState<any | null>(null);
  const [blockedKYCAttesationsDialogOpen, setBlockedKYCAttesationsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const KYCAttesationService = new KYCAttesationApiService();

  useEffect(() => {
    fetchKYCAttesations();
    fetchBlockedKYCAttesations()
  }, []);

  const fetchKYCAttesations = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const KYCAttesation = await KYCAttesationService.getKYCAttesation();
      const activeKYCAttesations = KYCAttesation.filter((c: any) => !c.isBlocked);
      setKYCAttesations(activeKYCAttesations);
    } catch (error) {
      console.error('Error fetching KYCAttesations:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedKYCAttesations = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await KYCAttesationService.getDeactiveKYCAttesation();
      setBlockedKYCAttesations(response);
    } catch (error) {
      console.error('Error fetching blocked KYCAttesations:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: KYCAttesationName, code: KYCAttesationCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingKYCAttesation !== null) {
        await KYCAttesationService.updateKYCAttesation(editingKYCAttesation, payload);
        setEditingKYCAttesation(null);
        setSuccessMessage('KYCAttesation updated successfully!');

      } else {
        await KYCAttesationService.CreateKYCAttesation(payload);
        setSuccessMessage('KYCAttesation added successfully!');

      }

      setOpenSnackbar(true);

      setKYCAttesationName('');
      setKYCAttesationCode('');
      setDialogOpen(false);
      fetchKYCAttesations();
    } catch (error) {
      console.error('Error saving KYCAttesation:', error);
      setErrorMessage('Error saving KYCAttesation.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (KYCAttesation: any) => {
    setKYCAttesationName(KYCAttesation.name);
    setKYCAttesationCode(KYCAttesation.code);
    setEditingKYCAttesation(KYCAttesation.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (KYCAttesation: any) => {
    setSelectedKYCAttesation(KYCAttesation);
    setConfirmBlockOpen(true);
  };

  const handleBlockKYCAttesation = async () => {
    if (selectedKYCAttesation !== null) {
      try {
      await KYCAttesationService.blockKYCAttesation(selectedKYCAttesation.id);
      setKYCAttesations((prevKYCAttesations) =>
        prevKYCAttesations.filter((KYCAttesation) => KYCAttesation.id !== selectedKYCAttesation.id)
      );
      setBlockedKYCAttesations((prevBlocked) => [...prevBlocked, { ...selectedKYCAttesation, isBlocked: true }]);
      setSuccessMessage(`KYCAttesation  blocked successfully!`);

      setSelectedKYCAttesation(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking KYCAttesation:', error);
      setErrorMessage('Error blocking KYCAttesation.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (KYCAttesation: any) => {
    setSelectedKYCAttesation(KYCAttesation);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockKYCAttesation = async () => {
    if (selectedKYCAttesation !== null) {
      try {
        await KYCAttesationService.unblockKYCAttesation(selectedKYCAttesation.id);

        setBlockedKYCAttesations((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedKYCAttesation.id));
        setKYCAttesations((prevKYCAttesations) => [...prevKYCAttesations, { ...selectedKYCAttesation, isBlocked: false }]);
        setSuccessMessage(`KYCAttesation unblocked successfully!`);

        setSelectedKYCAttesation(null);
        setConfirmUnblockOpen(false);
        setBlockedKYCAttesationsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking KYCAttesation:', error);
        setErrorMessage('Error unblocking KYCAttesation.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setKYCAttesationName('');
    setKYCAttesationCode('');
    setEditingKYCAttesation(null);
    setDialogOpen(true);
  };

  const toggleBlockedKYCAttesations = () => {
    setBlockedKYCAttesationsDialogOpen(true);
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
          <h6 className='allheading'>KYCAttesation </h6>
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
              onClick={toggleBlockedKYCAttesations}
            >
              Show Blocked
            </Button>
          </div>

        </Box>

        <Loading isLoading={isLoading} hasError={hasError} hasData={KYCAttesations.length > 0 || blockedKYCAttesations.length > 0}>
          {KYCAttesations.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active KYCAttesations available. Please add a new KYCAttesation.
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
                    {KYCAttesations.map((KYCAttesation: any,index: number) => (
                      <TableRow key={KYCAttesation.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{KYCAttesation.name}</TableCell>
                        <TableCell className="small-cell">{KYCAttesation.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(KYCAttesation)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(KYCAttesation)} style={{ padding: '1px' }}>
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
        {/* Blocked KYCAttesations Dialog */}
        <Dialog open={blockedKYCAttesationsDialogOpen} onClose={() => setBlockedKYCAttesationsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked KYCAttesations</DialogTitle>
          <DialogContent>
            {blockedKYCAttesations.length === 0 ? (
              <Typography className='confirmation-text'>No blocked KYCAttesations available.</Typography>
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
                  {blockedKYCAttesations.map((KYCAttesation: any,index:number) => (
                    <TableRow key={KYCAttesation.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{KYCAttesation.name}</TableCell>
                      <TableCell className="small-cell">{KYCAttesation.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(KYCAttesation)}>
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
            <Button onClick={() => setBlockedKYCAttesationsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedKYCAttesation && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the KYCAttesation "{selectedKYCAttesation.name}" (Code: {selectedKYCAttesation.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockKYCAttesation} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedKYCAttesation && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the KYCAttesation "{selectedKYCAttesation.name}" (Code: {selectedKYCAttesation.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockKYCAttesation} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* KYCAttesation Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingKYCAttesation !== null ? 'Edit KYCAttesation' : 'Add KYCAttesation'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="KYCAttesation Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={KYCAttesationName}
                onChange={(e) => setKYCAttesationName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="KYCAttesation Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={KYCAttesationCode}
                onChange={(e) => setKYCAttesationCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingKYCAttesation !== null ? 'Update' : 'Add'}
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

export default KYCAttesation;
