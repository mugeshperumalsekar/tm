
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
import InsurancePurposeApiService from '../../data/services/account/insurancePurpose/insurancePurpose_api_service';

const InsurancePurpose: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [InsurancePurposeName, setInsurancePurposeName] = useState('');
  const [InsurancePurposeCode, setInsurancePurposeCode] = useState('');
  const [InsurancePurposes, setInsurancePurposes] = useState<any[]>([]);
  const [blockedInsurancePurposes, setBlockedInsurancePurposes] = useState<any[]>([]);
  const [editingInsurancePurpose, setEditingInsurancePurpose] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedInsurancePurpose, setSelectedInsurancePurpose] = useState<any | null>(null);
  const [blockedInsurancePurposesDialogOpen, setBlockedInsurancePurposesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const InsurancePurposeService = new InsurancePurposeApiService();

  useEffect(() => {
    fetchInsurancePurposes();
    fetchBlockedInsurancePurposes()
  }, []);

  const fetchInsurancePurposes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const InsurancePurpose = await InsurancePurposeService.getInsurancePurpose();
      const activeInsurancePurposes = InsurancePurpose.filter((c: any) => !c.isBlocked);
      setInsurancePurposes(activeInsurancePurposes);
    } catch (error) {
      console.error('Error fetching InsurancePurposes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedInsurancePurposes = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await InsurancePurposeService.getDeactiveInsurancePurpose();
      setBlockedInsurancePurposes(response);
    } catch (error) {
      console.error('Error fetching blocked InsurancePurposes:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: InsurancePurposeName, code: InsurancePurposeCode,  uid: loginDetails.id ,euid:'1'};
    try {
      if (editingInsurancePurpose !== null) {
        await InsurancePurposeService.updateInsurancePurpose(editingInsurancePurpose, payload);
        setEditingInsurancePurpose(null);
        setSuccessMessage('InsurancePurpose updated successfully!');

      } else {
        await InsurancePurposeService.CreateInsurancePurpose(payload);
        setSuccessMessage('InsurancePurpose added successfully!');

      }

      setOpenSnackbar(true);

      setInsurancePurposeName('');
      setInsurancePurposeCode('');
      setDialogOpen(false);
      fetchInsurancePurposes();
    } catch (error) {
      console.error('Error saving InsurancePurpose:', error);
      setErrorMessage('Error saving InsurancePurpose.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (InsurancePurpose: any) => {
    setInsurancePurposeName(InsurancePurpose.name);
    setInsurancePurposeCode(InsurancePurpose.code);
    setEditingInsurancePurpose(InsurancePurpose.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (InsurancePurpose: any) => {
    setSelectedInsurancePurpose(InsurancePurpose);
    setConfirmBlockOpen(true);
  };

  const handleBlockInsurancePurpose = async () => {
    if (selectedInsurancePurpose !== null) {
      try {
      await InsurancePurposeService.blockInsurancePurpose(selectedInsurancePurpose.id);
      setInsurancePurposes((prevInsurancePurposes) =>
        prevInsurancePurposes.filter((InsurancePurpose) => InsurancePurpose.id !== selectedInsurancePurpose.id)
      );
      setBlockedInsurancePurposes((prevBlocked) => [...prevBlocked, { ...selectedInsurancePurpose, isBlocked: true }]);
      setSuccessMessage(`InsurancePurpose  blocked successfully!`);

      setSelectedInsurancePurpose(null);
      setConfirmBlockOpen(false);

      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error blocking InsurancePurpose:', error);
      setErrorMessage('Error blocking InsurancePurpose.');
      setOpenSnackbar(true);
    }
  }
};

  const handleUnblockDialogOpen = (InsurancePurpose: any) => {
    setSelectedInsurancePurpose(InsurancePurpose);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockInsurancePurpose = async () => {
    if (selectedInsurancePurpose !== null) {
      try {
        await InsurancePurposeService.unblockInsurancePurpose(selectedInsurancePurpose.id);

        setBlockedInsurancePurposes((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedInsurancePurpose.id));
        setInsurancePurposes((prevInsurancePurposes) => [...prevInsurancePurposes, { ...selectedInsurancePurpose, isBlocked: false }]);
        setSuccessMessage(`InsurancePurpose unblocked successfully!`);

        setSelectedInsurancePurpose(null);
        setConfirmUnblockOpen(false);
        setBlockedInsurancePurposesDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking InsurancePurpose:', error);
        setErrorMessage('Error unblocking InsurancePurpose.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setInsurancePurposeName('');
    setInsurancePurposeCode('');
    setEditingInsurancePurpose(null);
    setDialogOpen(true);
  };

  const toggleBlockedInsurancePurposes = () => {
    setBlockedInsurancePurposesDialogOpen(true);
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
          <h6 className='allheading'>InsurancePurpose </h6>
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
              onClick={toggleBlockedInsurancePurposes}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={InsurancePurposes.length > 0 || blockedInsurancePurposes.length > 0}>
          {InsurancePurposes.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active InsurancePurposes available. Please add a new InsurancePurpose.
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
                    {InsurancePurposes.map((InsurancePurpose: any,index: number) => (
                      <TableRow key={InsurancePurpose.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{InsurancePurpose.name}</TableCell>
                        <TableCell className="small-cell">{InsurancePurpose.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(InsurancePurpose)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(InsurancePurpose)} style={{ padding: '1px' }}>
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
        {/* Blocked InsurancePurposes Dialog */}
        <Dialog open={blockedInsurancePurposesDialogOpen} onClose={() => setBlockedInsurancePurposesDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked InsurancePurposes</DialogTitle>
          <DialogContent>
            {blockedInsurancePurposes.length === 0 ? (
              <Typography className='confirmation-text'>No blocked InsurancePurposes available.</Typography>
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
                  {blockedInsurancePurposes.map((InsurancePurpose: any,index:number) => (
                    <TableRow key={InsurancePurpose.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{InsurancePurpose.name}</TableCell>
                      <TableCell className="small-cell">{InsurancePurpose.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(InsurancePurpose)}>
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
            <Button onClick={() => setBlockedInsurancePurposesDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedInsurancePurpose && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the InsurancePurpose "{selectedInsurancePurpose.name}" (Code: {selectedInsurancePurpose.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockInsurancePurpose} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedInsurancePurpose && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the InsurancePurpose "{selectedInsurancePurpose.name}" (Code: {selectedInsurancePurpose.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockInsurancePurpose} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* InsurancePurpose Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingInsurancePurpose !== null ? 'Edit InsurancePurpose' : 'Add InsurancePurpose'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="InsurancePurpose Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={InsurancePurposeName}
                onChange={(e) => setInsurancePurposeName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="InsurancePurpose Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={InsurancePurposeCode}
                onChange={(e) => setInsurancePurposeCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingInsurancePurpose !== null ? 'Update' : 'Add'}
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

export default InsurancePurpose;
