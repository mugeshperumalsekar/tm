
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
import SegmentApiService from '../../data/services/customer/segment/segment_api_services';

const Segment: React.FC = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [SegmentName, setSegmentName] = useState('');
  const [SegmentCode, setSegmentCode] = useState('');
  const [Segments, setSegments] = useState<any[]>([]);
  const [blockedSegments, setBlockedSegments] = useState<any[]>([]);
  const [editingSegment, setEditingSegment] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmUnblockOpen, setConfirmUnblockOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<any | null>(null);
  const [blockedSegmentsDialogOpen, setBlockedSegmentsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const SegmentService = new SegmentApiService();

  useEffect(() => {
    fetchSegments();
    fetchBlockedSegments()
  }, []);

  const fetchSegments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const Segment = await SegmentService.getSegment();
      const activeSegments = Segment.filter((c: any) => !c.isBlocked);
      setSegments(activeSegments);
    } catch (error) {
      console.error('Error fetching Segments:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBlockedSegments = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await SegmentService.getDeactiveSegment();
      setBlockedSegments(response);
    } catch (error) {
      console.error('Error fetching blocked Segments:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = { name: SegmentName, code: SegmentCode,  uid: loginDetails.id };
    try {
      if (editingSegment !== null) {
        await SegmentService.updateSegment(editingSegment, payload);
        setEditingSegment(null);
        setSuccessMessage('Segment updated successfully!');

      } else {
        await SegmentService.CreateSegment(payload);
        setSuccessMessage('Segment added successfully!');

      }
      setOpenSnackbar(true);
      setSegmentName('');
      setSegmentCode('');
      setDialogOpen(false);
      fetchSegments();
    } catch (error) {
      console.error('Error saving Segment:', error);
      setErrorMessage('Error saving Segment.');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (Segment: any) => {
    setSegmentName(Segment.name);
    setSegmentCode(Segment.code);
    setEditingSegment(Segment.id);
    setDialogOpen(true);
  };

  const handleBlockDialogOpen = (Segment: any) => {
    setSelectedSegment(Segment);
    setConfirmBlockOpen(true);
  };

  const handleBlockSegment = async () => {
    if (selectedSegment !== null) {
      try {
        const euid = 1;  
        await SegmentService.deActivateSegment(selectedSegment.id, euid);
  
        setSegments((prevSegments) =>
          prevSegments.filter((Segment) => Segment.id !== selectedSegment.id)
        );
  
        setBlockedSegments((prevBlocked) => [
          ...prevBlocked, 
          { ...selectedSegment, isBlocked: true }
        ]);
  
        setSuccessMessage(`Segment blocked successfully!`);
        setSelectedSegment(null);
        setConfirmBlockOpen(false);
        setOpenSnackbar(true);
  
      } catch (error) {
        console.error('Error blocking Segment:', error);
        setErrorMessage('Error blocking Segment.');
        setOpenSnackbar(true);
      }
    }
  };
  
  const handleUnblockDialogOpen = (Segment: any) => {
    setSelectedSegment(Segment);
    setConfirmUnblockOpen(true);
  };


  const handleUnblockSegment = async () => {
    if (selectedSegment !== null) {
      try {
        await SegmentService.unblockSegment(selectedSegment.id);

        setBlockedSegments((prevBlocked) => prevBlocked.filter((c) => c.id !== selectedSegment.id));
        setSegments((prevSegments) => [...prevSegments, { ...selectedSegment, isBlocked: false }]);
        setSuccessMessage(`Segment unblocked successfully!`);

        setSelectedSegment(null);
        setConfirmUnblockOpen(false);
        setBlockedSegmentsDialogOpen(false); 
        setOpenSnackbar(true);

      } catch (error) {
        console.error('Error unblocking Segment:', error);
        setErrorMessage('Error unblocking Segment.');
        setOpenSnackbar(true);
      }
    }
  };


  const openDialog = () => {
    setSegmentName('');
    setSegmentCode('');
    setEditingSegment(null);
    setDialogOpen(true);
  };

  const toggleBlockedSegments = () => {
    setBlockedSegmentsDialogOpen(true);
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
          <h6 className='allheading'> SEGMENT </h6>
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
              onClick={toggleBlockedSegments}
            >
              Show Blocked
            </Button>
          </div>

        </Box>


        <Loading isLoading={isLoading} hasError={hasError} hasData={Segments.length > 0 || blockedSegments.length > 0}>
          {Segments.length === 0 ? (
            <Typography className='confirmation-text'variant="body1" color="textSecondary">
              No active Segments available. Please add a new Segment.
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
                    {Segments.map((Segment: any,index: number) => (
                      <TableRow key={Segment.id}>
                        <TableCell className="small-cell">{index + 1}</TableCell> 

                        <TableCell className="small-cell">{Segment.name}</TableCell>
                        <TableCell className="small-cell">{Segment.code}</TableCell>
                        <TableCell className="small-cell">
                          <IconButton onClick={() => handleBlockDialogOpen(Segment)} >
                            <Visibility style={{ fontSize: '16px', color: "#1968dd" }} />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(Segment)} style={{ padding: '1px' }}>
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
        {/* Blocked Segments Dialog */}
        <Dialog open={blockedSegmentsDialogOpen} onClose={() => setBlockedSegmentsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle className="custom-dialog-title">Blocked Segments</DialogTitle>
          <DialogContent>
            {blockedSegments.length === 0 ? (
              <Typography className='confirmation-text'>No blocked Segments available.</Typography>
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
                  {blockedSegments.map((Segment: any,index:number) => (
                    <TableRow key={Segment.id}>
                       <TableCell className="small-cell">{index + 1}</TableCell> 
                      <TableCell className="small-cell">{Segment.name}</TableCell>
                      <TableCell className="small-cell">{Segment.code}</TableCell>
                      <TableCell className="small-cell">
                        <IconButton onClick={() => handleUnblockDialogOpen(Segment)}>
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
            <Button onClick={() => setBlockedSegmentsDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Unblock Confirmation Dialog */}
        <Dialog open={confirmUnblockOpen} onClose={() => setConfirmUnblockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Unblock</DialogTitle>
          <DialogContent>
            {selectedSegment && (
              <Typography className='confirmation-text'>
                Are you sure you want to unblock the Segment "{selectedSegment.name}" (Code: {selectedSegment.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnblockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUnblockSegment} color="primary">
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
        {/* Block Confirmation Dialog */}
        <Dialog open={confirmBlockOpen} onClose={() => setConfirmBlockOpen(false)}>
          <DialogTitle className="custom-dialog-title">Confirm Block</DialogTitle>
          <DialogContent>
            {selectedSegment && (
              <Typography className='confirmation-text'>
                Are you sure you want to block the Segment "{selectedSegment.name}" (Code: {selectedSegment.code})?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBlockOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBlockSegment} color="primary">
              Block
            </Button>
          </DialogActions>
        </Dialog>
        {/* Segment Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth
          maxWidth="md">
          <DialogTitle className="custom-dialog-title">{editingSegment !== null ? 'Edit Segment' : 'Add Segment'}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', gap: '3%' }}>
              <TextField  className="custom-textfield .MuiInputBase-root"
                autoFocus
                margin="dense"
                label="Segment Name"
                type="text"
                size="small"
                fullWidth
                autoComplete="off"
                variant="outlined"
                value={SegmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
 
              <TextField  className="custom-textfield .MuiInputBase-root"
                margin="dense"
                label="Segment Code"
                type="text"
                size="small"
                autoComplete="off"
                fullWidth
                variant="outlined"
                value={SegmentCode}
                onChange={(e) => setSegmentCode(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editingSegment !== null ? 'Update' : 'Add'}
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

export default Segment;
