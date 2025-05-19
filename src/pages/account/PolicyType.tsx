
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
import PolicyTypeApiService from '../../data/services/account/policyType/policyType_api_service';

const PolicyType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [PolicyTypeName, setPolicyTypeName] = useState('');
  const [PolicyTypeCode, setPolicyTypeCode] = useState('');
  const [PolicyTypes, setPolicyTypes] = useState<any[]>([]);
  const [blockedPolicyTypes, setBlockedPolicyTypes] = useState<any[]>([]);
  const [editingPolicyType, setEditingPolicyType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedPolicyType, setSelectedPolicyType] = useState<any | null>(null);
  const [blockedPolicyTypesDialogOpen, setBlockedPolicyTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const PolicyTypeService = new PolicyTypeApiService();

  useEffect(() => {
    fetchPolicyTypes();
    fetchBlockedPolicyTypes()
  }, []);

  const fetchPolicyTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const PolicyType = await PolicyTypeService.getPolicyType();
      const activePolicyTypes = PolicyType.filter((c: any) => !c.isBlocked);
      setPolicyTypes(activePolicyTypes);
    } catch (error) {
      console.error('Error fetching PolicyTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedPolicyTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await PolicyTypeService.getDeactivePolicyType();
      setBlockedPolicyTypes(response);
    } catch (error) {
      console.error('Error fetching blocked PolicyTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: PolicyTypeName, code: PolicyTypeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingPolicyType !== null) {
        await PolicyTypeService.updatePolicyType(editingPolicyType, payload);
        setEditingPolicyType(null);
        setSuccessMessage('PolicyType updated successfully!');

      } else {
        await PolicyTypeService.CreatePolicyType(payload);
        setSuccessMessage('PolicyType added successfully!');

      }

      setOpenSnackbar(true);

      setPolicyTypeName('');
      setPolicyTypeCode('');
      setDialogOpen(false);
      fetchPolicyTypes();
    } catch (error) {
      console.error('Error saving PolicyType:', error);
      setErrorMessage('Error saving PolicyType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (PolicyType: any) => {
    setPolicyTypeName(PolicyType.name);
    setPolicyTypeCode(PolicyType.code);
    setEditingPolicyType(PolicyType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (PolicyType: any) => {
    setSelectedPolicyType(PolicyType);
    setConfirmBlockOpen(true);
  };

  const handleBlockPolicyType = async () => {
    if (selectedPolicyType !== null) {
      try {
      await PolicyTypeService.blockPolicyType(selectedPolicyType.id);
      setPolicyTypes((prevPolicyTypes) =>
        prevPolicyTypes.filter((PolicyType) => PolicyType.id !== selectedPolicyType.id)
      );
      setBlockedPolicyTypes((prevBlocked) => [...prevBlocked, { ...selectedPolicyType, isBlocked: true }]);
      setSuccessMessage(`PolicyType  blocked successfully!`);

      setSelectedPolicyType(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking PolicyType:', error);
      setErrorMessage('Error blocking PolicyType.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (PolicyType: any) => {
    setSelectedPolicyType(PolicyType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockPolicyType = async () => {
    if (selectedPolicyType !== null) {
      try {
        await PolicyTypeService.unblockPolicyType(selectedPolicyType.id);

        setBlockedPolicyTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedPolicyType.id));
        setPolicyTypes((prevPolicyTypes) => [...prevPolicyTypes, { ...selectedPolicyType, isBlocked: false }]);
        setSuccessMessage(`PolicyType unblocked successfully!`);

        setSelectedPolicyType(null);
        setConfirmUnblockOpen(false);
        setBlockedPolicyTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking PolicyType:', error);
        setErrorMessage('Error unblocking PolicyType.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setPolicyTypeName('');
    setPolicyTypeCode('');
    setEditingPolicyType(null);
    setDialogOpen(true);
  };

  const toggleBlockedPolicyTypes = () => {
    setBlockedPolicyTypesDialogOpen(true);
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
          <h6 className='allheading'>PolicyType </h6>
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
              onClick={toggleBlockedPolicyTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={PolicyTypes.length > 0 || blockedPolicyTypes.length > 0}>
          {PolicyTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active PolicyTypes available. Please add a new PolicyType.
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
                    {PolicyTypes.map((PolicyType: any,index: number) => (
                      <TableRow key={PolicyType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{PolicyType.name}</TableCell>
                        <TableCell className="small-cell">{PolicyType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(PolicyType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(PolicyType)} style={{ padding: '1px' }}>
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
        {/* Blocked PolicyTypes Dialog */}
        <Dialog open={blockedPolicyTypesDialogOpen} onClose={() => setBlockedPolicyTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked PolicyTypes</DialogTitle>
          <DialogContent>
            {blockedPolicyTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked PolicyTypes available.</Typography>
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
                  {blockedPolicyTypes.map((PolicyType: any,index:number) => (
                    <TableRow key={PolicyType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{PolicyType.name}</TableCell>
                      <TableCell className="small-cell">{PolicyType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(PolicyType)}>
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
            <Button onClick={() => setBlockedPolicyTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedPolicyType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the PolicyType "{selectedPolicyType.name}" (Code: {selectedPolicyType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockPolicyType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedPolicyType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the PolicyType "{selectedPolicyType.name}" (Code: {selectedPolicyType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockPolicyType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* PolicyType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingPolicyType !== null ? 'Edit PolicyType' : 'Add PolicyType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="PolicyType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={PolicyTypeName}
                onChange={(e) => setPolicyTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="PolicyType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={PolicyTypeCode}
                onChange={(e) => setPolicyTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingPolicyType !== null ? 'Update' : 'Add'}
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

export default PolicyType;
