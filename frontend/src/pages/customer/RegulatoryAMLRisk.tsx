

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
import RegulatoryAMLRiskApiService from '../../data/services/customer/regulatoryAMLRisk/regulatoryAMLRisk_api_service';

const RegulatoryAMLRisk: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [RegulatoryAMLRiskName, setRegulatoryAMLRiskName] = useState('');
  const [RegulatoryAMLRiskCode, setRegulatoryAMLRiskCode] = useState('');
  const [RegulatoryAMLRisks, setRegulatoryAMLRisks] = useState<any[]>([]);
  const [blockedRegulatoryAMLRisks, setBlockedRegulatoryAMLRisks] = useState<any[]>([]);
  const [editingRegulatoryAMLRisk, setEditingRegulatoryAMLRisk] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedRegulatoryAMLRisk, setSelectedRegulatoryAMLRisk] = useState<any | null>(null);
  const [blockedRegulatoryAMLRisksDialogOpen, setBlockedRegulatoryAMLRisksDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const RegulatoryAMLRiskService = new RegulatoryAMLRiskApiService();

  useEffect(() => {
    fetchRegulatoryAMLRisks();
    fetchBlockedRegulatoryAMLRisks()
  }, []);

  const fetchRegulatoryAMLRisks = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const RegulatoryAMLRisk = await RegulatoryAMLRiskService.getRegulatoryAMLRisk();
      const activeRegulatoryAMLRisks = RegulatoryAMLRisk.filter((c: any) => !c.isBlocked);
      setRegulatoryAMLRisks(activeRegulatoryAMLRisks);
    } catch (error) {
      console.error('Error fetching RegulatoryAMLRisks:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedRegulatoryAMLRisks = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await RegulatoryAMLRiskService.getDeactiveRegulatoryAMLRisk();
      setBlockedRegulatoryAMLRisks(response);
    } catch (error) {
      console.error('Error fetching blocked RegulatoryAMLRisks:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: RegulatoryAMLRiskName, code: RegulatoryAMLRiskCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingRegulatoryAMLRisk !== null) {
        await RegulatoryAMLRiskService.updateRegulatoryAMLRisk(editingRegulatoryAMLRisk, payload);
        setEditingRegulatoryAMLRisk(null);
        setSuccessMessage('RegulatoryAMLRisk updated successfully!');

      } else {
        await RegulatoryAMLRiskService.CreateRegulatoryAMLRisk(payload);
        setSuccessMessage('RegulatoryAMLRisk added successfully!');

      }

      setOpenSnackbar(true);

      setRegulatoryAMLRiskName('');
      setRegulatoryAMLRiskCode('');
      setDialogOpen(false);
      fetchRegulatoryAMLRisks();
    } catch (error) {
      console.error('Error saving RegulatoryAMLRisk:', error);
      setErrorMessage('Error saving RegulatoryAMLRisk.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (RegulatoryAMLRisk: any) => {
    setRegulatoryAMLRiskName(RegulatoryAMLRisk.name);
    setRegulatoryAMLRiskCode(RegulatoryAMLRisk.code);
    setEditingRegulatoryAMLRisk(RegulatoryAMLRisk.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (RegulatoryAMLRisk: any) => {
    setSelectedRegulatoryAMLRisk(RegulatoryAMLRisk);
    setConfirmBlockOpen(true);
  };

  const handleBlockRegulatoryAMLRisk = async () => {
    if (selectedRegulatoryAMLRisk !== null) {
      try {
      await RegulatoryAMLRiskService.blockRegulatoryAMLRisk(selectedRegulatoryAMLRisk.id);
      setRegulatoryAMLRisks((prevRegulatoryAMLRisks) =>
        prevRegulatoryAMLRisks.filter((RegulatoryAMLRisk) => RegulatoryAMLRisk.id !== selectedRegulatoryAMLRisk.id)
      );
      setBlockedRegulatoryAMLRisks((prevBlocked) => [...prevBlocked, { ...selectedRegulatoryAMLRisk, isBlocked: true }]);
      setSuccessMessage(`RegulatoryAMLRisk  blocked successfully!`);

      setSelectedRegulatoryAMLRisk(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking RegulatoryAMLRisk:', error);
      setErrorMessage('Error blocking RegulatoryAMLRisk.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (RegulatoryAMLRisk: any) => {
    setSelectedRegulatoryAMLRisk(RegulatoryAMLRisk);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockRegulatoryAMLRisk = async () => {
    if (selectedRegulatoryAMLRisk !== null) {
      try {
        await RegulatoryAMLRiskService.unblockRegulatoryAMLRisk(selectedRegulatoryAMLRisk.id);

        setBlockedRegulatoryAMLRisks((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedRegulatoryAMLRisk.id));
        setRegulatoryAMLRisks((prevRegulatoryAMLRisks) => [...prevRegulatoryAMLRisks, { ...selectedRegulatoryAMLRisk, isBlocked: false }]);
        setSuccessMessage(`RegulatoryAMLRisk unblocked successfully!`);

        setSelectedRegulatoryAMLRisk(null);
        setConfirmUnblockOpen(false);
        setBlockedRegulatoryAMLRisksDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking RegulatoryAMLRisk:', error);
        setErrorMessage('Error unblocking RegulatoryAMLRisk.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setRegulatoryAMLRiskName('');
    setRegulatoryAMLRiskCode('');
    setEditingRegulatoryAMLRisk(null);
    setDialogOpen(true);
  };

  const toggleBlockedRegulatoryAMLRisks = () => {
    setBlockedRegulatoryAMLRisksDialogOpen(true);
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
          <h6 className='allheading'>RegulatoryAMLRisk </h6>
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
              onClick={toggleBlockedRegulatoryAMLRisks}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={RegulatoryAMLRisks.length > 0 || blockedRegulatoryAMLRisks.length > 0}>
          {RegulatoryAMLRisks.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active RegulatoryAMLRisks available. Please add a new RegulatoryAMLRisk.
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
                    {RegulatoryAMLRisks.map((RegulatoryAMLRisk: any,index: number) => (
                      <TableRow key={RegulatoryAMLRisk.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{RegulatoryAMLRisk.name}</TableCell>
                        <TableCell className="small-cell">{RegulatoryAMLRisk.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(RegulatoryAMLRisk)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(RegulatoryAMLRisk)} style={{ padding: '1px' }}>
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
        {/* Blocked RegulatoryAMLRisks Dialog */}
        <Dialog open={blockedRegulatoryAMLRisksDialogOpen} onClose={() => setBlockedRegulatoryAMLRisksDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked RegulatoryAMLRisks</DialogTitle>
          <DialogContent>
            {blockedRegulatoryAMLRisks.length === 0 ? (
              <Typography className='confirmation-text'>No blocked RegulatoryAMLRisks available.</Typography>
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
                  {blockedRegulatoryAMLRisks.map((RegulatoryAMLRisk: any,index:number) => (
                    <TableRow key={RegulatoryAMLRisk.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{RegulatoryAMLRisk.name}</TableCell>
                      <TableCell className="small-cell">{RegulatoryAMLRisk.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(RegulatoryAMLRisk)}>
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
            <Button onClick={() => setBlockedRegulatoryAMLRisksDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedRegulatoryAMLRisk && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the RegulatoryAMLRisk "{selectedRegulatoryAMLRisk.name}" (Code: {selectedRegulatoryAMLRisk.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockRegulatoryAMLRisk} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedRegulatoryAMLRisk && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the RegulatoryAMLRisk "{selectedRegulatoryAMLRisk.name}" (Code: {selectedRegulatoryAMLRisk.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockRegulatoryAMLRisk} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* RegulatoryAMLRisk Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingRegulatoryAMLRisk !== null ? 'Edit RegulatoryAMLRisk' : 'Add RegulatoryAMLRisk'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="RegulatoryAMLRisk Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={RegulatoryAMLRiskName}
                onChange={(e) => setRegulatoryAMLRiskName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="RegulatoryAMLRisk Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={RegulatoryAMLRiskCode}
                onChange={(e) => setRegulatoryAMLRiskCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingRegulatoryAMLRisk !== null ? 'Update' : 'Add'}
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

export default RegulatoryAMLRisk;
