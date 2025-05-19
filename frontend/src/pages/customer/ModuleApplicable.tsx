
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
import ModuleApplicableApiService from '../../data/services/customer/moduleApplicable/moduleApplicable_api_service';

const ModuleApplicable: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ModuleApplicableName, setModuleApplicableName] = useState('');
  const [ModuleApplicableCode, setModuleApplicableCode] = useState('');
  const [ModuleApplicables, setModuleApplicables] = useState<any[]>([]);
  const [blockedModuleApplicables, setBlockedModuleApplicables] = useState<any[]>([]);
  const [editingModuleApplicable, setEditingModuleApplicable] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedModuleApplicable, setSelectedModuleApplicable] = useState<any | null>(null);
  const [blockedModuleApplicablesDialogOpen, setBlockedModuleApplicablesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ModuleApplicableService = new ModuleApplicableApiService();

  useEffect(() => {
    fetchModuleApplicables();
    fetchBlockedModuleApplicables()
  }, []);

  const fetchModuleApplicables = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ModuleApplicable = await ModuleApplicableService.getModuleApplicable();
      const activeModuleApplicables = ModuleApplicable.filter((c: any) => !c.isBlocked);
      setModuleApplicables(activeModuleApplicables);
    } catch (error) {
      console.error('Error fetching ModuleApplicables:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedModuleApplicables = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ModuleApplicableService.getDeactiveModuleApplicable();
      setBlockedModuleApplicables(response);
    } catch (error) {
      console.error('Error fetching blocked ModuleApplicables:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ModuleApplicableName, code: ModuleApplicableCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingModuleApplicable !== null) {
        await ModuleApplicableService.updateModuleApplicable(editingModuleApplicable, payload);
        setEditingModuleApplicable(null);
        setSuccessMessage('ModuleApplicable updated successfully!');

      } else {
        await ModuleApplicableService.CreateModuleApplicable(payload);
        setSuccessMessage('ModuleApplicable added successfully!');

      }

      setOpenSnackbar(true);

      setModuleApplicableName('');
      setModuleApplicableCode('');
      setDialogOpen(false);
      fetchModuleApplicables();
    } catch (error) {
      console.error('Error saving ModuleApplicable:', error);
      setErrorMessage('Error saving ModuleApplicable.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ModuleApplicable: any) => {
    setModuleApplicableName(ModuleApplicable.name);
    setModuleApplicableCode(ModuleApplicable.code);
    setEditingModuleApplicable(ModuleApplicable.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ModuleApplicable: any) => {
    setSelectedModuleApplicable(ModuleApplicable);
    setConfirmBlockOpen(true);
  };

  const handleBlockModuleApplicable = async () => {
    if (selectedModuleApplicable !== null) {
      try {
      await ModuleApplicableService.blockModuleApplicable(selectedModuleApplicable.id);
      setModuleApplicables((prevModuleApplicables) =>
        prevModuleApplicables.filter((ModuleApplicable) => ModuleApplicable.id !== selectedModuleApplicable.id)
      );
      setBlockedModuleApplicables((prevBlocked) => [...prevBlocked, { ...selectedModuleApplicable, isBlocked: true }]);
      setSuccessMessage(`ModuleApplicable  blocked successfully!`);

      setSelectedModuleApplicable(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking ModuleApplicable:', error);
      setErrorMessage('Error blocking ModuleApplicable.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (ModuleApplicable: any) => {
    setSelectedModuleApplicable(ModuleApplicable);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockModuleApplicable = async () => {
    if (selectedModuleApplicable !== null) {
      try {
        await ModuleApplicableService.unblockModuleApplicable(selectedModuleApplicable.id);

        setBlockedModuleApplicables((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedModuleApplicable.id));
        setModuleApplicables((prevModuleApplicables) => [...prevModuleApplicables, { ...selectedModuleApplicable, isBlocked: false }]);
        setSuccessMessage(`ModuleApplicable unblocked successfully!`);

        setSelectedModuleApplicable(null);
        setConfirmUnblockOpen(false);
        setBlockedModuleApplicablesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking ModuleApplicable:', error);
        setErrorMessage('Error unblocking ModuleApplicable.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setModuleApplicableName('');
    setModuleApplicableCode('');
    setEditingModuleApplicable(null);
    setDialogOpen(true);
  };

  const toggleBlockedModuleApplicables = () => {
    setBlockedModuleApplicablesDialogOpen(true);
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
          <h6 className='allheading'>ModuleApplicable </h6>
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
              onClick={toggleBlockedModuleApplicables}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={ModuleApplicables.length > 0 || blockedModuleApplicables.length > 0}>
          {ModuleApplicables.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active ModuleApplicables available. Please add a new ModuleApplicable.
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
                    {ModuleApplicables.map((ModuleApplicable: any,index: number) => (
                      <TableRow key={ModuleApplicable.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{ModuleApplicable.name}</TableCell>
                        <TableCell className="small-cell">{ModuleApplicable.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ModuleApplicable)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ModuleApplicable)} style={{ padding: '1px' }}>
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
        {/* Blocked ModuleApplicables Dialog */}
        <Dialog open={blockedModuleApplicablesDialogOpen} onClose={() => setBlockedModuleApplicablesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ModuleApplicables</DialogTitle>
          <DialogContent>
            {blockedModuleApplicables.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ModuleApplicables available.</Typography>
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
                  {blockedModuleApplicables.map((ModuleApplicable: any,index:number) => (
                    <TableRow key={ModuleApplicable.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{ModuleApplicable.name}</TableCell>
                      <TableCell className="small-cell">{ModuleApplicable.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ModuleApplicable)}>
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
            <Button onClick={() => setBlockedModuleApplicablesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedModuleApplicable && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ModuleApplicable "{selectedModuleApplicable.name}" (Code: {selectedModuleApplicable.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockModuleApplicable} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedModuleApplicable && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ModuleApplicable "{selectedModuleApplicable.name}" (Code: {selectedModuleApplicable.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockModuleApplicable} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ModuleApplicable Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingModuleApplicable !== null ? 'Edit ModuleApplicable' : 'Add ModuleApplicable'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ModuleApplicable Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ModuleApplicableName}
                onChange={(e) => setModuleApplicableName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ModuleApplicable Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ModuleApplicableCode}
                onChange={(e) => setModuleApplicableCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingModuleApplicable !== null ? 'Update' : 'Add'}
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

export default ModuleApplicable;
