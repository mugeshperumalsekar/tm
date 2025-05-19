
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
import NatureOfBusinessApiService from '../../data/services/customer/natureOfBusiness/natureOfBusiness_api_services';

const NatureOfBusiness: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [NatureOfBusinessName, setNatureOfBusinessName] = useState('');
  const [NatureOfBusinessCode, setNatureOfBusinessCode] = useState('');
  const [NatureOfBusinesss, setNatureOfBusinesss] = useState<any[]>([]);
  const [blockedNatureOfBusinesss, setBlockedNatureOfBusinesss] = useState<any[]>([]);
  const [editingNatureOfBusiness, setEditingNatureOfBusiness] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedNatureOfBusiness, setSelectedNatureOfBusiness] = useState<any | null>(null);
  const [blockedNatureOfBusinesssDialogOpen, setBlockedNatureOfBusinesssDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const NatureOfBusinessService = new NatureOfBusinessApiService();

  useEffect(() => {
    fetchNatureOfBusinesss();
    fetchBlockedNatureOfBusinesss()
  }, []);

  const fetchNatureOfBusinesss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const NatureOfBusiness = await NatureOfBusinessService.getNatureOfBusiness();
      const activeNatureOfBusinesss = NatureOfBusiness.filter((c: any) => !c.isBlocked);
      setNatureOfBusinesss(activeNatureOfBusinesss);
    } catch (error) {
      console.error('Error fetching NatureOfBusinesss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedNatureOfBusinesss = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await NatureOfBusinessService.getDeactiveNatureOfBusiness();
      setBlockedNatureOfBusinesss(response);
    } catch (error) {
      console.error('Error fetching blocked NatureOfBusinesss:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: NatureOfBusinessName, code: NatureOfBusinessCode,  uid: loginDetails.id };
    try {
      if (editingNatureOfBusiness !== null) {
        await NatureOfBusinessService.updateNatureOfBusiness(editingNatureOfBusiness, payload);
        setEditingNatureOfBusiness(null);
        setSuccessMessage('NatureOfBusiness updated successfully!');

      } else {
        await NatureOfBusinessService.CreateNatureOfBusiness(payload);
        setSuccessMessage('NatureOfBusiness added successfully!');

      }
      setOpenSnackbar(true);
      setNatureOfBusinessName('');
      setNatureOfBusinessCode('');
      setDialogOpen(false);
      fetchNatureOfBusinesss();
    } catch (error) {
      console.error('Error saving NatureOfBusiness:', error);
      setErrorMessage('Error saving NatureOfBusiness.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (NatureOfBusiness: any) => {
    setNatureOfBusinessName(NatureOfBusiness.name);
    setNatureOfBusinessCode(NatureOfBusiness.code);
    setEditingNatureOfBusiness(NatureOfBusiness.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (NatureOfBusiness: any) => {
    setSelectedNatureOfBusiness(NatureOfBusiness);
    setConfirmBlockOpen(true);
  };

  const handleBlockNatureOfBusiness = async () => {
    if (selectedNatureOfBusiness !== null) {
      try {
        const euid = 1;  
        await NatureOfBusinessService.deActivateNatureOfBusiness(selectedNatureOfBusiness.id, euid);
  
        setNatureOfBusinesss((prevNatureOfBusinesss) =>
          prevNatureOfBusinesss.filter((NatureOfBusiness) => NatureOfBusiness.id !== selectedNatureOfBusiness.id)
        );
  
        setBlockedNatureOfBusinesss((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedNatureOfBusiness, isBlocked: true }
        ]);
  
        setSuccessMessage(`NatureOfBusiness blocked successfully!`);
        setSelectedNatureOfBusiness(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking NatureOfBusiness:', error);
        setErrorMessage('Error blocking NatureOfBusiness.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (NatureOfBusiness: any) => {
    setSelectedNatureOfBusiness(NatureOfBusiness);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockNatureOfBusiness = async () => {
    if (selectedNatureOfBusiness !== null) {
      try {
        await NatureOfBusinessService.unblockNatureOfBusiness(selectedNatureOfBusiness.id);

        setBlockedNatureOfBusinesss((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedNatureOfBusiness.id));
        setNatureOfBusinesss((prevNatureOfBusinesss) => [...prevNatureOfBusinesss, { ...selectedNatureOfBusiness, isBlocked: false }]);
        setSuccessMessage(`NatureOfBusiness unblocked successfully!`);

        setSelectedNatureOfBusiness(null);
        setConfirmUnblockOpen(false);
        setBlockedNatureOfBusinesssDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking NatureOfBusiness:', error);
        setErrorMessage('Error unblocking NatureOfBusiness.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setNatureOfBusinessName('');
    setNatureOfBusinessCode('');
    setEditingNatureOfBusiness(null);
    setDialogOpen(true);
  };

  const toggleBlockedNatureOfBusinesss = () => {
    setBlockedNatureOfBusinesssDialogOpen(true);
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
          <h6 className='allheading'> NATURE OF BUSINESS </h6>
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
              onClick={toggleBlockedNatureOfBusinesss}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={NatureOfBusinesss.length > 0 || blockedNatureOfBusinesss.length > 0}>
          {NatureOfBusinesss.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active NatureOfBusinesss available. Please add a new NatureOfBusiness.
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
                    {NatureOfBusinesss.map((NatureOfBusiness: any,index: number) => (
                      <TableRow key={NatureOfBusiness.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{NatureOfBusiness.name}</TableCell>
                        <TableCell className="small-cell">{NatureOfBusiness.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(NatureOfBusiness)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(NatureOfBusiness)} style={{ padding: '1px' }}>
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
        {/* Blocked NatureOfBusinesss Dialog */}
        <Dialog open={blockedNatureOfBusinesssDialogOpen} onClose={() => setBlockedNatureOfBusinesssDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked NatureOfBusinesss</DialogTitle>
          <DialogContent>
            {blockedNatureOfBusinesss.length === 0 ? (
              <Typography className='confirmation-text'>No blocked NatureOfBusinesss available.</Typography>
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
                  {blockedNatureOfBusinesss.map((NatureOfBusiness: any,index:number) => (
                    <TableRow key={NatureOfBusiness.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{NatureOfBusiness.name}</TableCell>
                      <TableCell className="small-cell">{NatureOfBusiness.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(NatureOfBusiness)}>
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
            <Button onClick={() => setBlockedNatureOfBusinesssDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedNatureOfBusiness && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the NatureOfBusiness "{selectedNatureOfBusiness.name}" (Code: {selectedNatureOfBusiness.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockNatureOfBusiness} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedNatureOfBusiness && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the NatureOfBusiness "{selectedNatureOfBusiness.name}" (Code: {selectedNatureOfBusiness.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockNatureOfBusiness} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* NatureOfBusiness Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingNatureOfBusiness !== null ? 'Edit NatureOfBusiness' : 'Add NatureOfBusiness'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="NatureOfBusiness Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={NatureOfBusinessName}
                onChange={(e) => setNatureOfBusinessName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="NatureOfBusiness Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={NatureOfBusinessCode}
                onChange={(e) => setNatureOfBusinessCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingNatureOfBusiness !== null ? 'Update' : 'Add'}
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

export default NatureOfBusiness;
