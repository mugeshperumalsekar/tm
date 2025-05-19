import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import AdverseMediaClassificationApiService from '../../data/services/customer/adverseMediaClassification/adverseMediaClassification_api_services';

const AdverseMediaClassification: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [AdverseMediaClassificationName, setAdverseMediaClassificationName] = useState('');
  const [AdverseMediaClassificationCode, setAdverseMediaClassificationCode] = useState('');
  const [AdverseMediaClassifications, setAdverseMediaClassifications] = useState<any[]>([]);
  const [blockedAdverseMediaClassifications, setBlockedAdverseMediaClassifications] = useState<any[]>([]);
  const [editingAdverseMediaClassification, setEditingAdverseMediaClassification] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedAdverseMediaClassification, setSelectedAdverseMediaClassification] = useState<any | null>(null);
  const [blockedAdverseMediaClassificationsDialogOpen, setBlockedAdverseMediaClassificationsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const AdverseMediaClassificationService = new AdverseMediaClassificationApiService();

  useEffect(() => {
    fetchAdverseMediaClassifications();
    fetchBlockedAdverseMediaClassifications()
  }, []);

  const fetchAdverseMediaClassifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const AdverseMediaClassification = await AdverseMediaClassificationService.getAdverseMediaClassification();
      const activeAdverseMediaClassifications = AdverseMediaClassification.filter((c: any) => !c.isBlocked);
      setAdverseMediaClassifications(activeAdverseMediaClassifications);
    } catch (error) {
      console.error('Error fetching AdverseMediaClassifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedAdverseMediaClassifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await AdverseMediaClassificationService.getDeactiveAdverseMediaClassification();
      setBlockedAdverseMediaClassifications(response);
    } catch (error) {
      console.error('Error fetching blocked AdverseMediaClassifications:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: AdverseMediaClassificationName, code: AdverseMediaClassificationCode, uid: loginDetails.id };
    try {
      if (editingAdverseMediaClassification !== null) {
        await AdverseMediaClassificationService.updateAdverseMediaClassification(editingAdverseMediaClassification, payload);
        setEditingAdverseMediaClassification(null);
        setSuccessMessage('AdverseMediaClassification updated successfully!');
      } else {
        await AdverseMediaClassificationService.CreateAdverseMediaClassification(payload);
        setSuccessMessage('AdverseMediaClassification added successfully!');
      }
      setOpenSnackbar(true);
      setAdverseMediaClassificationName('');
      setAdverseMediaClassificationCode('');
      setDialogOpen(false);
      fetchAdverseMediaClassifications();
    } catch (error) {
      console.error('Error saving AdverseMediaClassification:', error);
      setErrorMessage('Error saving AdverseMediaClassification.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (AdverseMediaClassification: any) => {
    setAdverseMediaClassificationName(AdverseMediaClassification.name);
    setAdverseMediaClassificationCode(AdverseMediaClassification.code);
    setEditingAdverseMediaClassification(AdverseMediaClassification.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (AdverseMediaClassification: any) => {
    setSelectedAdverseMediaClassification(AdverseMediaClassification);
    setConfirmBlockOpen(true);
  };

  const handleBlockAdverseMediaClassification = async () => {
    if (selectedAdverseMediaClassification !== null) {
      try {
        const euid = 1;
        await AdverseMediaClassificationService.deActivateAdverseMediaClassification(selectedAdverseMediaClassification.id, euid);
        setAdverseMediaClassifications((prevAdverseMediaClassifications) =>
          prevAdverseMediaClassifications.filter((AdverseMediaClassification) => AdverseMediaClassification.id !== selectedAdverseMediaClassification.id)
        );
        setBlockedAdverseMediaClassifications((prevBlocked) => [
          ...prevBlocked,
          { ...selectedAdverseMediaClassification, isBlocked: true }
        ]);
        setSuccessMessage(`AdverseMediaClassification blocked successfully!`);
        setSelectedAdverseMediaClassification(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error blocking AdverseMediaClassification:', error);
        setErrorMessage('Error blocking AdverseMediaClassification.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (AdverseMediaClassification: any) => {
    setSelectedAdverseMediaClassification(AdverseMediaClassification);
    setConfirmUnblockOpen(true);
  };

  const handleUnblockAdverseMediaClassification = async () => {
    if (selectedAdverseMediaClassification !== null) {
      try {
        await AdverseMediaClassificationService.unblockAdverseMediaClassification(selectedAdverseMediaClassification.id);
        setBlockedAdverseMediaClassifications((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedAdverseMediaClassification.id));
        setAdverseMediaClassifications((prevAdverseMediaClassifications) => [...prevAdverseMediaClassifications, { ...selectedAdverseMediaClassification, isBlocked: false }]);
        setSuccessMessage(`AdverseMediaClassification unblocked successfully!`);
        setSelectedAdverseMediaClassification(null);
        setConfirmUnblockOpen(false);
        setBlockedAdverseMediaClassificationsDialogOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error unblocking AdverseMediaClassification:', error);
        setErrorMessage('Error unblocking AdverseMediaClassification.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setAdverseMediaClassificationName('');
    setAdverseMediaClassificationCode('');
    setEditingAdverseMediaClassification(null);
    setDialogOpen(true);
  };

  const toggleBlockedAdverseMediaClassifications = () => {
    setBlockedAdverseMediaClassificationsDialogOpen(true);
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
          <h6 className='allheading'> ADVERSEMEDIA CLASSIFICATION </h6>
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
              onClick={toggleBlockedAdverseMediaClassifications}
            >
              Show Blocked
            </Button>
          </div>
        </Box>
        <Loading isLoading={isLoading} hasError={hasError} hasData={AdverseMediaClassifications.length > 0 || blockedAdverseMediaClassifications.length > 0}>
          {AdverseMediaClassifications.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active AdverseMediaClassifications available. Please add a new AdverseMediaClassification.
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
                    {AdverseMediaClassifications.map((AdverseMediaClassification: any, index: number) => (
                      <TableRow key={AdverseMediaClassification.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>
                        <TableCell className="small-cell">{AdverseMediaClassification.name}</TableCell>
                        <TableCell className="small-cell">{AdverseMediaClassification.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(AdverseMediaClassification)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(AdverseMediaClassification)} style={{ padding: '1px' }}>
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
        {/* Blocked AdverseMediaClassifications Dialog */}
        <Dialog open={blockedAdverseMediaClassificationsDialogOpen} onClose={() => setBlockedAdverseMediaClassificationsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked AdverseMediaClassifications</DialogTitle>
          <DialogContent>
            {blockedAdverseMediaClassifications.length === 0 ? (
              <Typography className='confirmation-text'>No blocked AdverseMediaClassifications available.</Typography>
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
                  {blockedAdverseMediaClassifications.map((AdverseMediaClassification: any, index: number) => (
                    <TableRow key={AdverseMediaClassification.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{AdverseMediaClassification.name}</TableCell>
                      <TableCell className="small-cell">{AdverseMediaClassification.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(AdverseMediaClassification)}>
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
            <Button onClick={() => setBlockedAdverseMediaClassificationsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedAdverseMediaClassification && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the AdverseMediaClassification "{selectedAdverseMediaClassification.name}" (Code: {selectedAdverseMediaClassification.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockAdverseMediaClassification} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedAdverseMediaClassification && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the AdverseMediaClassification "{selectedAdverseMediaClassification.name}" (Code: {selectedAdverseMediaClassification.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockAdverseMediaClassification} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* AdverseMediaClassification Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingAdverseMediaClassification !== null ? 'Edit AdverseMediaClassification' : 'Add AdverseMediaClassification'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="AdverseMediaClassification Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={AdverseMediaClassificationName}
                onChange={(e) => setAdverseMediaClassificationName(e.target.value)}
              />

              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="AdverseMediaClassification Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={AdverseMediaClassificationCode}
                onChange={(e) => setAdverseMediaClassificationCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingAdverseMediaClassification !== null ? 'Update' : 'Add'}
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

export default AdverseMediaClassification;
