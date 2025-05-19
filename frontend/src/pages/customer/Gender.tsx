
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
import GenderApiService from '../../data/services/customer/gender/gender_api_services';

const Gender: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [GenderName, setGenderName] = useState('');
  const [GenderCode, setGenderCode] = useState('');
  const [Genders, setGenders] = useState<any[]>([]);
  const [blockedGenders, setBlockedGenders] = useState<any[]>([]);
  const [editingGender, setEditingGender] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<any | null>(null);
  const [blockedGendersDialogOpen, setBlockedGendersDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const GenderService = new GenderApiService();

  useEffect(() => {
    fetchGenders();
    fetchBlockedGenders()
  }, []);

  const fetchGenders = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const Gender = await GenderService.getGender();
      const activeGenders = Gender.filter((c: any) => !c.isBlocked);
      setGenders(activeGenders);
    } catch (error) {
      console.error('Error fetching Genders:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedGenders = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await GenderService.getDeactiveGender();
      setBlockedGenders(response);
    } catch (error) {
      console.error('Error fetching blocked Genders:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: GenderName, code: GenderCode,  uid: loginDetails.id };
    try {
      if (editingGender !== null) {
        await GenderService.updateGender(editingGender, payload);
        setEditingGender(null);
        setSuccessMessage('Gender updated successfully!');

      } else {
        await GenderService.CreateGender(payload);
        setSuccessMessage('Gender added successfully!');

      }
      setOpenSnackbar(true);
      setGenderName('');
      setGenderCode('');
      setDialogOpen(false);
      fetchGenders();
    } catch (error) {
      console.error('Error saving Gender:', error);
      setErrorMessage('Error saving Gender.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (Gender: any) => {
    setGenderName(Gender.name);
    setGenderCode(Gender.code);
    setEditingGender(Gender.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (Gender: any) => {
    setSelectedGender(Gender);
    setConfirmBlockOpen(true);
  };

  const handleBlockGender = async () => {
    if (selectedGender !== null) {
      try {
        const euid = 1;  
        await GenderService.deActivateGender(selectedGender.id, euid);
  
        setGenders((prevGenders) =>
          prevGenders.filter((Gender) => Gender.id !== selectedGender.id)
        );
  
        setBlockedGenders((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedGender, isBlocked: true }
        ]);
  
        setSuccessMessage(`Gender blocked successfully!`);
        setSelectedGender(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking Gender:', error);
        setErrorMessage('Error blocking Gender.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (Gender: any) => {
    setSelectedGender(Gender);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockGender = async () => {
    if (selectedGender !== null) {
      try {
        await GenderService.unblockGender(selectedGender.id);

        setBlockedGenders((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedGender.id));
        setGenders((prevGenders) => [...prevGenders, { ...selectedGender, isBlocked: false }]);
        setSuccessMessage(`Gender unblocked successfully!`);

        setSelectedGender(null);
        setConfirmUnblockOpen(false);
        setBlockedGendersDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Gender:', error);
        setErrorMessage('Error unblocking Gender.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setGenderName('');
    setGenderCode('');
    setEditingGender(null);
    setDialogOpen(true);
  };

  const toggleBlockedGenders = () => {
    setBlockedGendersDialogOpen(true);
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
          <h6 className='allheading'> GENDER </h6>
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
              onClick={toggleBlockedGenders}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={Genders.length > 0 || blockedGenders.length > 0}>
          {Genders.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active Genders available. Please add a new Gender.
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
                    {Genders.map((Gender: any,index: number) => (
                      <TableRow key={Gender.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{Gender.name}</TableCell>
                        <TableCell className="small-cell">{Gender.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(Gender)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(Gender)} style={{ padding: '1px' }}>
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
        {/* Blocked Genders Dialog */}
        <Dialog open={blockedGendersDialogOpen} onClose={() => setBlockedGendersDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Genders</DialogTitle>
          <DialogContent>
            {blockedGenders.length === 0 ? (
              <Typography className='confirmation-text'>No blocked Genders available.</Typography>
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
                  {blockedGenders.map((Gender: any,index:number) => (
                    <TableRow key={Gender.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{Gender.name}</TableCell>
                      <TableCell className="small-cell">{Gender.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(Gender)}>
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
            <Button onClick={() => setBlockedGendersDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedGender && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the Gender "{selectedGender.name}" (Code: {selectedGender.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockGender} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedGender && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the Gender "{selectedGender.name}" (Code: {selectedGender.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockGender} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Gender Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingGender !== null ? 'Edit Gender' : 'Add Gender'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Gender Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={GenderName}
                onChange={(e) => setGenderName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Gender Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={GenderCode}
                onChange={(e) => setGenderCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingGender !== null ? 'Update' : 'Add'}
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

export default Gender;
