
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
import IUPartyTypeApiService from '../../data/services/customer/iuPartyType/iuPartyType_api_service';

const IUPartyType: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [IUPartyTypeName, setIUPartyTypeName] = useState('');
  const [IUPartyTypeCode, setIUPartyTypeCode] = useState('');
  const [IUPartyTypes, setIUPartyTypes] = useState<any[]>([]);
  const [blockedIUPartyTypes, setBlockedIUPartyTypes] = useState<any[]>([]);
  const [editingIUPartyType, setEditingIUPartyType] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedIUPartyType, setSelectedIUPartyType] = useState<any | null>(null);
  const [blockedIUPartyTypesDialogOpen, setBlockedIUPartyTypesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const IUPartyTypeService = new IUPartyTypeApiService();

  useEffect(() => {
    fetchIUPartyTypes();
    fetchBlockedIUPartyTypes()
  }, []);

  const fetchIUPartyTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const IUPartyType = await IUPartyTypeService.getIUPartyType();
      const activeIUPartyTypes = IUPartyType.filter((c: any) => !c.isBlocked);
      setIUPartyTypes(activeIUPartyTypes);
    } catch (error) {
      console.error('Error fetching IUPartyTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedIUPartyTypes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await IUPartyTypeService.getDeactiveIUPartyType();
      setBlockedIUPartyTypes(response);
    } catch (error) {
      console.error('Error fetching blocked IUPartyTypes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { iupartyName: IUPartyTypeName, code: IUPartyTypeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingIUPartyType !== null) {
        await IUPartyTypeService.updateIUPartyType(editingIUPartyType, payload);
        setEditingIUPartyType(null);
        setSuccessMessage('IUPartyType updated successfully!');

      } else {
        await IUPartyTypeService.CreateIUPartyType(payload);
        setSuccessMessage('IUPartyType added successfully!');

      }

      setOpenSnackbar(true);

      setIUPartyTypeName('');
      setIUPartyTypeCode('');
      setDialogOpen(false);
      fetchIUPartyTypes();
    } catch (error) {
      console.error('Error saving IUPartyType:', error);
      setErrorMessage('Error saving IUPartyType.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (IUPartyType: any) => {
    setIUPartyTypeName(IUPartyType.iupartyName);
    setIUPartyTypeCode(IUPartyType.code);
    setEditingIUPartyType(IUPartyType.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (IUPartyType: any) => {
    setSelectedIUPartyType(IUPartyType);
    setConfirmBlockOpen(true);
  };

  const handleBlockIUPartyType = async () => {
    if (selectedIUPartyType !== null) {
      try {
      await IUPartyTypeService.blockIUPartyType(selectedIUPartyType.id);
      setIUPartyTypes((prevIUPartyTypes) =>
        prevIUPartyTypes.filter((IUPartyType) => IUPartyType.id !== selectedIUPartyType.id)
      );
      setBlockedIUPartyTypes((prevBlocked) => [...prevBlocked, { ...selectedIUPartyType, isBlocked: true }]);
      setSuccessMessage(`IUPartyType  blocked successfully!`);

      setSelectedIUPartyType(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking IUPartyType:', error);
      setErrorMessage('Error blocking IUPartyType.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (IUPartyType: any) => {
    setSelectedIUPartyType(IUPartyType);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockIUPartyType = async () => {
    if (selectedIUPartyType !== null) {
      try {
        await IUPartyTypeService.unblockIUPartyType(selectedIUPartyType.id);

        setBlockedIUPartyTypes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedIUPartyType.id));
        setIUPartyTypes((prevIUPartyTypes) => [...prevIUPartyTypes, { ...selectedIUPartyType, isBlocked: false }]);
        setSuccessMessage(`IUPartyType unblocked successfully!`);

        setSelectedIUPartyType(null);
        setConfirmUnblockOpen(false);
        setBlockedIUPartyTypesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking IUPartyType:', error);
        setErrorMessage('Error unblocking IUPartyType.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setIUPartyTypeName('');
    setIUPartyTypeCode('');
    setEditingIUPartyType(null);
    setDialogOpen(true);
  };

  const toggleBlockedIUPartyTypes = () => {
    setBlockedIUPartyTypesDialogOpen(true);
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
          <h6 className='allheading'>IUPartyType </h6>
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
              onClick={toggleBlockedIUPartyTypes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={IUPartyTypes.length > 0 || blockedIUPartyTypes.length > 0}>
          {IUPartyTypes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active IUPartyTypes available. Please add a new IUPartyType.
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
                    {IUPartyTypes.map((IUPartyType: any,index: number) => (
                      <TableRow key={IUPartyType.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{IUPartyType.iupartyName}</TableCell>
                        <TableCell className="small-cell">{IUPartyType.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(IUPartyType)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(IUPartyType)} style={{ padding: '1px' }}>
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
        {/* Blocked IUPartyTypes Dialog */}
        <Dialog open={blockedIUPartyTypesDialogOpen} onClose={() => setBlockedIUPartyTypesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked IUPartyTypes</DialogTitle>
          <DialogContent>
            {blockedIUPartyTypes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked IUPartyTypes available.</Typography>
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
                  {blockedIUPartyTypes.map((IUPartyType: any,index:number) => (
                    <TableRow key={IUPartyType.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{IUPartyType.iupartyName}</TableCell>
                      <TableCell className="small-cell">{IUPartyType.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(IUPartyType)}>
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
            <Button onClick={() => setBlockedIUPartyTypesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedIUPartyType && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the IUPartyType "{selectedIUPartyType.name}" (Code: {selectedIUPartyType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockIUPartyType} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedIUPartyType && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the IUPartyType "{selectedIUPartyType.name}" (Code: {selectedIUPartyType.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockIUPartyType} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* IUPartyType Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingIUPartyType !== null ? 'Edit IUPartyType' : 'Add IUPartyType'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="IUPartyType Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={IUPartyTypeName}
                onChange={(e) => setIUPartyTypeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="IUPartyType Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={IUPartyTypeCode}
                onChange={(e) => setIUPartyTypeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingIUPartyType !== null ? 'Update' : 'Add'}
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

export default IUPartyType