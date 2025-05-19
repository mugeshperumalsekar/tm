import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import FundedTypeApiService from '../../data/services/account/fundedType/fundedType_api_service';

const FundedType: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [FundedTypeName, setFundedTypeName] = useState('');
  const [FundedTypeCode, setFundedTypeCode] = useState('');
  const [FundedTypes, setFundedTypes] = useState<any[]>([]);
  const [blockedFundedTypes, setBlockedFundedTypes] = useState<any[]>([]);
  const [editingFundedType, setEditingFundedType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedFundedType, setSelectedFundedType] = useState<any | null>(null);
  const [blockedFundedTypesDialogOpen, setBlockedFundedTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const FundedTypeService = new FundedTypeApiService();

  useEffect(() => {
    fetchFundedTypes();
    fetchBlockedFundedTypes();
  }, []);

  const fetchFundedTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const FundedType = await FundedTypeService.getFundedType();
      const activeFundedTypes = FundedType.filter((c: any) => !c.isBlocked);
      setFundedTypes(activeFundedTypes);
    } catch (error) {
      console.error('Error fetching FundedTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedFundedTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await FundedTypeService.getDeactiveFundedType();
      setBlockedFundedTypes(response);
    } catch (error) {
      console.error('Error fetching blocked FundedTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: FundedTypeName, code: FundedTypeCode, uid: loginDetails.id, euid: '1' };
    try {
      if (editingFundedType !== null) {
        await FundedTypeService.updateFundedType(editingFundedType, payload);
        setEditingFundedType(null);
        setSuccessMessage('FundedType updated successfully!');
      } else {
        await FundedTypeService.CreateFundedType(payload);
        setSuccessMessage('FundedType added successfully!');
      }
      setOpenSnackbar(true);
      setFundedTypeName('');
      setFundedTypeCode('');
      setDialogOpen(false);
      fetchFundedTypes();
    } catch (error) {
      console.error('Error saving FundedType:', error);
      setErrorMessage('Error saving FundedType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (FundedType: any) => {
    setFundedTypeName(FundedType.name);
    setFundedTypeCode(FundedType.code);
    setEditingFundedType(FundedType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (FundedType: any) => {
    setSelectedFundedType(FundedType);
    setConfirmBlockOpen(true);
  };

  const handleBlockFundedType = async () => {
    if (selectedFundedType !== null) {
      try {
        await FundedTypeService.blockFundedType(selectedFundedType.id);
        setFundedTypes((prevFundedTypes) =>
          prevFundedTypes.filter((FundedType) => FundedType.id !== selectedFundedType.id)
        );
        setBlockedFundedTypes((prevBlocked) => [...prevBlocked, { ...selectedFundedType, isBlocked: true }]);
        setSuccessMessage(`FundedType  blocked successfully!`);
        setSelectedFundedType(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error blocking FundedType:', error);
        setErrorMessage('Error blocking FundedType.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (FundedType: any) => {
    setSelectedFundedType(FundedType);
    setConfirmUnblockOpen(true);
  };

  const handleUnblockFundedType = async () => {
    if (selectedFundedType !== null) {
      try {
        await FundedTypeService.unblockFundedType(selectedFundedType.id);
        setBlockedFundedTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedFundedType.id));
        setFundedTypes((prevFundedTypes) => [...prevFundedTypes, { ...selectedFundedType, isBlocked: false }]);
        setSuccessMessage(`FundedType unblocked successfully!`);
        setSelectedFundedType(null);
        setConfirmUnblockOpen(false);
        setBlockedFundedTypesDialogOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error unblocking FundedType:', error);
        setErrorMessage('Error unblocking FundedType.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setFundedTypeName('');
    setFundedTypeCode('');
    setEditingFundedType(null);
    setDialogOpen(true);
  };

  const toggleBlockedFundedTypes = () => {
    setBlockedFundedTypesDialogOpen(true);
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
          <h6 className='allheading'>FundedType </h6>
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
              onClick={toggleBlockedFundedTypes}
            >
              Show Blocked
            </Button>
          </div>
        </Box>

        <Loading isLoading={isLoading} hasError={hasError} hasData={FundedTypes.length > 0 || blockedFundedTypes.length > 0}>
          {FundedTypes.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active FundedTypes available. Please add a new FundedType.
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
                    {FundedTypes.map((FundedType: any, index: number) => (
                      <TableRow key={FundedType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>
                        <TableCell className="small-cell">{FundedType.name}</TableCell>
                        <TableCell className="small-cell">{FundedType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(FundedType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(FundedType)} style={{ padding: '1px' }}>
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

        {/* Blocked FundedTypes Dialog */}
        <Dialog open={blockedFundedTypesDialogOpen} onClose={() => setBlockedFundedTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked FundedTypes</DialogTitle>
          <DialogContent>
            {blockedFundedTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked FundedTypes available.</Typography>
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
                  {blockedFundedTypes.map((FundedType: any, index: number) => (
                    <TableRow key={FundedType.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{FundedType.name}</TableCell>
                      <TableCell className="small-cell">{FundedType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(FundedType)}>
                          <Block style={{ fontSize: '16px', color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBlockedFundedTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedFundedType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the FundedType "{selectedFundedType.name}" (Code: {selectedFundedType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockFundedType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedFundedType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the FundedType "{selectedFundedType.name}" (Code: {selectedFundedType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockFundedType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>

        {/* FundedType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingFundedType !== null ? 'Edit FundedType' : 'Add FundedType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="FundedType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={FundedTypeName}
                onChange={(e) => setFundedTypeName(e.target.value)}
              />
              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="FundedType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={FundedTypeCode}
                onChange={(e) => setFundedTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingFundedType !== null ? 'Update' : 'Add'}
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

export default FundedType;