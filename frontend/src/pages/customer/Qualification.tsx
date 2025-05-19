
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
import QualificationApiService from '../../data/services/customer/qualification/qualification_api_services';

const Qualification: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [QualificationName, setQualificationName] = useState('');
  const [QualificationCode, setQualificationCode] = useState('');
  const [Qualifications, setQualifications] = useState<any[]>([]);
  const [blockedQualifications, setBlockedQualifications] = useState<any[]>([]);
  const [editingQualification, setEditingQualification] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedQualification, setSelectedQualification] = useState<any | null>(null);
  const [blockedQualificationsDialogOpen, setBlockedQualificationsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const QualificationService = new QualificationApiService();

  useEffect(() => {
    fetchQualifications();
    fetchBlockedQualifications()
  }, []);

  const fetchQualifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const Qualification = await QualificationService.getQualification();
      const activeQualifications = Qualification.filter((c: any) => !c.isBlocked);
      setQualifications(activeQualifications);
    } catch (error) {
      console.error('Error fetching Qualifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedQualifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await QualificationService.getDeactiveQualification();
      setBlockedQualifications(response);
    } catch (error) {
      console.error('Error fetching blocked Qualifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: QualificationName, code: QualificationCode,  uid: loginDetails.id };
    try {
      if (editingQualification !== null) {
        await QualificationService.updateQualification(editingQualification, payload);
        setEditingQualification(null);
        setSuccessMessage('Qualification updated successfully!');

      } else {
        await QualificationService.CreateQualification(payload);
        setSuccessMessage('Qualification added successfully!');

      }
      setOpenSnackbar(true);
      setQualificationName('');
      setQualificationCode('');
      setDialogOpen(false);
      fetchQualifications();
    } catch (error) {
      console.error('Error saving Qualification:', error);
      setErrorMessage('Error saving Qualification.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (Qualification: any) => {
    setQualificationName(Qualification.name);
    setQualificationCode(Qualification.code);
    setEditingQualification(Qualification.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (Qualification: any) => {
    setSelectedQualification(Qualification);
    setConfirmBlockOpen(true);
  };

  const handleBlockQualification = async () => {
    if (selectedQualification !== null) {
      try {
        const euid = 1;  
        await QualificationService.deActivateQualification(selectedQualification.id, euid);
  
        setQualifications((prevQualifications) =>
          prevQualifications.filter((Qualification) => Qualification.id !== selectedQualification.id)
        );
  
        setBlockedQualifications((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedQualification, isBlocked: true }
        ]);
  
        setSuccessMessage(`Qualification blocked successfully!`);
        setSelectedQualification(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking Qualification:', error);
        setErrorMessage('Error blocking Qualification.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (Qualification: any) => {
    setSelectedQualification(Qualification);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockQualification = async () => {
    if (selectedQualification !== null) {
      try {
        await QualificationService.unblockQualification(selectedQualification.id);

        setBlockedQualifications((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedQualification.id));
        setQualifications((prevQualifications) => [...prevQualifications, { ...selectedQualification, isBlocked: false }]);
        setSuccessMessage(`Qualification unblocked successfully!`);

        setSelectedQualification(null);
        setConfirmUnblockOpen(false);
        setBlockedQualificationsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Qualification:', error);
        setErrorMessage('Error unblocking Qualification.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setQualificationName('');
    setQualificationCode('');
    setEditingQualification(null);
    setDialogOpen(true);
  };

  const toggleBlockedQualifications = () => {
    setBlockedQualificationsDialogOpen(true);
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
          <h6 className='allheading'> QUALIFICATION </h6>
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
              onClick={toggleBlockedQualifications}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={Qualifications.length > 0 || blockedQualifications.length > 0}>
          {Qualifications.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active Qualifications available. Please add a new Qualification.
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
                    {Qualifications.map((Qualification: any,index: number) => (
                      <TableRow key={Qualification.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{Qualification.name}</TableCell>
                        <TableCell className="small-cell">{Qualification.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(Qualification)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(Qualification)} style={{ padding: '1px' }}>
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
        {/* Blocked Qualifications Dialog */}
        <Dialog open={blockedQualificationsDialogOpen} onClose={() => setBlockedQualificationsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Qualifications</DialogTitle>
          <DialogContent>
            {blockedQualifications.length === 0 ? (
              <Typography className='confirmation-text'>No blocked Qualifications available.</Typography>
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
                  {blockedQualifications.map((Qualification: any,index:number) => (
                    <TableRow key={Qualification.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{Qualification.name}</TableCell>
                      <TableCell className="small-cell">{Qualification.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(Qualification)}>
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
            <Button onClick={() => setBlockedQualificationsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedQualification && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the Qualification "{selectedQualification.name}" (Code: {selectedQualification.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockQualification} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedQualification && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the Qualification "{selectedQualification.name}" (Code: {selectedQualification.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockQualification} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Qualification Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingQualification !== null ? 'Edit Qualification' : 'Add Qualification'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Qualification Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={QualificationName}
                onChange={(e) => setQualificationName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Qualification Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={QualificationCode}
                onChange={(e) => setQualificationCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingQualification !== null ? 'Update' : 'Add'}
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

export default Qualification;
