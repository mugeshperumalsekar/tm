
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
import LendingArrangementApiService from '../../data/services/account/lendingArrangement/lendingArrangement_api_service';

const LendingArrangement: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [LendingArrangementName, setLendingArrangementName] = useState('');
  const [LendingArrangementCode, setLendingArrangementCode] = useState('');
  const [LendingArrangements, setLendingArrangements] = useState<any[]>([]);
  const [blockedLendingArrangements, setBlockedLendingArrangements] = useState<any[]>([]);
  const [editingLendingArrangement, setEditingLendingArrangement] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedLendingArrangement, setSelectedLendingArrangement] = useState<any | null>(null);
  const [blockedLendingArrangementsDialogOpen, setBlockedLendingArrangementsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const LendingArrangementService = new LendingArrangementApiService();

  useEffect(() => {
    fetchLendingArrangements();
    fetchBlockedLendingArrangements()
  }, []);

  const fetchLendingArrangements = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const LendingArrangement = await LendingArrangementService.getLendingArrangement();
      const activeLendingArrangements = LendingArrangement.filter((c: any) => !c.isBlocked);
      setLendingArrangements(activeLendingArrangements);
    } catch (error) {
      console.error('Error fetching LendingArrangements:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedLendingArrangements = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await LendingArrangementService.getDeactiveLendingArrangement();
      setBlockedLendingArrangements(response);
    } catch (error) {
      console.error('Error fetching blocked LendingArrangements:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: LendingArrangementName, code: LendingArrangementCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingLendingArrangement !== null) {
        await LendingArrangementService.updateLendingArrangement(editingLendingArrangement, payload);
        setEditingLendingArrangement(null);
        setSuccessMessage('LendingArrangement updated successfully!');

      } else {
        await LendingArrangementService.CreateLendingArrangement(payload);
        setSuccessMessage('LendingArrangement added successfully!');

      }

      setOpenSnackbar(true);

      setLendingArrangementName('');
      setLendingArrangementCode('');
      setDialogOpen(false);
      fetchLendingArrangements();
    } catch (error) {
      console.error('Error saving LendingArrangement:', error);
      setErrorMessage('Error saving LendingArrangement.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (LendingArrangement: any) => {
    setLendingArrangementName(LendingArrangement.name);
    setLendingArrangementCode(LendingArrangement.code);
    setEditingLendingArrangement(LendingArrangement.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (LendingArrangement: any) => {
    setSelectedLendingArrangement(LendingArrangement);
    setConfirmBlockOpen(true);
  };

  const handleBlockLendingArrangement = async () => {
    if (selectedLendingArrangement !== null) {
      try {
      await LendingArrangementService.blockLendingArrangement(selectedLendingArrangement.id);
      setLendingArrangements((prevLendingArrangements) =>
        prevLendingArrangements.filter((LendingArrangement) => LendingArrangement.id !== selectedLendingArrangement.id)
      );
      setBlockedLendingArrangements((prevBlocked) => [...prevBlocked, { ...selectedLendingArrangement, isBlocked: true }]);
      setSuccessMessage(`LendingArrangement  blocked successfully!`);

      setSelectedLendingArrangement(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking LendingArrangement:', error);
      setErrorMessage('Error blocking LendingArrangement.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (LendingArrangement: any) => {
    setSelectedLendingArrangement(LendingArrangement);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockLendingArrangement = async () => {
    if (selectedLendingArrangement !== null) {
      try {
        await LendingArrangementService.unblockLendingArrangement(selectedLendingArrangement.id);

        setBlockedLendingArrangements((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedLendingArrangement.id));
        setLendingArrangements((prevLendingArrangements) => [...prevLendingArrangements, { ...selectedLendingArrangement, isBlocked: false }]);
        setSuccessMessage(`LendingArrangement unblocked successfully!`);

        setSelectedLendingArrangement(null);
        setConfirmUnblockOpen(false);
        setBlockedLendingArrangementsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking LendingArrangement:', error);
        setErrorMessage('Error unblocking LendingArrangement.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setLendingArrangementName('');
    setLendingArrangementCode('');
    setEditingLendingArrangement(null);
    setDialogOpen(true);
  };

  const toggleBlockedLendingArrangements = () => {
    setBlockedLendingArrangementsDialogOpen(true);
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
          <h6 className='allheading'>LendingArrangement </h6>
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
              onClick={toggleBlockedLendingArrangements}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={LendingArrangements.length > 0 || blockedLendingArrangements.length > 0}>
          {LendingArrangements.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active LendingArrangements available. Please add a new LendingArrangement.
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
                    {LendingArrangements.map((LendingArrangement: any,index: number) => (
                      <TableRow key={LendingArrangement.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{LendingArrangement.name}</TableCell>
                        <TableCell className="small-cell">{LendingArrangement.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(LendingArrangement)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(LendingArrangement)} style={{ padding: '1px' }}>
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
        {/* Blocked LendingArrangements Dialog */}
        <Dialog open={blockedLendingArrangementsDialogOpen} onClose={() => setBlockedLendingArrangementsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked LendingArrangements</DialogTitle>
          <DialogContent>
            {blockedLendingArrangements.length === 0 ? (
              <Typography className='confirmation-text'>No blocked LendingArrangements available.</Typography>
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
                  {blockedLendingArrangements.map((LendingArrangement: any,index:number) => (
                    <TableRow key={LendingArrangement.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{LendingArrangement.name}</TableCell>
                      <TableCell className="small-cell">{LendingArrangement.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(LendingArrangement)}>
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
            <Button onClick={() => setBlockedLendingArrangementsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedLendingArrangement && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the LendingArrangement "{selectedLendingArrangement.name}" (Code: {selectedLendingArrangement.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockLendingArrangement} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedLendingArrangement && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the LendingArrangement "{selectedLendingArrangement.name}" (Code: {selectedLendingArrangement.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockLendingArrangement} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* LendingArrangement Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingLendingArrangement !== null ? 'Edit LendingArrangement' : 'Add LendingArrangement'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="LendingArrangement Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={LendingArrangementName}
                onChange={(e) => setLendingArrangementName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="LendingArrangement Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={LendingArrangementCode}
                onChange={(e) => setLendingArrangementCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingLendingArrangement !== null ? 'Update' : 'Add'}
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

export default LendingArrangement;
