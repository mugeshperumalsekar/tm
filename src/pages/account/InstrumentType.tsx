
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
import InstrumentTypeApiService from '../../data/services/account/instrumentType/instrumentType_api_service';

const InstrumentType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [InstrumentTypeName, setInstrumentTypeName] = useState('');
  const [InstrumentTypeCode, setInstrumentTypeCode] = useState('');
  const [InstrumentTypes, setInstrumentTypes] = useState<any[]>([]);
  const [blockedInstrumentTypes, setBlockedInstrumentTypes] = useState<any[]>([]);
  const [editingInstrumentType, setEditingInstrumentType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedInstrumentType, setSelectedInstrumentType] = useState<any | null>(null);
  const [blockedInstrumentTypesDialogOpen, setBlockedInstrumentTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const InstrumentTypeService = new InstrumentTypeApiService();

  useEffect(() => {
    fetchInstrumentTypes();
    fetchBlockedInstrumentTypes()
  }, []);

  const fetchInstrumentTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const InstrumentType = await InstrumentTypeService.getInstrumentType();
      const activeInstrumentTypes = InstrumentType.filter((c: any) => !c.isBlocked);
      setInstrumentTypes(activeInstrumentTypes);
    } catch (error) {
      console.error('Error fetching InstrumentTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedInstrumentTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await InstrumentTypeService.getDeactiveInstrumentType();
      setBlockedInstrumentTypes(response);
    } catch (error) {
      console.error('Error fetching blocked InstrumentTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: InstrumentTypeName, code: InstrumentTypeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingInstrumentType !== null) {
        await InstrumentTypeService.updateInstrumentType(editingInstrumentType, payload);
        setEditingInstrumentType(null);
        setSuccessMessage('InstrumentType updated successfully!');

      } else {
        await InstrumentTypeService.CreateInstrumentType(payload);
        setSuccessMessage('InstrumentType added successfully!');

      }

      setOpenSnackbar(true);

      setInstrumentTypeName('');
      setInstrumentTypeCode('');
      setDialogOpen(false);
      fetchInstrumentTypes();
    } catch (error) {
      console.error('Error saving InstrumentType:', error);
      setErrorMessage('Error saving InstrumentType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (InstrumentType: any) => {
    setInstrumentTypeName(InstrumentType.name);
    setInstrumentTypeCode(InstrumentType.code);
    setEditingInstrumentType(InstrumentType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (InstrumentType: any) => {
    setSelectedInstrumentType(InstrumentType);
    setConfirmBlockOpen(true);
  };

  const handleBlockInstrumentType = async () => {
    if (selectedInstrumentType !== null) {
      try {
      await InstrumentTypeService.blockInstrumentType(selectedInstrumentType.id);
      setInstrumentTypes((prevInstrumentTypes) =>
        prevInstrumentTypes.filter((InstrumentType) => InstrumentType.id !== selectedInstrumentType.id)
      );
      setBlockedInstrumentTypes((prevBlocked) => [...prevBlocked, { ...selectedInstrumentType, isBlocked: true }]);
      setSuccessMessage(`InstrumentType  blocked successfully!`);

      setSelectedInstrumentType(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking InstrumentType:', error);
      setErrorMessage('Error blocking InstrumentType.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (InstrumentType: any) => {
    setSelectedInstrumentType(InstrumentType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockInstrumentType = async () => {
    if (selectedInstrumentType !== null) {
      try {
        await InstrumentTypeService.unblockInstrumentType(selectedInstrumentType.id);

        setBlockedInstrumentTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedInstrumentType.id));
        setInstrumentTypes((prevInstrumentTypes) => [...prevInstrumentTypes, { ...selectedInstrumentType, isBlocked: false }]);
        setSuccessMessage(`InstrumentType unblocked successfully!`);

        setSelectedInstrumentType(null);
        setConfirmUnblockOpen(false);
        setBlockedInstrumentTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking InstrumentType:', error);
        setErrorMessage('Error unblocking InstrumentType.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setInstrumentTypeName('');
    setInstrumentTypeCode('');
    setEditingInstrumentType(null);
    setDialogOpen(true);
  };

  const toggleBlockedInstrumentTypes = () => {
    setBlockedInstrumentTypesDialogOpen(true);
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
          <h6 className='allheading'>InstrumentType </h6>
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
              onClick={toggleBlockedInstrumentTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={InstrumentTypes.length > 0 || blockedInstrumentTypes.length > 0}>
          {InstrumentTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active InstrumentTypes available. Please add a new InstrumentType.
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
                    {InstrumentTypes.map((InstrumentType: any,index: number) => (
                      <TableRow key={InstrumentType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{InstrumentType.name}</TableCell>
                        <TableCell className="small-cell">{InstrumentType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(InstrumentType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(InstrumentType)} style={{ padding: '1px' }}>
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
        {/* Blocked InstrumentTypes Dialog */}
        <Dialog open={blockedInstrumentTypesDialogOpen} onClose={() => setBlockedInstrumentTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked InstrumentTypes</DialogTitle>
          <DialogContent>
            {blockedInstrumentTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked InstrumentTypes available.</Typography>
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
                  {blockedInstrumentTypes.map((InstrumentType: any,index:number) => (
                    <TableRow key={InstrumentType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{InstrumentType.name}</TableCell>
                      <TableCell className="small-cell">{InstrumentType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(InstrumentType)}>
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
            <Button onClick={() => setBlockedInstrumentTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedInstrumentType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the InstrumentType "{selectedInstrumentType.name}" (Code: {selectedInstrumentType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockInstrumentType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedInstrumentType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the InstrumentType "{selectedInstrumentType.name}" (Code: {selectedInstrumentType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockInstrumentType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* InstrumentType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingInstrumentType !== null ? 'Edit InstrumentType' : 'Add InstrumentType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="InstrumentType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={InstrumentTypeName}
                onChange={(e) => setInstrumentTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="InstrumentType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={InstrumentTypeCode}
                onChange={(e) => setInstrumentTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingInstrumentType !== null ? 'Update' : 'Add'}
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

export default InstrumentType;
