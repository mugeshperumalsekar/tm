
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
import ReputationClassificationApiService from '../../data/services/customer/reputationClassification/reputationClassification_api_service';

const ReputationClassification: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ReputationClassificationName, setReputationClassificationName] = useState('');
  const [ReputationClassificationCode, setReputationClassificationCode] = useState('');
  const [ReputationClassifications, setReputationClassifications] = useState<any[]>([]);
  const [blockedReputationClassifications, setBlockedReputationClassifications] = useState<any[]>([]);
  const [editingReputationClassification, setEditingReputationClassification] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedReputationClassification, setSelectedReputationClassification] = useState<any | null>(null);
  const [blockedReputationClassificationsDialogOpen, setBlockedReputationClassificationsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ReputationClassificationService = new ReputationClassificationApiService();

  useEffect(() => {
    fetchReputationClassifications();
    fetchBlockedReputationClassifications()
  }, []);

  const fetchReputationClassifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ReputationClassification = await ReputationClassificationService.getReputationClassification();
      const activeReputationClassifications = ReputationClassification.filter((c: any) => !c.isBlocked);
      setReputationClassifications(activeReputationClassifications);
    } catch (error) {
      console.error('Error fetching ReputationClassifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedReputationClassifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ReputationClassificationService.getDeactiveReputationClassification();
      setBlockedReputationClassifications(response);
    } catch (error) {
      console.error('Error fetching blocked ReputationClassifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ReputationClassificationName, code: ReputationClassificationCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingReputationClassification !== null) {
        await ReputationClassificationService.updateReputationClassification(editingReputationClassification, payload);
        setEditingReputationClassification(null);
        setSuccessMessage('ReputationClassification updated successfully!');

      } else {
        await ReputationClassificationService.CreateReputationClassification(payload);
        setSuccessMessage('ReputationClassification added successfully!');

      }

      setOpenSnackbar(true);

      setReputationClassificationName('');
      setReputationClassificationCode('');
      setDialogOpen(false);
      fetchReputationClassifications();
    } catch (error) {
      console.error('Error saving ReputationClassification:', error);
      setErrorMessage('Error saving ReputationClassification.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ReputationClassification: any) => {
    setReputationClassificationName(ReputationClassification.name);
    setReputationClassificationCode(ReputationClassification.code);
    setEditingReputationClassification(ReputationClassification.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ReputationClassification: any) => {
    setSelectedReputationClassification(ReputationClassification);
    setConfirmBlockOpen(true);
  };

  const handleBlockReputationClassification = async () => {
    if (selectedReputationClassification !== null) {
      try {
      await ReputationClassificationService.blockReputationClassification(selectedReputationClassification.id);
      setReputationClassifications((prevReputationClassifications) =>
        prevReputationClassifications.filter((ReputationClassification) => ReputationClassification.id !== selectedReputationClassification.id)
      );
      setBlockedReputationClassifications((prevBlocked) => [...prevBlocked, { ...selectedReputationClassification, isBlocked: true }]);
      setSuccessMessage(`ReputationClassification  blocked successfully!`);

      setSelectedReputationClassification(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking ReputationClassification:', error);
      setErrorMessage('Error blocking ReputationClassification.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (ReputationClassification: any) => {
    setSelectedReputationClassification(ReputationClassification);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockReputationClassification = async () => {
    if (selectedReputationClassification !== null) {
      try {
        await ReputationClassificationService.unblockReputationClassification(selectedReputationClassification.id);

        setBlockedReputationClassifications((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedReputationClassification.id));
        setReputationClassifications((prevReputationClassifications) => [...prevReputationClassifications, { ...selectedReputationClassification, isBlocked: false }]);
        setSuccessMessage(`ReputationClassification unblocked successfully!`);

        setSelectedReputationClassification(null);
        setConfirmUnblockOpen(false);
        setBlockedReputationClassificationsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking ReputationClassification:', error);
        setErrorMessage('Error unblocking ReputationClassification.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setReputationClassificationName('');
    setReputationClassificationCode('');
    setEditingReputationClassification(null);
    setDialogOpen(true);
  };

  const toggleBlockedReputationClassifications = () => {
    setBlockedReputationClassificationsDialogOpen(true);
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
          <h6 className='allheading'>ReputationClassification </h6>
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
              onClick={toggleBlockedReputationClassifications}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={ReputationClassifications.length > 0 || blockedReputationClassifications.length > 0}>
          {ReputationClassifications.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active ReputationClassifications available. Please add a new ReputationClassification.
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
                    {ReputationClassifications.map((ReputationClassification: any,index: number) => (
                      <TableRow key={ReputationClassification.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{ReputationClassification.name}</TableCell>
                        <TableCell className="small-cell">{ReputationClassification.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ReputationClassification)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ReputationClassification)} style={{ padding: '1px' }}>
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
        {/* Blocked ReputationClassifications Dialog */}
        <Dialog open={blockedReputationClassificationsDialogOpen} onClose={() => setBlockedReputationClassificationsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ReputationClassifications</DialogTitle>
          <DialogContent>
            {blockedReputationClassifications.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ReputationClassifications available.</Typography>
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
                  {blockedReputationClassifications.map((ReputationClassification: any,index:number) => (
                    <TableRow key={ReputationClassification.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{ReputationClassification.name}</TableCell>
                      <TableCell className="small-cell">{ReputationClassification.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ReputationClassification)}>
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
            <Button onClick={() => setBlockedReputationClassificationsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedReputationClassification && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ReputationClassification "{selectedReputationClassification.name}" (Code: {selectedReputationClassification.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockReputationClassification} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedReputationClassification && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ReputationClassification "{selectedReputationClassification.name}" (Code: {selectedReputationClassification.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockReputationClassification} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ReputationClassification Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingReputationClassification !== null ? 'Edit ReputationClassification' : 'Add ReputationClassification'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ReputationClassification Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ReputationClassificationName}
                onChange={(e) => setReputationClassificationName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ReputationClassification Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ReputationClassificationCode}
                onChange={(e) => setReputationClassificationCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingReputationClassification !== null ? 'Update' : 'Add'}
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

export default ReputationClassification;
