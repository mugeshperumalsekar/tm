
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
import ProofOfIDSubmittedApiService from '../../data/services/customer/proofOfIDSubmitted/proofOfIDSubmitted_api_service';

const ProofOfIDSubmitted: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ProofOfIDSubmittedName, setProofOfIDSubmittedName] = useState('');
  const [ProofOfIDSubmittedCode, setProofOfIDSubmittedCode] = useState('');
  const [ProofOfIDSubmitteds, setProofOfIDSubmitteds] = useState<any[]>([]);
  const [blockedProofOfIDSubmitteds, setBlockedProofOfIDSubmitteds] = useState<any[]>([]);
  const [editingProofOfIDSubmitted, setEditingProofOfIDSubmitted] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedProofOfIDSubmitted, setSelectedProofOfIDSubmitted] = useState<any | null>(null);
  const [blockedProofOfIDSubmittedsDialogOpen, setBlockedProofOfIDSubmittedsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ProofOfIDSubmittedService = new ProofOfIDSubmittedApiService();

  useEffect(() => {
    fetchProofOfIDSubmitteds();
    fetchBlockedProofOfIDSubmitteds()
  }, []);

  const fetchProofOfIDSubmitteds = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ProofOfIDSubmitted = await ProofOfIDSubmittedService.getProofOfIDSubmitted();
      const activeProofOfIDSubmitteds = ProofOfIDSubmitted.filter((c: any) => !c.isBlocked);
      setProofOfIDSubmitteds(activeProofOfIDSubmitteds);
    } catch (error) {
      console.error('Error fetching ProofOfIDSubmitteds:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedProofOfIDSubmitteds = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ProofOfIDSubmittedService.getDeactiveProofOfIDSubmitted();
      setBlockedProofOfIDSubmitteds(response);
    } catch (error) {
      console.error('Error fetching blocked ProofOfIDSubmitteds:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ProofOfIDSubmittedName, code: ProofOfIDSubmittedCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingProofOfIDSubmitted !== null) {
        await ProofOfIDSubmittedService.updateProofOfIDSubmitted(editingProofOfIDSubmitted, payload);
        setEditingProofOfIDSubmitted(null);
        setSuccessMessage('ProofOfIDSubmitted updated successfully!');

      } else {
        await ProofOfIDSubmittedService.CreateProofOfIDSubmitted(payload);
        setSuccessMessage('ProofOfIDSubmitted added successfully!');

      }

      setOpenSnackbar(true);

      setProofOfIDSubmittedName('');
      setProofOfIDSubmittedCode('');
      setDialogOpen(false);
      fetchProofOfIDSubmitteds();
    } catch (error) {
      console.error('Error saving ProofOfIDSubmitted:', error);
      setErrorMessage('Error saving ProofOfIDSubmitted.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ProofOfIDSubmitted: any) => {
    setProofOfIDSubmittedName(ProofOfIDSubmitted.name);
    setProofOfIDSubmittedCode(ProofOfIDSubmitted.code);
    setEditingProofOfIDSubmitted(ProofOfIDSubmitted.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ProofOfIDSubmitted: any) => {
    setSelectedProofOfIDSubmitted(ProofOfIDSubmitted);
    setConfirmBlockOpen(true);
  };

  const handleBlockProofOfIDSubmitted = async () => {
    if (selectedProofOfIDSubmitted !== null) {
      try {
      await ProofOfIDSubmittedService.blockProofOfIDSubmitted(selectedProofOfIDSubmitted.id);
      setProofOfIDSubmitteds((prevProofOfIDSubmitteds) =>
        prevProofOfIDSubmitteds.filter((ProofOfIDSubmitted) => ProofOfIDSubmitted.id !== selectedProofOfIDSubmitted.id)
      );
      setBlockedProofOfIDSubmitteds((prevBlocked) => [...prevBlocked, { ...selectedProofOfIDSubmitted, isBlocked: true }]);
      setSuccessMessage(`ProofOfIDSubmitted  blocked successfully!`);

      setSelectedProofOfIDSubmitted(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking ProofOfIDSubmitted:', error);
      setErrorMessage('Error blocking ProofOfIDSubmitted.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (ProofOfIDSubmitted: any) => {
    setSelectedProofOfIDSubmitted(ProofOfIDSubmitted);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockProofOfIDSubmitted = async () => {
    if (selectedProofOfIDSubmitted !== null) {
      try {
        await ProofOfIDSubmittedService.unblockProofOfIDSubmitted(selectedProofOfIDSubmitted.id);

        setBlockedProofOfIDSubmitteds((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedProofOfIDSubmitted.id));
        setProofOfIDSubmitteds((prevProofOfIDSubmitteds) => [...prevProofOfIDSubmitteds, { ...selectedProofOfIDSubmitted, isBlocked: false }]);
        setSuccessMessage(`ProofOfIDSubmitted unblocked successfully!`);

        setSelectedProofOfIDSubmitted(null);
        setConfirmUnblockOpen(false);
        setBlockedProofOfIDSubmittedsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking ProofOfIDSubmitted:', error);
        setErrorMessage('Error unblocking ProofOfIDSubmitted.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setProofOfIDSubmittedName('');
    setProofOfIDSubmittedCode('');
    setEditingProofOfIDSubmitted(null);
    setDialogOpen(true);
  };

  const toggleBlockedProofOfIDSubmitteds = () => {
    setBlockedProofOfIDSubmittedsDialogOpen(true);
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
          <h6 className='allheading'>ProofOfIDSubmitted </h6>
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
              onClick={toggleBlockedProofOfIDSubmitteds}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={ProofOfIDSubmitteds.length > 0 || blockedProofOfIDSubmitteds.length > 0}>
          {ProofOfIDSubmitteds.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active ProofOfIDSubmitteds available. Please add a new ProofOfIDSubmitted.
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
                    {ProofOfIDSubmitteds.map((ProofOfIDSubmitted: any,index: number) => (
                      <TableRow key={ProofOfIDSubmitted.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{ProofOfIDSubmitted.name}</TableCell>
                        <TableCell className="small-cell">{ProofOfIDSubmitted.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ProofOfIDSubmitted)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ProofOfIDSubmitted)} style={{ padding: '1px' }}>
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
        {/* Blocked ProofOfIDSubmitteds Dialog */}
        <Dialog open={blockedProofOfIDSubmittedsDialogOpen} onClose={() => setBlockedProofOfIDSubmittedsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ProofOfIDSubmitteds</DialogTitle>
          <DialogContent>
            {blockedProofOfIDSubmitteds.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ProofOfIDSubmitteds available.</Typography>
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
                  {blockedProofOfIDSubmitteds.map((ProofOfIDSubmitted: any,index:number) => (
                    <TableRow key={ProofOfIDSubmitted.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{ProofOfIDSubmitted.name}</TableCell>
                      <TableCell className="small-cell">{ProofOfIDSubmitted.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ProofOfIDSubmitted)}>
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
            <Button onClick={() => setBlockedProofOfIDSubmittedsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedProofOfIDSubmitted && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ProofOfIDSubmitted "{selectedProofOfIDSubmitted.name}" (Code: {selectedProofOfIDSubmitted.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockProofOfIDSubmitted} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedProofOfIDSubmitted && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ProofOfIDSubmitted "{selectedProofOfIDSubmitted.name}" (Code: {selectedProofOfIDSubmitted.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockProofOfIDSubmitted} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ProofOfIDSubmitted Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingProofOfIDSubmitted !== null ? 'Edit ProofOfIDSubmitted' : 'Add ProofOfIDSubmitted'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ProofOfIDSubmitted Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ProofOfIDSubmittedName}
                onChange={(e) => setProofOfIDSubmittedName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ProofOfIDSubmitted Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ProofOfIDSubmittedCode}
                onChange={(e) => setProofOfIDSubmittedCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingProofOfIDSubmitted !== null ? 'Update' : 'Add'}
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

export default ProofOfIDSubmitted;
