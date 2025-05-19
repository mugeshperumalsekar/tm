import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent, Box, FormControl, InputLabel, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from '../../layouts/header/header';
import { Steps } from 'antd';
import { Typography, Snackbar, Alert } from '@mui/material';
import { List, All } from '../../data/services/viewpage/view_payload';
import ViewService from '../../data/services/viewpage/view_api_service';
import LevelApiService from '../../data/services/level/level_api_service';
import CaseSearch from '../Search/caseSearch';
import { useParams } from 'react-router-dom';

interface PendingAlert {
  id: string;
  alertBranchId: string;
  caseId: string;
  accHolderName: string;
  accnumber: string;
  remark: string;
  statusId: string;
  accountId: string;
  dt: string;
  level_id: string;
  risk: string;
  customerId: string;
  fileType: string;
  scenario: string;
  hitId: number;
  amt: number;
  transCount: number;
}

interface LevelStatus {
  caseId: number;
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
  level: string;
  status: string;
  createdAt: string;
}

interface Level {
  id: string;
  name: string;
}

interface BulkTask {
  searchName: string;
  userName: String;
  uid: number;
}

function LevelFlow() {

  const { Step } = Steps;
  const { ids } = useParams();
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
  const [List, setList] = useState<List[]>([]);
  const [RecordType, setRecordType] = useState<All[]>([]);
  const [BulkTaskAssignView, setBulkTaskAssignView] = useState<BulkTask[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<PendingAlert | null>(null);
  const [remarks, setRemarks] = useState('');
  const [activeButton, setActiveButton] = useState<null | 'pendingCase' | 'pendingRIF'>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showBulkTaskAssignView, setShowBulkTaskAssignView] = useState(true);
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const remarksRef = useRef<HTMLInputElement>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const hitdatalifecycleApiService = new LevelApiService();
  const levelServices = new LevelApiService();
  const authService = new LevelApiService();
  const levelService = new LevelApiService();
  const viewservice = new ViewService();

  const handlePendingAlertClick = async (value?: any) => {
    try {
      setLoading(true);
      let statusId = 0;
      if (value == 'pendingRIF') {
        statusId = 3;
      }
      if (value == 'pendingCase') {
        statusId = 0;
      }
      const results = await authService.getPendingAlertDetails(loginDetails, statusId);
      setPendingAlert(results);
      setActiveButton(value);
    } catch (error) {
      console.error("Error fetching pending alerts:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchLevelStatus = async () => {
    try {
      const results = await levelService.getLevelOneData(loginDetails);
      setLevelStatus(results);
    } catch (error) {
      console.error("Error fetching level statuses:", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const levels = await levelServices.getLevel();
      setLevels(levels);
    } catch (error) {
      console.error('Error fetching level:', error);
    }
  };

  useEffect(() => {
    handlePendingAlertClick('pendingCase');
    fetchLevelStatus();
    fetchLevels();
    fetchBulkTaskAssignView();
  }, [ids]);

  useEffect(() => {
    if (selectedAction && remarksRef.current) {
      remarksRef.current.focus();
    }
  }, [selectedAction]);

  const fetchBulkTaskAssignView = async () => {
    try {
      const uid = loginDetails.id;
      const BulkTaskAssign = await viewservice.getBulkTaskAssignView(uid);
      setBulkTaskAssignView(BulkTaskAssign);
      setShowBulkTaskAssignView(true);
    } catch (error) {
      console.error("Error fetching the fetchBulkTaskAssignView:", error);
    }
  };

  const handleIconClick = (index: PendingAlert, hitdataId: string | number) => {
    setSelectedAlert(index);
    setOpenDialog(true);
    handleoneRemark(hitdataId);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAction('');
    setRemarks('');
  };

  const handleoneRemark = async (hitdataId: any) => {
    try {
      const response = await authService.getsanRemarkending(hitdataId);
      setLevelOneRemark(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemarkRfi:", error);
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
        uid: loginDetails.id
      };
      try {
        setLoading(true);
        await hitdatalifecycleApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
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
      console.log("Selected action:", selectedAction);
      console.log("Remarks:", remarks);
      console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
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
    setSelectedAlert(alert);
    setSelectedAction('');
    setRemarks('');
  };

  const getStatusNameById = (levelId: number) => {
    const level = levels.find((c) => Number(c.id) === levelId);
    return level ? level.name : 'Not Available';
  };

  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4, caretColor: 'transparent' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {(levelStatus[0]?.levelId === 2 || levelStatus[0]?.levelId === 3 || levelStatus[0]?.levelId === 4) && (
              <h6 className='allheading'>{getStatusNameById(levelStatus[0]?.levelId)}</h6>
            )}
            <div>
              {levelStatus[0]?.levelId === 3 && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: activeButton === 'pendingCase' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                      color: 'white',
                      marginRight: '8px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontFamily: 'Open Sans',
                    }}
                    onClick={() => handlePendingAlertClick('pendingCase')}
                  >
                    PENDING CASE
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: activeButton === 'pendingRIF' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                      color: 'white',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontFamily: 'Open Sans',
                    }}
                    onClick={() => handlePendingAlertClick('pendingRIF')}
                  >
                    PENDING RIF
                  </Button>
                </>
              )}
            </div>
          </Box>
          {levelStatus[0]?.levelId === 1 && <CaseSearch />}
          {levelStatus[0]?.levelId !== 1 && (
            <>
              {/* <h6 className='allheading'>First Level Sec Search</h6> */}
              <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                  <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                    <TableRow className="tableHeading">
                      <TableCell sx={{ backgroundColor: '#D3D3D3', width: '50px' }}>S.No</TableCell>
                      <TableCell sx={{ backgroundColor: '#D3D3D3', width: '150px' }}>Account Name</TableCell>
                      <TableCell sx={{ backgroundColor: '#D3D3D3', width: '150px' }}>Account Number</TableCell>
                      <TableCell sx={{ backgroundColor: '#D3D3D3', width: '70px' }}>Risk</TableCell>
                      <TableCell align="left" sx={{ backgroundColor: '#D3D3D3', width: '100px' }}>Amount</TableCell>
                      <TableCell sx={{ backgroundColor: '#D3D3D3', width: '100px' }}>Scenario</TableCell>
                      <TableCell align="right" sx={{ backgroundColor: '#D3D3D3', width: '100px' }}>Trans Count</TableCell>
                      <TableCell sx={{ backgroundColor: '#D3D3D3', width: '50px' }}>Action</TableCell>
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
                          <TableCell align="left" >{alert.amt != null ? formatter.format(alert.amt) : 'Not Available'}</TableCell>
                          <TableCell >{alert.scenario}</TableCell>
                          <TableCell align="right" >{alert.transCount}</TableCell>
                          <TableCell >
                            <IconButton onClick={() => handleIconClick(alert, alert.hitId)} style={{ padding: '1px' }}>
                              <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" style={{ padding: '8px' }}>
                          <Typography variant="h6" color="textSecondary" className="commonStyle">
                            Not Available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Dialog className='MuiDialog-root'
            open={openDialog}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="md"
          >
            <DialogActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {selectedAlert && (
                <div >
                  <h6 className='allheading' style={{ color: '#333' }}>
                    {selectedAlert.accHolderName || 'Name Not Available'}
                  </h6>
                  <span style={{ color: '#555' }}>
                    {`Matching Score: ${selectedAlert.accnumber || 'Matching Score Not Available'}`}
                  </span>
                  <br />
                  <span style={{ color: '#555' }}>
                    {`Search Name: ${selectedAlert || 'Search Name  Not Available'}`}
                  </span>
                </div>
              )}
            </DialogActions>
            <hr />
            <DialogContent style={{ padding: '4px 20px' }}>
              <Box   >
                <Steps direction="vertical" size="small" current={levelOneRemark.length - 1} style={{ width: '100%' }}>
                  {levelOneRemark.map((remark, index) => (
                    <Step
                      key={index}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <h6 className='allheading' style={{ margin: 0 }}>{` ${remark.level}  `}</h6>
                          <span>{remark.status}</span>
                        </div>
                      }
                      description={
                        <div style={{ lineHeight: '20px' }}>
                          <span> {remark.createdAt}</span>
                          <br />
                          <span>{remark.remark}</span>
                        </div>
                      }
                    />
                  ))}
                </Steps>
              </Box>
            </DialogContent>

            {/* <DialogActions > */}
            <div style={{ padding: '4px 20px' }}>
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
              {/* </DialogActions> */}
            </div>

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

        </Box>
      </Box >

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

export default LevelFlow;