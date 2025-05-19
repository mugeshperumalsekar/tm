
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
import RegAMLRiskApiService from '../../data/services/account/regAMLRisk/regAMLRisk_api_service';

const RegAMLRisk: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [RegAMLRiskName, setRegAMLRiskName] = useState('');
  const [RegAMLRiskCode, setRegAMLRiskCode] = useState('');
  const [RegAMLRisks, setRegAMLRisks] = useState<any[]>([]);
  const [blockedRegAMLRisks, setBlockedRegAMLRisks] = useState<any[]>([]);
  const [editingRegAMLRisk, setEditingRegAMLRisk] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedRegAMLRisk, setSelectedRegAMLRisk] = useState<any | null>(null);
  const [blockedRegAMLRisksDialogOpen, setBlockedRegAMLRisksDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const RegAMLRiskService = new RegAMLRiskApiService();

  useEffect(() => {
    fetchRegAMLRisks();
    fetchBlockedRegAMLRisks()
  }, []);

  const fetchRegAMLRisks = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const RegAMLRisk = await RegAMLRiskService.getRegAMLRisk();
      const activeRegAMLRisks = RegAMLRisk.filter((c: any) => !c.isBlocked);
      setRegAMLRisks(activeRegAMLRisks);
    } catch (error) {
      console.error('Error fetching RegAMLRisks:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedRegAMLRisks = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await RegAMLRiskService.getDeactiveRegAMLRisk();
      setBlockedRegAMLRisks(response);
    } catch (error) {
      console.error('Error fetching blocked RegAMLRisks:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: RegAMLRiskName, code: RegAMLRiskCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingRegAMLRisk !== null) {
        await RegAMLRiskService.updateRegAMLRisk(editingRegAMLRisk, payload);
        setEditingRegAMLRisk(null);
        setSuccessMessage('RegAMLRisk updated successfully!');

      } else {
        await RegAMLRiskService.CreateRegAMLRisk(payload);
        setSuccessMessage('RegAMLRisk added successfully!');

      }

      setOpenSnackbar(true);

      setRegAMLRiskName('');
      setRegAMLRiskCode('');
      setDialogOpen(false);
      fetchRegAMLRisks();
    } catch (error) {
      console.error('Error saving RegAMLRisk:', error);
      setErrorMessage('Error saving RegAMLRisk.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (RegAMLRisk: any) => {
    setRegAMLRiskName(RegAMLRisk.name);
    setRegAMLRiskCode(RegAMLRisk.code);
    setEditingRegAMLRisk(RegAMLRisk.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (RegAMLRisk: any) => {
    setSelectedRegAMLRisk(RegAMLRisk);
    setConfirmBlockOpen(true);
  };

  const handleBlockRegAMLRisk = async () => {
    if (selectedRegAMLRisk !== null) {
      try {
      await RegAMLRiskService.blockRegAMLRisk(selectedRegAMLRisk.id);
      setRegAMLRisks((prevRegAMLRisks) =>
        prevRegAMLRisks.filter((RegAMLRisk) => RegAMLRisk.id !== selectedRegAMLRisk.id)
      );
      setBlockedRegAMLRisks((prevBlocked) => [...prevBlocked, { ...selectedRegAMLRisk, isBlocked: true }]);
      setSuccessMessage(`RegAMLRisk  blocked successfully!`);

      setSelectedRegAMLRisk(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking RegAMLRisk:', error);
      setErrorMessage('Error blocking RegAMLRisk.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (RegAMLRisk: any) => {
    setSelectedRegAMLRisk(RegAMLRisk);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockRegAMLRisk = async () => {
    if (selectedRegAMLRisk !== null) {
      try {
        await RegAMLRiskService.unblockRegAMLRisk(selectedRegAMLRisk.id);

        setBlockedRegAMLRisks((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedRegAMLRisk.id));
        setRegAMLRisks((prevRegAMLRisks) => [...prevRegAMLRisks, { ...selectedRegAMLRisk, isBlocked: false }]);
        setSuccessMessage(`RegAMLRisk unblocked successfully!`);

        setSelectedRegAMLRisk(null);
        setConfirmUnblockOpen(false);
        setBlockedRegAMLRisksDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking RegAMLRisk:', error);
        setErrorMessage('Error unblocking RegAMLRisk.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setRegAMLRiskName('');
    setRegAMLRiskCode('');
    setEditingRegAMLRisk(null);
    setDialogOpen(true);
  };

  const toggleBlockedRegAMLRisks = () => {
    setBlockedRegAMLRisksDialogOpen(true);
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
          <h6 className='allheading'>RegAMLRisk </h6>
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
              onClick={toggleBlockedRegAMLRisks}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={RegAMLRisks.length > 0 || blockedRegAMLRisks.length > 0}>
          {RegAMLRisks.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active RegAMLRisks available. Please add a new RegAMLRisk.
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
                    {RegAMLRisks.map((RegAMLRisk: any,index: number) => (
                      <TableRow key={RegAMLRisk.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{RegAMLRisk.name}</TableCell>
                        <TableCell className="small-cell">{RegAMLRisk.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(RegAMLRisk)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(RegAMLRisk)} style={{ padding: '1px' }}>
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
        {/* Blocked RegAMLRisks Dialog */}
        <Dialog open={blockedRegAMLRisksDialogOpen} onClose={() => setBlockedRegAMLRisksDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked RegAMLRisks</DialogTitle>
          <DialogContent>
            {blockedRegAMLRisks.length === 0 ? (
              <Typography className='confirmation-text'>No blocked RegAMLRisks available.</Typography>
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
                  {blockedRegAMLRisks.map((RegAMLRisk: any,index:number) => (
                    <TableRow key={RegAMLRisk.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{RegAMLRisk.name}</TableCell>
                      <TableCell className="small-cell">{RegAMLRisk.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(RegAMLRisk)}>
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
            <Button onClick={() => setBlockedRegAMLRisksDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedRegAMLRisk && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the RegAMLRisk "{selectedRegAMLRisk.name}" (Code: {selectedRegAMLRisk.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockRegAMLRisk} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedRegAMLRisk && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the RegAMLRisk "{selectedRegAMLRisk.name}" (Code: {selectedRegAMLRisk.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockRegAMLRisk} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* RegAMLRisk Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingRegAMLRisk !== null ? 'Edit RegAMLRisk' : 'Add RegAMLRisk'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="RegAMLRisk Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={RegAMLRiskName}
                onChange={(e) => setRegAMLRiskName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="RegAMLRisk Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={RegAMLRiskCode}
                onChange={(e) => setRegAMLRiskCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingRegAMLRisk !== null ? 'Update' : 'Add'}
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

export default RegAMLRisk;
