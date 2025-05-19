import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TableContainer, Card, Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Edit, Visibility, Block } from '@mui/icons-material';
import Header from '../../layouts/header/header';
import Loading from '../../loading/Loading';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import ActivitySectorApiService from '../../data/services/customer/activitySector/activitySector_api_service';

const ActivitySector: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [ActivitySectorName, setActivitySectorName] = useState('');
  const [ActivitySectorCode, setActivitySectorCode] = useState('');
  const [ActivitySectors, setActivitySectors] = useState<any[]>([]);
  const [blockedActivitySectors, setBlockedActivitySectors] = useState<any[]>([]);
  const [editingActivitySector, setEditingActivitySector] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedActivitySector, setSelectedActivitySector] = useState<any | null>(null);
  const [blockedActivitySectorsDialogOpen, setBlockedActivitySectorsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const ActivitySectorService = new ActivitySectorApiService();

  useEffect(() => {
    fetchActivitySectors();
    fetchBlockedActivitySectors()
  }, []);

  const fetchActivitySectors = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const ActivitySector = await ActivitySectorService.getActivitySector();
      const activeActivitySectors = ActivitySector.filter((c: any) => !c.isBlocked);
      setActivitySectors(activeActivitySectors);
    } catch (error) {
      console.error('Error fetching ActivitySectors:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlockedActivitySectors = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await ActivitySectorService.getDeactiveActivitySector();
      setBlockedActivitySectors(response);
    } catch (error) {
      console.error('Error fetching blocked ActivitySectors:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: ActivitySectorName, code: ActivitySectorCode, uid: loginDetails.id };
    try {
      if (editingActivitySector !== null) {
        await ActivitySectorService.updateActivitySector(editingActivitySector, payload);
        setEditingActivitySector(null);
        setSuccessMessage('ActivitySector updated successfully!');
      } else {
        await ActivitySectorService.CreateActivitySector(payload);
        setSuccessMessage('ActivitySector added successfully!');
      }
      setOpenSnackbar(true);
      setActivitySectorName('');
      setActivitySectorCode('');
      setDialogOpen(false);
      fetchActivitySectors();
    } catch (error) {
      console.error('Error saving ActivitySector:', error);
      setErrorMessage('Error saving ActivitySector.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (ActivitySector: any) => {
    setActivitySectorName(ActivitySector.name);
    setActivitySectorCode(ActivitySector.code);
    setEditingActivitySector(ActivitySector.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (ActivitySector: any) => {
    setSelectedActivitySector(ActivitySector);
    setConfirmBlockOpen(true);
  };

  const handleBlockActivitySector = async () => {
    if (selectedActivitySector !== null) {
      try {
        const euid = 1;
        await ActivitySectorService.deActivateActivitySector(selectedActivitySector.id, euid);
        setActivitySectors((prevActivitySectors) =>
          prevActivitySectors.filter((ActivitySector) => ActivitySector.id !== selectedActivitySector.id)
        );
        setBlockedActivitySectors((prevBlocked) => [
          ...prevBlocked,
          { ...selectedActivitySector, isBlocked: true }
        ]);
        setSuccessMessage(`ActivitySector blocked successfully!`);
        setSelectedActivitySector(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error blocking ActivitySector:', error);
        setErrorMessage('Error blocking ActivitySector.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleUnblockDialogOpen = (ActivitySector: any) => {
    setSelectedActivitySector(ActivitySector);
    setConfirmUnblockOpen(true);
  };

  const handleUnblockActivitySector = async () => {
    if (selectedActivitySector !== null) {
      try {
        await ActivitySectorService.unblockActivitySector(selectedActivitySector.id);
        setBlockedActivitySectors((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedActivitySector.id));
        setActivitySectors((prevActivitySectors) => [...prevActivitySectors, { ...selectedActivitySector, isBlocked: false }]);
        setSuccessMessage(`ActivitySector unblocked successfully!`);
        setSelectedActivitySector(null);
        setConfirmUnblockOpen(false);
        setBlockedActivitySectorsDialogOpen(false);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error unblocking ActivitySector:', error);
        setErrorMessage('Error unblocking ActivitySector.');
        setOpenSnackbar(true);
      }
    }
  };

  const openDialog = () => {
    setActivitySectorName('');
    setActivitySectorCode('');
    setEditingActivitySector(null);
    setDialogOpen(true);
  };

  const toggleBlockedActivitySectors = () => {
    setBlockedActivitySectorsDialogOpen(true);
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
          <h6 className='allheading'> ACTIVITY SECTOR </h6>
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
              onClick={toggleBlockedActivitySectors}
            >
              Show Blocked
            </Button>
          </div>
        </Box>
        <Loading isLoading={isLoading} hasError={hasError} hasData={ActivitySectors.length > 0 || blockedActivitySectors.length > 0}>
          {ActivitySectors.length === 0 ? (
            <Typography className='confirmation-text' variant="body1" color="textSecondary">
              No active ActivitySectors available. Please add a new ActivitySector.
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
                    {ActivitySectors.map((ActivitySector: any, index: number) => (
                      <TableRow key={ActivitySector.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell>
                        <TableCell className="small-cell">{ActivitySector.name}</TableCell>
                        <TableCell className="small-cell">{ActivitySector.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(ActivitySector)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(ActivitySector)} style={{ padding: '1px' }}>
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
        {/* Blocked ActivitySectors Dialog */}
        <Dialog open={blockedActivitySectorsDialogOpen} onClose={() => setBlockedActivitySectorsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked ActivitySectors</DialogTitle>
          <DialogContent>
            {blockedActivitySectors.length === 0 ? (
              <Typography className='confirmation-text'>No blocked ActivitySectors available.</Typography>
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
                  {blockedActivitySectors.map((ActivitySector: any, index: number) => (
                    <TableRow key={ActivitySector.id}>
                      <TableCell className="small-cell">{index + 1}</TableCell>
                      <TableCell className="small-cell">{ActivitySector.name}</TableCell>
                      <TableCell className="small-cell">{ActivitySector.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(ActivitySector)}>
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
            <Button onClick={() => setBlockedActivitySectorsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedActivitySector && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the ActivitySector "{selectedActivitySector.name}" (Code: {selectedActivitySector.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockActivitySector} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedActivitySector && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the ActivitySector "{selectedActivitySector.name}" (Code: {selectedActivitySector.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockActivitySector} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* ActivitySector Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingActivitySector !== null ? 'Edit ActivitySector' : 'Add ActivitySector'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="ActivitySector Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={ActivitySectorName}
                onChange={(e) => setActivitySectorName(e.target.value)}
              />
              <TextField className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="ActivitySector Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={ActivitySectorCode}
                onChange={(e) => setActivitySectorCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingActivitySector !== null ? 'Update' : 'Add'}
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

export default ActivitySector;