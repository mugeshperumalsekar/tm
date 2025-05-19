
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
import NatureOfCreditApiService from '../../data/services/account/natureOfCredit/natureOfCredit_api_service';

const NatureOfCredit: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [NatureOfCreditName, setNatureOfCreditName] = useState('');
  const [NatureOfCreditCode, setNatureOfCreditCode] = useState('');
  const [NatureOfCredits, setNatureOfCredits] = useState<any[]>([]);
  const [blockedNatureOfCredits, setBlockedNatureOfCredits] = useState<any[]>([]);
  const [editingNatureOfCredit, setEditingNatureOfCredit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedNatureOfCredit, setSelectedNatureOfCredit] = useState<any | null>(null);
  const [blockedNatureOfCreditsDialogOpen, setBlockedNatureOfCreditsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const NatureOfCreditService = new NatureOfCreditApiService();

  useEffect(() => {
    fetchNatureOfCredits();
    fetchBlockedNatureOfCredits()
  }, []);

  const fetchNatureOfCredits = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const NatureOfCredit = await NatureOfCreditService.getNatureOfCredit();
      const activeNatureOfCredits = NatureOfCredit.filter((c: any) => !c.isBlocked);
      setNatureOfCredits(activeNatureOfCredits);
    } catch (error) {
      console.error('Error fetching NatureOfCredits:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedNatureOfCredits = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await NatureOfCreditService.getDeactiveNatureOfCredit();
      setBlockedNatureOfCredits(response);
    } catch (error) {
      console.error('Error fetching blocked NatureOfCredits:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: NatureOfCreditName, code: NatureOfCreditCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingNatureOfCredit !== null) {
        await NatureOfCreditService.updateNatureOfCredit(editingNatureOfCredit, payload);
        setEditingNatureOfCredit(null);
        setSuccessMessage('NatureOfCredit updated successfully!');

      } else {
        await NatureOfCreditService.CreateNatureOfCredit(payload);
        setSuccessMessage('NatureOfCredit added successfully!');

      }

      setOpenSnackbar(true);

      setNatureOfCreditName('');
      setNatureOfCreditCode('');
      setDialogOpen(false);
      fetchNatureOfCredits();
    } catch (error) {
      console.error('Error saving NatureOfCredit:', error);
      setErrorMessage('Error saving NatureOfCredit.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (NatureOfCredit: any) => {
    setNatureOfCreditName(NatureOfCredit.name);
    setNatureOfCreditCode(NatureOfCredit.code);
    setEditingNatureOfCredit(NatureOfCredit.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (NatureOfCredit: any) => {
    setSelectedNatureOfCredit(NatureOfCredit);
    setConfirmBlockOpen(true);
  };

  const handleBlockNatureOfCredit = async () => {
    if (selectedNatureOfCredit !== null) {
      try {
      await NatureOfCreditService.blockNatureOfCredit(selectedNatureOfCredit.id);
      setNatureOfCredits((prevNatureOfCredits) =>
        prevNatureOfCredits.filter((NatureOfCredit) => NatureOfCredit.id !== selectedNatureOfCredit.id)
      );
      setBlockedNatureOfCredits((prevBlocked) => [...prevBlocked, { ...selectedNatureOfCredit, isBlocked: true }]);
      setSuccessMessage(`NatureOfCredit  blocked successfully!`);

      setSelectedNatureOfCredit(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking NatureOfCredit:', error);
      setErrorMessage('Error blocking NatureOfCredit.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (NatureOfCredit: any) => {
    setSelectedNatureOfCredit(NatureOfCredit);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockNatureOfCredit = async () => {
    if (selectedNatureOfCredit !== null) {
      try {
        await NatureOfCreditService.unblockNatureOfCredit(selectedNatureOfCredit.id);

        setBlockedNatureOfCredits((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedNatureOfCredit.id));
        setNatureOfCredits((prevNatureOfCredits) => [...prevNatureOfCredits, { ...selectedNatureOfCredit, isBlocked: false }]);
        setSuccessMessage(`NatureOfCredit unblocked successfully!`);

        setSelectedNatureOfCredit(null);
        setConfirmUnblockOpen(false);
        setBlockedNatureOfCreditsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking NatureOfCredit:', error);
        setErrorMessage('Error unblocking NatureOfCredit.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setNatureOfCreditName('');
    setNatureOfCreditCode('');
    setEditingNatureOfCredit(null);
    setDialogOpen(true);
  };

  const toggleBlockedNatureOfCredits = () => {
    setBlockedNatureOfCreditsDialogOpen(true);
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
          <h6 className='allheading'>NatureOfCredit </h6>
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
              onClick={toggleBlockedNatureOfCredits}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={NatureOfCredits.length > 0 || blockedNatureOfCredits.length > 0}>
          {NatureOfCredits.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active NatureOfCredits available. Please add a new NatureOfCredit.
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
                    {NatureOfCredits.map((NatureOfCredit: any,index: number) => (
                      <TableRow key={NatureOfCredit.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{NatureOfCredit.name}</TableCell>
                        <TableCell className="small-cell">{NatureOfCredit.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(NatureOfCredit)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(NatureOfCredit)} style={{ padding: '1px' }}>
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
        {/* Blocked NatureOfCredits Dialog */}
        <Dialog open={blockedNatureOfCreditsDialogOpen} onClose={() => setBlockedNatureOfCreditsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked NatureOfCredits</DialogTitle>
          <DialogContent>
            {blockedNatureOfCredits.length === 0 ? (
              <Typography className='confirmation-text'>No blocked NatureOfCredits available.</Typography>
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
                  {blockedNatureOfCredits.map((NatureOfCredit: any,index:number) => (
                    <TableRow key={NatureOfCredit.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{NatureOfCredit.name}</TableCell>
                      <TableCell className="small-cell">{NatureOfCredit.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(NatureOfCredit)}>
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
            <Button onClick={() => setBlockedNatureOfCreditsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedNatureOfCredit && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the NatureOfCredit "{selectedNatureOfCredit.name}" (Code: {selectedNatureOfCredit.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockNatureOfCredit} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedNatureOfCredit && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the NatureOfCredit "{selectedNatureOfCredit.name}" (Code: {selectedNatureOfCredit.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockNatureOfCredit} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* NatureOfCredit Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingNatureOfCredit !== null ? 'Edit NatureOfCredit' : 'Add NatureOfCredit'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="NatureOfCredit Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={NatureOfCreditName}
                onChange={(e) => setNatureOfCreditName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="NatureOfCredit Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={NatureOfCreditCode}
                onChange={(e) => setNatureOfCreditCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingNatureOfCredit !== null ? 'Update' : 'Add'}
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

export default NatureOfCredit;
