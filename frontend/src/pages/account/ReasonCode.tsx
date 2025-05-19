
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
import ReasonCodeApiService from '../../data/services/account/reasonCode/reasonCode_api_service';

const ReasonCode: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ReasonCodeName, setReasonCodeName] = useState('');
  const [ReasonCodeCode, setReasonCodeCode] = useState('');
  const [ReasonCodes, setReasonCodes] = useState<any[]>([]);
  const [blockedReasonCodes, setBlockedReasonCodes] = useState<any[]>([]);
  const [editingReasonCode, setEditingReasonCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedReasonCode, setSelectedReasonCode] = useState<any | null>(null);
  const [blockedReasonCodesDialogOpen, setBlockedReasonCodesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ReasonCodeService = new ReasonCodeApiService();

  useEffect(() => {
    fetchReasonCodes();
    fetchBlockedReasonCodes()
  }, []);

  const fetchReasonCodes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ReasonCode = await ReasonCodeService.getReasonCode();
      const activeReasonCodes = ReasonCode.filter((c: any) => !c.isBlocked);
      setReasonCodes(activeReasonCodes);
    } catch (error) {
      console.error('Error fetching ReasonCodes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedReasonCodes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ReasonCodeService.getDeactiveReasonCode();
      setBlockedReasonCodes(response);
    } catch (error) {
      console.error('Error fetching blocked ReasonCodes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ReasonCodeName, code: ReasonCodeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingReasonCode !== null) {
        await ReasonCodeService.updateReasonCode(editingReasonCode, payload);
        setEditingReasonCode(null);
        setSuccessMessage('ReasonCode updated successfully!');

      } else {
        await ReasonCodeService.CreateReasonCode(payload);
        setSuccessMessage('ReasonCode added successfully!');

      }

      setOpenSnackbar(true);

      setReasonCodeName('');
      setReasonCodeCode('');
      setDialogOpen(false);
      fetchReasonCodes();
    } catch (error) {
      console.error('Error saving ReasonCode:', error);
      setErrorMessage('Error saving ReasonCode.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ReasonCode: any) => {
    setReasonCodeName(ReasonCode.name);
    setReasonCodeCode(ReasonCode.code);
    setEditingReasonCode(ReasonCode.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ReasonCode: any) => {
    setSelectedReasonCode(ReasonCode);
    setConfirmBlockOpen(true);
  };

  const handleBlockReasonCode = async () => {
    if (selectedReasonCode !== null) {
      try {
      await ReasonCodeService.blockReasonCode(selectedReasonCode.id);
      setReasonCodes((prevReasonCodes) =>
        prevReasonCodes.filter((ReasonCode) => ReasonCode.id !== selectedReasonCode.id)
      );
      setBlockedReasonCodes((prevBlocked) => [...prevBlocked, { ...selectedReasonCode, isBlocked: true }]);
      setSuccessMessage(`ReasonCode  blocked successfully!`);

      setSelectedReasonCode(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking ReasonCode:', error);
      setErrorMessage('Error blocking ReasonCode.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (ReasonCode: any) => {
    setSelectedReasonCode(ReasonCode);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockReasonCode = async () => {
    if (selectedReasonCode !== null) {
      try {
        await ReasonCodeService.unblockReasonCode(selectedReasonCode.id);

        setBlockedReasonCodes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedReasonCode.id));
        setReasonCodes((prevReasonCodes) => [...prevReasonCodes, { ...selectedReasonCode, isBlocked: false }]);
        setSuccessMessage(`ReasonCode unblocked successfully!`);

        setSelectedReasonCode(null);
        setConfirmUnblockOpen(false);
        setBlockedReasonCodesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking ReasonCode:', error);
        setErrorMessage('Error unblocking ReasonCode.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setReasonCodeName('');
    setReasonCodeCode('');
    setEditingReasonCode(null);
    setDialogOpen(true);
  };

  const toggleBlockedReasonCodes = () => {
    setBlockedReasonCodesDialogOpen(true);
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
          <h6 className='allheading'>ReasonCode </h6>
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
              onClick={toggleBlockedReasonCodes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={ReasonCodes.length > 0 || blockedReasonCodes.length > 0}>
          {ReasonCodes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active ReasonCodes available. Please add a new ReasonCode.
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
                    {ReasonCodes.map((ReasonCode: any,index: number) => (
                      <TableRow key={ReasonCode.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{ReasonCode.name}</TableCell>
                        <TableCell className="small-cell">{ReasonCode.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ReasonCode)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ReasonCode)} style={{ padding: '1px' }}>
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
        {/* Blocked ReasonCodes Dialog */}
        <Dialog open={blockedReasonCodesDialogOpen} onClose={() => setBlockedReasonCodesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ReasonCodes</DialogTitle>
          <DialogContent>
            {blockedReasonCodes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ReasonCodes available.</Typography>
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
                  {blockedReasonCodes.map((ReasonCode: any,index:number) => (
                    <TableRow key={ReasonCode.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{ReasonCode.name}</TableCell>
                      <TableCell className="small-cell">{ReasonCode.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ReasonCode)}>
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
            <Button onClick={() => setBlockedReasonCodesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedReasonCode && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ReasonCode "{selectedReasonCode.name}" (Code: {selectedReasonCode.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockReasonCode} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedReasonCode && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ReasonCode "{selectedReasonCode.name}" (Code: {selectedReasonCode.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockReasonCode} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ReasonCode Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingReasonCode !== null ? 'Edit ReasonCode' : 'Add ReasonCode'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ReasonCode Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ReasonCodeName}
                onChange={(e) => setReasonCodeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ReasonCode Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ReasonCodeCode}
                onChange={(e) => setReasonCodeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingReasonCode !== null ? 'Update' : 'Add'}
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

export default ReasonCode;
