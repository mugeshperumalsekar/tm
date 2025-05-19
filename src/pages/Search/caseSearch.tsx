import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, IconButton } from '@mui/material';
import { Box, TextField, Button, InputLabel, FormControl, Select, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { All } from '../../data/services/viewpage/view_payload';
import ViewService from '../../data/services/viewpage/view_api_service';
import { useSelector } from 'react-redux';
import { SelectChangeEvent } from '@mui/material/Select';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Snackbar, Alert } from '@mui/material';
import CaseStatusApiService from '../../data/services/caseStatus/caseStatus_api_service';
import LevelApiService from '../../data/services/level/level_api_service';
import Loader from '../loader/loader';

interface Notification {
  hitId: number;
  accHolderName: string;
  accnumber: string;
  amt: number;
  risk: string;
  scenario: string;
  created_at: string;
  transCount: number;
  createdBy: number;
  customerId: number;
  caseId: number;
  accountId: number;
}

interface BulkTask {
  id: string;
  hitId: number;
  riskId: number;
  scenarioId: number;
  accHolderName: string;
  accountNumber: string;
  amount: number;
  risk: string;
  scenario: string;
  created_at: string;
  transCount: number;
  createdBy: number;
  customerId: number;
  statusId: string;
  accountId: number;
  caseId: number;
  dt: string;
  level_id: string;
  fileType: string;
}

interface LevelStatus {
  id: number;
  levelId: number;
  statusId: number;
  uid: number;
  status: string;
  passingLevelId: number;
  isAlive: number;
}

interface Remark {
  remark: string;
  createdAt: string;
  level: string;
  status: string;
}

interface PendingAlert {
  id: string;
  hitId: number;
  riskId: number;
  scenarioId: number;
  accHolderName: string;
  accnumber: string;
  amt: number;
  risk: string;
  scenario: string;
  created_at: string;
  transCount: number;
  createdBy: number;
  customerId: number;
  statusId: string;
  accountId: number;
  caseId: number;
  dt: string;
  level_id: string;
  fileType: string;
}

interface Task {
  hitId: number;
  [key: string]: any;
}

