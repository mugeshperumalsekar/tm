
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
import PEPApiService from '../../data/services/customer/pep/pep_api_service';

const PEP: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [PEPName, setPEPName] = useState('');
  const [PEPCode, setPEPCode] = useState('');
  const [PEPs, setPEPs] = useState<any[]>([]);
  const [blockedPEPs, setBlockedPEPs] = useState<any[]>([]);
  const [editingPEP, setEditingPEP] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedPEP, setSelectedPEP] = useState<any | null>(null);
  const [blockedPEPsDialogOpen, setBlockedPEPsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const PEPService = new PEPApiService();

  useEffect(() => {
    fetchPEPs();
    fetchBlockedPEPs()
  }, []);

  const fetchPEPs = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const PEP = await PEPService.getPEP();
      const activePEPs = PEP.filter((c: any) => !c.isBlocked);
      setPEPs(activePEPs);
    } catch (error) {
      console.error('Error fetching PEPs:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedPEPs = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await PEPService.getDeactivePEP();
      setBlockedPEPs(response);
    } catch (error) {
      console.error('Error fetching blocked PEPs:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: PEPName, code: PEPCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingPEP !== null) {
        await PEPService.updatePEP(editingPEP, payload);
        setEditingPEP(null);
        setSuccessMessage('PEP updated successfully!');

      } else {
        await PEPService.CreatePEP(payload);
        setSuccessMessage('PEP added successfully!');

      }

      setOpenSnackbar(true);

      setPEPName('');
      setPEPCode('');
      setDialogOpen(false);
      fetchPEPs();
    } catch (error) {
      console.error('Error saving PEP:', error);
      setErrorMessage('Error saving PEP.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (PEP: any) => {
    setPEPName(PEP.name);
    setPEPCode(PEP.code);
    setEditingPEP(PEP.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (PEP: any) => {
    setSelectedPEP(PEP);
    setConfirmBlockOpen(true);
  };

  const handleBlockPEP = async () => {
    if (selectedPEP !== null) {
      try {
      await PEPService.blockPEP(selectedPEP.id);
      setPEPs((prevPEPs) =>
        prevPEPs.filter((PEP) => PEP.id !== selectedPEP.id)
      );
      setBlockedPEPs((prevBlocked) => [...prevBlocked, { ...selectedPEP, isBlocked: true }]);
      setSuccessMessage(`PEP  blocked successfully!`);

      setSelectedPEP(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking PEP:', error);
      setErrorMessage('Error blocking PEP.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (PEP: any) => {
    setSelectedPEP(PEP);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockPEP = async () => {
    if (selectedPEP !== null) {
      try {
        await PEPService.unblockPEP(selectedPEP.id);

        setBlockedPEPs((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedPEP.id));
        setPEPs((prevPEPs) => [...prevPEPs, { ...selectedPEP, isBlocked: false }]);
        setSuccessMessage(`PEP unblocked successfully!`);

        setSelectedPEP(null);
        setConfirmUnblockOpen(false);
        setBlockedPEPsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking PEP:', error);
        setErrorMessage('Error unblocking PEP.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setPEPName('');
    setPEPCode('');
    setEditingPEP(null);
    setDialogOpen(true);
  };

  const toggleBlockedPEPs = () => {
    setBlockedPEPsDialogOpen(true);
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
          <h6 className='allheading'>PEP </h6>
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
              onClick={toggleBlockedPEPs}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={PEPs.length > 0 || blockedPEPs.length > 0}>
          {PEPs.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active PEPs available. Please add a new PEP.
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
                    {PEPs.map((PEP: any,index: number) => (
                      <TableRow key={PEP.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{PEP.name}</TableCell>
                        <TableCell className="small-cell">{PEP.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(PEP)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(PEP)} style={{ padding: '1px' }}>
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
        {/* Blocked PEPs Dialog */}
        <Dialog open={blockedPEPsDialogOpen} onClose={() => setBlockedPEPsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked PEPs</DialogTitle>
          <DialogContent>
            {blockedPEPs.length === 0 ? (
              <Typography className='confirmation-text'>No blocked PEPs available.</Typography>
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
                  {blockedPEPs.map((PEP: any,index:number) => (
                    <TableRow key={PEP.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{PEP.name}</TableCell>
                      <TableCell className="small-cell">{PEP.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(PEP)}>
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
            <Button onClick={() => setBlockedPEPsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedPEP && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the PEP "{selectedPEP.name}" (Code: {selectedPEP.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockPEP} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedPEP && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the PEP "{selectedPEP.name}" (Code: {selectedPEP.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockPEP} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* PEP Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingPEP !== null ? 'Edit PEP' : 'Add PEP'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="PEP Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={PEPName}
                onChange={(e) => setPEPName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="PEP Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={PEPCode}
                onChange={(e) => setPEPCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingPEP !== null ? 'Update' : 'Add'}
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

export default PEP;
