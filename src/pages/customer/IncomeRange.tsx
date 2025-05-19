
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
import IncomeRangeApiService from '../../data/services/customer/incomeRange/incomeRange_api_service';

const IncomeRange: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [IncomeRangeName, setIncomeRangeName] = useState('');
  const [IncomeRangeCode, setIncomeRangeCode] = useState('');
  const [IncomeRanges, setIncomeRanges] = useState<any[]>([]);
  const [blockedIncomeRanges, setBlockedIncomeRanges] = useState<any[]>([]);
  const [editingIncomeRange, setEditingIncomeRange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedIncomeRange, setSelectedIncomeRange] = useState<any | null>(null);
  const [blockedIncomeRangesDialogOpen, setBlockedIncomeRangesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const IncomeRangeService = new IncomeRangeApiService();

  useEffect(() => {
    fetchIncomeRanges();
    fetchBlockedIncomeRanges()
  }, []);

  const fetchIncomeRanges = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const IncomeRange = await IncomeRangeService.getIncomeRange();
      const activeIncomeRanges = IncomeRange.filter((c: any) => !c.isBlocked);
      setIncomeRanges(activeIncomeRanges);
    } catch (error) {
      console.error('Error fetching IncomeRanges:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedIncomeRanges = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await IncomeRangeService.getDeactiveIncomeRange();
      setBlockedIncomeRanges(response);
    } catch (error) {
      console.error('Error fetching blocked IncomeRanges:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: IncomeRangeName, code: IncomeRangeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingIncomeRange !== null) {
        await IncomeRangeService.updateIncomeRange(editingIncomeRange, payload);
        setEditingIncomeRange(null);
        setSuccessMessage('IncomeRange updated successfully!');

      } else {
        await IncomeRangeService.CreateIncomeRange(payload);
        setSuccessMessage('IncomeRange added successfully!');

      }

      setOpenSnackbar(true);

      setIncomeRangeName('');
      setIncomeRangeCode('');
      setDialogOpen(false);
      fetchIncomeRanges();
    } catch (error) {
      console.error('Error saving IncomeRange:', error);
      setErrorMessage('Error saving IncomeRange.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (IncomeRange: any) => {
    setIncomeRangeName(IncomeRange.name);
    setIncomeRangeCode(IncomeRange.code);
    setEditingIncomeRange(IncomeRange.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (IncomeRange: any) => {
    setSelectedIncomeRange(IncomeRange);
    setConfirmBlockOpen(true);
  };

  const handleBlockIncomeRange = async () => {
    if (selectedIncomeRange !== null) {
      try {
      await IncomeRangeService.blockIncomeRange(selectedIncomeRange.id);
      setIncomeRanges((prevIncomeRanges) =>
        prevIncomeRanges.filter((IncomeRange) => IncomeRange.id !== selectedIncomeRange.id)
      );
      setBlockedIncomeRanges((prevBlocked) => [...prevBlocked, { ...selectedIncomeRange, isBlocked: true }]);
      setSuccessMessage(`IncomeRange  blocked successfully!`);

      setSelectedIncomeRange(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking IncomeRange:', error);
      setErrorMessage('Error blocking IncomeRange.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (IncomeRange: any) => {
    setSelectedIncomeRange(IncomeRange);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockIncomeRange = async () => {
    if (selectedIncomeRange !== null) {
      try {
        await IncomeRangeService.unblockIncomeRange(selectedIncomeRange.id);

        setBlockedIncomeRanges((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedIncomeRange.id));
        setIncomeRanges((prevIncomeRanges) => [...prevIncomeRanges, { ...selectedIncomeRange, isBlocked: false }]);
        setSuccessMessage(`IncomeRange unblocked successfully!`);

        setSelectedIncomeRange(null);
        setConfirmUnblockOpen(false);
        setBlockedIncomeRangesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking IncomeRange:', error);
        setErrorMessage('Error unblocking IncomeRange.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setIncomeRangeName('');
    setIncomeRangeCode('');
    setEditingIncomeRange(null);
    setDialogOpen(true);
  };

  const toggleBlockedIncomeRanges = () => {
    setBlockedIncomeRangesDialogOpen(true);
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
          <h6 className='allheading'>IncomeRange </h6>
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
              onClick={toggleBlockedIncomeRanges}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={IncomeRanges.length > 0 || blockedIncomeRanges.length > 0}>
          {IncomeRanges.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active IncomeRanges available. Please add a new IncomeRange.
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
                    {IncomeRanges.map((IncomeRange: any,index: number) => (
                      <TableRow key={IncomeRange.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{IncomeRange.name}</TableCell>
                        <TableCell className="small-cell">{IncomeRange.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(IncomeRange)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(IncomeRange)} style={{ padding: '1px' }}>
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
        {/* Blocked IncomeRanges Dialog */}
        <Dialog open={blockedIncomeRangesDialogOpen} onClose={() => setBlockedIncomeRangesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked IncomeRanges</DialogTitle>
          <DialogContent>
            {blockedIncomeRanges.length === 0 ? (
              <Typography className='confirmation-text'>No blocked IncomeRanges available.</Typography>
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
                  {blockedIncomeRanges.map((IncomeRange: any,index:number) => (
                    <TableRow key={IncomeRange.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{IncomeRange.name}</TableCell>
                      <TableCell className="small-cell">{IncomeRange.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(IncomeRange)}>
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
            <Button onClick={() => setBlockedIncomeRangesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedIncomeRange && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the IncomeRange "{selectedIncomeRange.name}" (Code: {selectedIncomeRange.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockIncomeRange} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedIncomeRange && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the IncomeRange "{selectedIncomeRange.name}" (Code: {selectedIncomeRange.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockIncomeRange} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* IncomeRange Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingIncomeRange !== null ? 'Edit IncomeRange' : 'Add IncomeRange'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="IncomeRange Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={IncomeRangeName}
                onChange={(e) => setIncomeRangeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="IncomeRange Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={IncomeRangeCode}
                onChange={(e) => setIncomeRangeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingIncomeRange !== null ? 'Update' : 'Add'}
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

export default IncomeRange;