const CaseSearch = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const { id } = useParams();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [RecordType, setRecordType] = useState<All[]>([]);
  const viewservice = new ViewService();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [remarks, setRemarks] = useState('');
  const [selectedRow, setSelectedRow] = useState<Notification | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<PendingAlert | BulkTask | null>(null);
  const remarksRef = useRef<HTMLInputElement>(null);
  // const [loading, setLoading] = useState(false);
  const levelApiService = new LevelApiService();
  const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
  const authService = new LevelApiService();
  const authApiService = new CaseStatusApiService();
  const [BulkTaskAssignView, setBulkTaskAssignView] = useState<BulkTask[]>([]);
  const [showBulkTaskAssignView, setShowBulkTaskAssignView] = useState(true);
  const [activeButton, setActiveButton] = useState<null | 'pendingCase' | 'pendingRIF'>(null);
  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
  const [processedTasks, setProcessedTasks] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    handlePendingRIFClick();
  }, [page, rowsPerPage, processedTasks]);

  useEffect(() => {
    if (selectedStatus && remarksRef.current) {
      remarksRef.current.focus();
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchLevelStatus();
    fetchNotifications();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event: { key: any; }) => {
      if (!cardRef.current) return;
      const { key } = event;
      const element = cardRef.current;
      if (key === 'ArrowUp') {
        element.scrollTop -= 50;
      } else if (key === 'ArrowDown') {
        element.scrollTop += 50;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchLevelStatus = async () => {
    try {
      const results = await authApiService.getLevelOneData(loginDetails);
      setLevelStatus(results);
    } catch (error) {
      console.error("Error fetching level statuses:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notifications = await authApiService.getNotification();
      setPendingAlert(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedAction(event.target.value);
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const handleRemarksSubmit = async () => {
    if (selectedAlert) {
      const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));
      if (!selectedStatus) {
        console.error("Selected status not found.");
        return;
      }
      const hitrecordlifecyclePayload = {
        hitId: Number(selectedAlert.hitId),
        accountId: Number(selectedAlert.accountId),
        statusId: selectedStatus.statusId,
        caseId: 0,
        remark: remarks,
        level_id: loginDetails.accessLevel,
        customerId: Number(selectedAlert.customerId),
        valid: 0,
        isAlive: selectedStatus.isAlive,
        passingLevelId: selectedStatus.passingLevelId,
        uid: loginDetails.id,
      };
      try {
        setLoading(true);
        await levelApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
        const processedTasks = JSON.parse(localStorage.getItem('processedTasks') || '[]');
        processedTasks.push(selectedAlert.hitId);
        localStorage.setItem('processedTasks', JSON.stringify(processedTasks));
        await handlePendingAlertClick();
        setSnackbarMessage('Saved successfully!');
        setOpenSnackbar(true);
        setSelectedAction('');
        setRemarks('');
      } catch (error) {
        console.error("Error saving data:", error);
        setSnackbarMessage('Failed to save.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    }
    setOpenDialog(false);
  };

  const handleTableRowClick = async (alert: PendingAlert, customerId: number, accountId: number, hitId: number) => {
    const content = (
      <iframe
        src={`/CustomerDetails/${customerId}/${accountId}/${hitId}`}
        title='Customer Details'
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    );
    setModalContent(content);
    setIsModalOpen(true);
    setSelectedAlert(alert)
    setSelectedAction('');
    setRemarks('');
  };

  const handleTableRowDateClick = async (task: BulkTask, customerId: number, accountId: number, hitId: number) => {
    try {
      setLoading(true);
      const content = (
        <iframe
          src={`/CustomerDetails/${customerId}/${accountId}/${hitId}`}
          title='Customer Details'
          style={{ width: '100%', height: '80vh', border: 'none' }}
        />
      );
      setModalContent(content);
      setIsModalOpen(true);
      setSelectedAlert(task)
      setSelectedAction('');
      setRemarks('');
    } catch (error) {
      console.log('Error fetching the handleTableRowDateClick:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleoneRemark = async (hitdataId: any) => {
    try {
      const response = await authService.getsanRemarkending(hitdataId);
      setLevelOneRemark(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemarkRfi:", error);
    }
  };

  const handleIconClick = (index: BulkTask, hitdataId: number) => {
    setSelectedAlert(index);
    setOpenDialog(true);
    handleoneRemark(hitdataId);
  };

  const handlePendingIconClick = (index: PendingAlert, hitdataId: number) => {
    setSelectedAlert(index);
    setOpenDialog(true);
    handleoneRemark(hitdataId);
  };

  const handlePendingAlertClick = async () => {
    try {
      setLoading(true);
      const notifications = await authApiService.getNotification();
      setNotifications(notifications);
      setShowPendingCaseTable(true);
      setShowPendingRIFTable(false);
      setActiveButton('pendingCase');
      console.log("noti:", notifications)
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePendingRIFClick = async () => {
    try {
      setLoading(true);
      const BulkTaskAssign = await authApiService.getAssignedTask();
      const processedTasks = JSON.parse(localStorage.getItem('processedTasks') || '[]');
      const unprocessedTasks = BulkTaskAssign.filter((task: { hitId: any; }) => !processedTasks.includes(task.hitId));
      setBulkTaskAssignView(unprocessedTasks);
      setShowBulkTaskAssignView(true);
      setShowPendingRIFTable(true);
      setShowPendingCaseTable(false);
      setActiveButton('pendingRIF');
    } catch (error) {
      console.error("Error fetching the fetchBulkTaskAssignView:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearProcessedTasks = () => {
    localStorage.removeItem('processedTasks');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAction('');
    setRemarks('');
  };

  const riskLevels: { [key: string]: string } = {
    "1": "Low",
    "2": "Medium",
    "3": "High",
    "4": "Very High"
  };

  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginRight: '-3%' }}>
            <h6 className='allheading' style={{ marginLeft: '-4%' }} >WORK FLOW </h6>
            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: activeButton === 'pendingRIF' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                  color: 'white',
                  padding: '4px 8px',
                  marginRight: '8px'
                }}
                className='commonButton'
                onClick={handlePendingRIFClick}
              >
                PENDING ALERT
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: activeButton === 'pendingCase' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                  color: 'white',
                  marginRight: '8px',
                  padding: '4px 8px',
                }}
                className='commonButton'
                onClick={handlePendingAlertClick}
              >
                FIRSTLEVEL DATA
              </Button>
            </Box>
          </Box>

          <Box m={2}>
            <div>
              <div className="table-responsive" style={{ marginLeft: '-6%', marginRight: '-5%' }}>
                {/* Assigned data */}
                {loading && <Loader />}
                {showPendingRIFTable && (
                  <>
                    {showBulkTaskAssignView ? (
                      <TableContainer component={Card} style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        <Table size="small" aria-label="a dense table" style={{ minWidth: '600px' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell className="MuiTableCell-head">S.No</TableCell>
                              <TableCell className="MuiTableCell-head">Account Name</TableCell>
                              <TableCell className="MuiTableCell-head">Account Number</TableCell>
                              <TableCell className="MuiTableCell-head" style={{ textAlign: 'right' }}>Amount</TableCell>
                              <TableCell className="MuiTableCell-head">Risk Level</TableCell>
                              <TableCell className="MuiTableCell-head">Trans Count</TableCell>
                              <TableCell className="MuiTableCell-head">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {BulkTaskAssignView.length > 0 ? (
                              BulkTaskAssignView.map((task, index) => (
                                <TableRow key={task.hitId}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Task a:", task);
                                        console.log("Customer ID a:", Number(task.customerId));
                                        console.log("Account ID a:", Number(task.accountId));
                                        console.log("Hit ID a:", task.hitId);
                                        handleTableRowDateClick(task, Number(task.customerId), Number(task.accountId), task.hitId);
                                      }}
                                      style={{
                                        cursor: 'pointer',
                                        color: '#1677FF',
                                        textDecoration: 'underline',
                                        fontSize: '12px',
                                      }}
                                    >
                                      {task.accHolderName}
                                    </a>
                                  </TableCell>
                                  <TableCell>{task.accountNumber}</TableCell>
                                  <TableCell style={{ textAlign: 'right' }}>{task.amount != null ? formatter.format(task.amount) : 'Not Available'}</TableCell>
                                  <TableCell>{riskLevels[task.riskId] || 'Not Available'}</TableCell>
                                  <TableCell>{task.transCount}</TableCell>
                                  <TableCell>
                                    <IconButton onClick={() => handleIconClick(task, task.hitId)} style={{ padding: '1px' }}>
                                      <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={8} align="center" style={{ padding: '8px' }}>
                                  <Typography variant="h6" color="textSecondary" className="commonStyle">
                                    No Records
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : null}
                  </>
                )}
                {/* First Level Data */}
                {showPendingCaseTable && (
                  <>
                    <TableContainer component={Card} style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      <Table size="small" aria-label="a dense table" style={{ minWidth: '600px' }}>
                        <TableHead >
                          <TableRow>
                            <TableCell className="MuiTableCell-head">S.No</TableCell>
                            <TableCell className="MuiTableCell-head">Account Name</TableCell>
                            <TableCell className="MuiTableCell-head">Account Number</TableCell>
                            <TableCell className="MuiTableCell-head">Risk Level</TableCell>
                            <TableCell className="MuiTableCell-head" style={{ textAlign: 'right' }}>Amount</TableCell>
                            <TableCell className="MuiTableCell-head">Scenario</TableCell>
                            <TableCell className="MuiTableCell-head">Trans Count</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={8} align="center" style={{ padding: '16px' }}>
                                <Typography variant="body1">Loading...</Typography>
                              </TableCell>
                            </TableRow>
                          ) : pendingAlert.length > 0 ? (
                            pendingAlert.map((alert, index) => (
                              <TableRow key={alert.id} style={{ height: '32px' }}>
                                <TableCell style={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                <TableCell>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleTableRowClick(alert, Number(alert.customerId), alert.hitId, Number(alert.accountId));
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      color: '#1677FF',
                                      textDecoration: 'underline',
                                      fontSize: '12px',
                                    }}
                                  >
                                    {alert.accHolderName}
                                  </a>
                                </TableCell>
                                <TableCell>{alert.accnumber}</TableCell>
                                <TableCell>{alert.risk}</TableCell>
                                <TableCell style={{ textAlign: 'right' }}>{alert.amt != null ? formatter.format(alert.amt) : 'Not Available'}</TableCell>
                                <TableCell>{alert.scenario}</TableCell>
                                <TableCell>{alert.transCount}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} align="center" style={{ padding: '8px' }}>
                                <Typography variant="h6" color="textSecondary" className="commonStyle">
                                  No Records
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Box>

      <Dialog className='MuiDialog-root'
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogContent >
          <Box   >
            <DialogTitle className="custom-dialog-title">Remarks and Actions</DialogTitle>
            <FormControl className="custom-textfield .MuiInputBase-root" fullWidth margin="normal">
              <InputLabel className="custom-textfield .MuiInputBase-root">Status</InputLabel>
              <Select className="custom-textfield .MuiInputBase-root"
                size='small'
                value={selectedAction}
                onChange={handleStatusChange}
                label="Status"
              >
                {levelStatus.map((status: any) => (
                  <MenuItem className="custom-menu-item" key={status.id} value={status.id}>
                    {status.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedAction && (
              <TextField className="custom-textfield .MuiInputBase-root"
                size='small'
                autoFocus
                margin="dense"
                id="outlined-multiline-static"
                label="Remarks"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={remarks}
                defaultValue="Default Value"
                onChange={handleRemarksChange}
                style={{ maxHeight: '150px' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {selectedAction && (
            <Button onClick={handleRemarksSubmit} variant="contained" color="primary">
              Save
            </Button>
          )}
        </DialogActions>
        <br></br>
      </Dialog>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="xl">
        <DialogContent>
          {modalContent}
        </DialogContent>
        <DialogActions>
          <button type="button" className="btn btn-outline-primary" onClick={() => setIsModalOpen(false)}>Close</button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  );

}

export default CaseSearch;