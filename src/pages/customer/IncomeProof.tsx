
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
import IncomeProofApiService from '../../data/services/customer/incomeProof/incomeproof_api_service';

const IncomeProof: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [IncomeProofName, setIncomeProofName] = useState('');
  const [IncomeProofCode, setIncomeProofCode] = useState('');
  const [IncomeProofs, setIncomeProofs] = useState<any[]>([]);
  const [blockedIncomeProofs, setBlockedIncomeProofs] = useState<any[]>([]);
  const [editingIncomeProof, setEditingIncomeProof] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedIncomeProof, setSelectedIncomeProof] = useState<any | null>(null);
  const [blockedIncomeProofsDialogOpen, setBlockedIncomeProofsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const IncomeProofService = new IncomeProofApiService();

  useEffect(() => {
    fetchIncomeProofs();
    fetchBlockedIncomeProofs()
  }, []);

  const fetchIncomeProofs = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const IncomeProof = await IncomeProofService.getIncomeProof();
      const activeIncomeProofs = IncomeProof.filter((c: any) => !c.isBlocked);
      setIncomeProofs(activeIncomeProofs);
    } catch (error) {
      console.error('Error fetching IncomeProofs:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedIncomeProofs = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await IncomeProofService.getDeactiveIncomeProof();
      setBlockedIncomeProofs(response);
    } catch (error) {
      console.error('Error fetching blocked IncomeProofs:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: IncomeProofName, code: IncomeProofCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingIncomeProof !== null) {
        await IncomeProofService.updateIncomeProof(editingIncomeProof, payload);
        setEditingIncomeProof(null);
        setSuccessMessage('IncomeProof updated successfully!');

      } else {
        await IncomeProofService.CreateIncomeProof(payload);
        setSuccessMessage('IncomeProof added successfully!');

      }

      setOpenSnackbar(true);

      setIncomeProofName('');
      setIncomeProofCode('');
      setDialogOpen(false);
      fetchIncomeProofs();
    } catch (error) {
      console.error('Error saving IncomeProof:', error);
      setErrorMessage('Error saving IncomeProof.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (IncomeProof: any) => {
    setIncomeProofName(IncomeProof.name);
    setIncomeProofCode(IncomeProof.code);
    setEditingIncomeProof(IncomeProof.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (IncomeProof: any) => {
    setSelectedIncomeProof(IncomeProof);
    setConfirmBlockOpen(true);
  };

  const handleBlockIncomeProof = async () => {
    if (selectedIncomeProof !== null) {
      try {
      await IncomeProofService.blockIncomeProof(selectedIncomeProof.id);
      setIncomeProofs((prevIncomeProofs) =>
        prevIncomeProofs.filter((IncomeProof) => IncomeProof.id !== selectedIncomeProof.id)
      );
      setBlockedIncomeProofs((prevBlocked) => [...prevBlocked, { ...selectedIncomeProof, isBlocked: true }]);
      setSuccessMessage(`IncomeProof  blocked successfully!`);

      setSelectedIncomeProof(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking IncomeProof:', error);
      setErrorMessage('Error blocking IncomeProof.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (IncomeProof: any) => {
    setSelectedIncomeProof(IncomeProof);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockIncomeProof = async () => {
    if (selectedIncomeProof !== null) {
      try {
        await IncomeProofService.unblockIncomeProof(selectedIncomeProof.id);

        setBlockedIncomeProofs((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedIncomeProof.id));
        setIncomeProofs((prevIncomeProofs) => [...prevIncomeProofs, { ...selectedIncomeProof, isBlocked: false }]);
        setSuccessMessage(`IncomeProof unblocked successfully!`);

        setSelectedIncomeProof(null);
        setConfirmUnblockOpen(false);
        setBlockedIncomeProofsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking IncomeProof:', error);
        setErrorMessage('Error unblocking IncomeProof.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setIncomeProofName('');
    setIncomeProofCode('');
    setEditingIncomeProof(null);
    setDialogOpen(true);
  };

  const toggleBlockedIncomeProofs = () => {
    setBlockedIncomeProofsDialogOpen(true);
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
          <h6 className='allheading'>IncomeProof </h6>
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
              onClick={toggleBlockedIncomeProofs}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={IncomeProofs.length > 0 || blockedIncomeProofs.length > 0}>
          {IncomeProofs.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active IncomeProofs available. Please add a new IncomeProof.
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
                    {IncomeProofs.map((IncomeProof: any,index: number) => (
                      <TableRow key={IncomeProof.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{IncomeProof.name}</TableCell>
                        <TableCell className="small-cell">{IncomeProof.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(IncomeProof)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(IncomeProof)} style={{ padding: '1px' }}>
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
        {/* Blocked IncomeProofs Dialog */}
        <Dialog open={blockedIncomeProofsDialogOpen} onClose={() => setBlockedIncomeProofsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked IncomeProofs</DialogTitle>
          <DialogContent>
            {blockedIncomeProofs.length === 0 ? (
              <Typography className='confirmation-text'>No blocked IncomeProofs available.</Typography>
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
                  {blockedIncomeProofs.map((IncomeProof: any,index:number) => (
                    <TableRow key={IncomeProof.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{IncomeProof.name}</TableCell>
                      <TableCell className="small-cell">{IncomeProof.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(IncomeProof)}>
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
            <Button onClick={() => setBlockedIncomeProofsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedIncomeProof && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the IncomeProof "{selectedIncomeProof.name}" (Code: {selectedIncomeProof.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockIncomeProof} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedIncomeProof && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the IncomeProof "{selectedIncomeProof.name}" (Code: {selectedIncomeProof.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockIncomeProof} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* IncomeProof Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingIncomeProof !== null ? 'Edit IncomeProof' : 'Add IncomeProof'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="IncomeProof Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={IncomeProofName}
                onChange={(e) => setIncomeProofName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="IncomeProof Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={IncomeProofCode}
                onChange={(e) => setIncomeProofCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingIncomeProof !== null ? 'Update' : 'Add'}
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

export default IncomeProof;
