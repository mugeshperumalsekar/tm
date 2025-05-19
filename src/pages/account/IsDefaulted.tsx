
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
import IsDefaultedApiService from '../../data/services/account/isDefaulted/isDefaulted_api_service';

const IsDefaulted: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [IsDefaultedName, setIsDefaultedName] = useState('');
  const [IsDefaultedCode, setIsDefaultedCode] = useState('');
  const [IsDefaulteds, setIsDefaulteds] = useState<any[]>([]);
  const [blockedIsDefaulteds, setBlockedIsDefaulteds] = useState<any[]>([]);
  const [editingIsDefaulted, setEditingIsDefaulted] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedIsDefaulted, setSelectedIsDefaulted] = useState<any | null>(null);
  const [blockedIsDefaultedsDialogOpen, setBlockedIsDefaultedsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const IsDefaultedService = new IsDefaultedApiService();

  useEffect(() => {
    fetchIsDefaulteds();
    fetchBlockedIsDefaulteds()
  }, []);

  const fetchIsDefaulteds = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const IsDefaulted = await IsDefaultedService.getIsDefaulted();
      const activeIsDefaulteds = IsDefaulted.filter((c: any) => !c.isBlocked);
      setIsDefaulteds(activeIsDefaulteds);
    } catch (error) {
      console.error('Error fetching IsDefaulteds:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchBlockedIsDefaulteds = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await IsDefaultedService.getDeactiveIsDefaulted();
      setBlockedIsDefaulteds(response);
    } catch (error) {
      console.error('Error fetching blocked IsDefaulteds:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: IsDefaultedName, code: IsDefaultedCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingIsDefaulted !== null) {
        await IsDefaultedService.updateIsDefaulted(editingIsDefaulted, payload);
        setEditingIsDefaulted(null);
        setSuccessMessage('IsDefaulted updated successfully!');

      } else {
        await IsDefaultedService.CreateIsDefaulted(payload);
        setSuccessMessage('IsDefaulted added successfully!');

      }

      setOpenSnackbar(true);

      setIsDefaultedName('');
      setIsDefaultedCode('');
      setDialogOpen(false);
      fetchIsDefaulteds();
    } catch (error) {
      console.error('Error saving IsDefaulted:', error);
      setErrorMessage('Error saving IsDefaulted.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (IsDefaulted: any) => {
    setIsDefaultedName(IsDefaulted.name);
    setIsDefaultedCode(IsDefaulted.code);
    setEditingIsDefaulted(IsDefaulted.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (IsDefaulted: any) => {
    setSelectedIsDefaulted(IsDefaulted);
    setConfirmBlockOpen(true);
  };

  const handleBlockIsDefaulted = async () => {
    if (selectedIsDefaulted !== null) {
      try {
      await IsDefaultedService.blockIsDefaulted(selectedIsDefaulted.id);
      setIsDefaulteds((prevIsDefaulteds) =>
        prevIsDefaulteds.filter((IsDefaulted) => IsDefaulted.id !== selectedIsDefaulted.id)
      );
      setBlockedIsDefaulteds((prevBlocked) => [...prevBlocked, { ...selectedIsDefaulted, isBlocked: true }]);
      setSuccessMessage(`IsDefaulted  blocked successfully!`);

      setSelectedIsDefaulted(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking IsDefaulted:', error);
      setErrorMessage('Error blocking IsDefaulted.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (IsDefaulted: any) => {
    setSelectedIsDefaulted(IsDefaulted);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockIsDefaulted = async () => {
    if (selectedIsDefaulted !== null) {
      try {
        await IsDefaultedService.unblockIsDefaulted(selectedIsDefaulted.id);

        setBlockedIsDefaulteds((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedIsDefaulted.id));
        setIsDefaulteds((prevIsDefaulteds) => [...prevIsDefaulteds, { ...selectedIsDefaulted, isBlocked: false }]);
        setSuccessMessage(`IsDefaulted unblocked successfully!`);

        setSelectedIsDefaulted(null);
        setConfirmUnblockOpen(false);
        setBlockedIsDefaultedsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking IsDefaulted:', error);
        setErrorMessage('Error unblocking IsDefaulted.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setIsDefaultedName('');
    setIsDefaultedCode('');
    setEditingIsDefaulted(null);
    setDialogOpen(true);
  };

  const toggleBlockedIsDefaulteds = () => {
    setBlockedIsDefaultedsDialogOpen(true);
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
          <h6 className='allheading'>IsDefaulted </h6>
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
              onClick={toggleBlockedIsDefaulteds}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={IsDefaulteds.length > 0 || blockedIsDefaulteds.length > 0}>
          {IsDefaulteds.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active IsDefaulteds available. Please add a new IsDefaulted.
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
                    {IsDefaulteds.map((IsDefaulted: any,index: number) => (
                      <TableRow key={IsDefaulted.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{IsDefaulted.name}</TableCell>
                        <TableCell className="small-cell">{IsDefaulted.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(IsDefaulted)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(IsDefaulted)} style={{ padding: '1px' }}>
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
        {/* Blocked IsDefaulteds Dialog */}
        <Dialog open={blockedIsDefaultedsDialogOpen} onClose={() => setBlockedIsDefaultedsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked IsDefaulteds</DialogTitle>
          <DialogContent>
            {blockedIsDefaulteds.length === 0 ? (
              <Typography className='confirmation-text'>No blocked IsDefaulteds available.</Typography>
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
                  {blockedIsDefaulteds.map((IsDefaulted: any,index:number) => (
                    <TableRow key={IsDefaulted.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{IsDefaulted.name}</TableCell>
                      <TableCell className="small-cell">{IsDefaulted.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(IsDefaulted)}>
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
            <Button onClick={() => setBlockedIsDefaultedsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedIsDefaulted && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the IsDefaulted "{selectedIsDefaulted.name}" (Code: {selectedIsDefaulted.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockIsDefaulted} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedIsDefaulted && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the IsDefaulted "{selectedIsDefaulted.name}" (Code: {selectedIsDefaulted.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockIsDefaulted} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* IsDefaulted Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingIsDefaulted !== null ? 'Edit IsDefaulted' : 'Add IsDefaulted'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="IsDefaulted Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={IsDefaultedName}
                onChange={(e) => setIsDefaultedName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="IsDefaulted Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={IsDefaultedCode}
                onChange={(e) => setIsDefaultedCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingIsDefaulted !== null ? 'Update' : 'Add'}
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

export default IsDefaulted;
