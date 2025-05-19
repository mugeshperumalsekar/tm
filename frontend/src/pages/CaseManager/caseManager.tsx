import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Checkbox, SelectChangeEvent } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBell, faBolt } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from "../../layouts/header/header";
import SearchIcon from '@mui/icons-material/Search';
import CaseManagerApiService from "../../data/services/caseManager/caseManager-api-service";
import { AllPayload, UnAssignedPayload, AssignedToMePayload, CaseSearchPayload, AssigneePayload, PendingCasesPayload, ReportedAlertPayload, CasesPayload } from "../../data/services/caseManager/caseManager-payload";
import { useSelector } from "react-redux";
import TaskAssignApiService from "../../data/services/taskAssign/taskAssign_api_service";
import { TaskAssignBulkPayload } from "../../data/services/taskAssign/taskAssign_payload";
import { toast, ToastContainer } from "react-toastify";
import '../../pages/loader/loader.css';
import Loader from "../loader/loader";

interface User {
    id: number;
    fullName: string;
}

interface BulkData {
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
    isTaskAssigned: number;
}

const CaseManager: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails.id;
    const caseManager = new CaseManagerApiService();
    const [caseId, setCaseId] = useState<number>(0);
    const [productAccountNumber, setProductAccountNumber] = useState<string>("");
    const [caseDetails, setCaseDetails] = useState<CaseSearchPayload[]>([]);
    const [all, setAll] = useState<AllPayload[]>([]);
    const [unAssigned, setUnAssigned] = useState<UnAssignedPayload[]>([]);
    const [assignedToMe, setAssignedToMe] = useState<AssignedToMePayload[]>([]);
    const [assignee, setAssignee] = useState<AssigneePayload[]>([]);
    const [pendingCases, setPendingCases] = useState<PendingCasesPayload[]>([]);
    const [reportedAlert, setReportedAlert] = useState<ReportedAlertPayload[]>([]);
    const [cases, setCases] = useState<CasesPayload[]>([]);
    const [currentTable, setCurrentTable] = useState<"all" | "unassigned" | "assignedToMe" | "caseDetailsSearch" | "assignee" | null>(null);
    const [errors, setErrors] = useState<{ caseId?: string; productAccountNumber?: string }>({});
    const [grouping, setGrouping] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [selectedRowsForAll, setSelectedRowsForAll] = useState<number[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [user, setUser] = useState<User[]>([]);
    const [userError, setUserError] = useState<string>("");
    const searchApi = new TaskAssignApiService();
    const [alertCount, setAlertCount] = useState(0);
    const [caseCount, setCaseCount] = useState(0);
    const [toReportedCount, setToReportedCount] = useState(0);
    const [reportedCount, setReportedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeButton, setActiveButton] = useState<"all" | "unassigned" | "assignedToMe" | null>("all");

    useEffect(() => {
        fetchAll();
        fetchPendingCases();
        fetchReportedAlert();
        fetchCases();
        getCombinedUnassignedData();
        fetchAssignedDetails();
        fetchAccountDetails();
    }, []);

    const handleRowSelect = (hitId: number) => {
        if (selectedRows.includes(hitId)) {
            setSelectedRows(selectedRows.filter((id) => id !== hitId));
        } else {
            setSelectedRows([...selectedRows, hitId]);
        }
    };

    const handleSelectAll = () => {
        if (areAllSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(unAssigned.map((row) => row.hitId));
        }
    };

    const handleRowSelectForAll = (hitId: number) => {
        if (selectedRowsForAll.includes(hitId)) {
            setSelectedRowsForAll(selectedRowsForAll.filter((id) => id !== hitId));
        } else {
            setSelectedRowsForAll([...selectedRowsForAll, hitId]);
        }
    };

    const areAllSelectedForAll = all.length > 0 && selectedRowsForAll.length === all.length;
    const isIndeterminateForAll = selectedRowsForAll.length > 0 && selectedRowsForAll.length < all.length;

    const handleSelectAllForAll = () => {
        if (areAllSelectedForAll) {
            setSelectedRowsForAll([]);
        } else {
            setSelectedRowsForAll(all.map((row) => row.hitId));
        }
    };

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedUser(value);
        if (value) {
            setUserError("");
        }
    };

    const fetchAll = async () => {
        setIsLoading(true);
        try {
            const [allCases, unassignedData, assignedData] = await Promise.all([
                caseManager.getAll(),
                fetchUnassigned(),
                fetchAssignedToMe(),
            ]);
            if (allCases) {
                setAll(allCases);
                setReportedCount(allCases.length || 0);
                setCurrentTable("all");
            } else {
                setReportedCount(0);
            }
        } catch (error) {
            console.error(`Error fetching data in fetchAll:`, error);
            setReportedCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const [unassignedData, setUnassignedData] = useState<BulkData[]>([]);
    const taskAssignApiService = new TaskAssignApiService();
    const [bulkdata, setBulkData] = useState<BulkData[]>([]);

    const fetchAccountDetails = async () => {
        try {
            const account = await searchApi.getAccountDetails();
            const filteredAccount = account.filter((item: BulkData) => item.isTaskAssigned === 0);
            setBulkData(filteredAccount);
        } catch (error) {
            console.error("Error fetching the fetchAccountDetails:", error);
        }
    };

    const fetchAssignedDetails = async () => {
        try {
            const account = await searchApi.getAssignedData();
            setBulkData(account);
        } catch (error) {
            console.error("Error fetching the fetchAccountDetails:", error);
        }
    };

    const getCombinedUnassignedData = async () => {
        try {
            const [response1, response2] = await Promise.all([
                searchApi.getAccountDetails(),
                taskAssignApiService.getAssignedData(),
            ]);
            const data1 = Array.isArray(response1) ? response1 : [];
            const data2 = Array.isArray(response2) ? response2 : [];
            const combinedData = [...data1, ...data2];
            const assignedItems = new Set(
                combinedData
                    .filter(item => item.isTaskAssigned === 1)
                    .map(item => `${item.accHolderName}-${item.hitId}`)
            );
            const unassignedOnly = combinedData.filter(
                item => item.isTaskAssigned === 0 && !assignedItems.has(`${item.accHolderName}-${item.hitId}`)
            );
            console.log("CombinedData", combinedData);
            console.log("unassignedOnly", unassignedOnly);
            setUnassignedData(unassignedOnly);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchUnassigned = async () => {
        setIsLoading(true);
        try {
            const response = await caseManager.getUnassigned();
            if (response) {
                setUnAssigned(response);
                setAlertCount(response.length || 0);
                setCurrentTable("unassigned");
            } else {
                setAlertCount(0);
            }
        } catch (error) {
            console.error(`Error fetching the fetchUnassigned:`, error);
            setAlertCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAssignedToMe = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await caseManager.getAssignedToMe();
            if (response) {
                setAssignedToMe(response);
                setToReportedCount(response.length || 0);
                setCurrentTable("assignedToMe");
            } else {
                setToReportedCount(0);
            }
        } catch (error) {
            console.error(`Error fetching the fetchAssignedToMe:`, error);
            setError("Error fetching data. Please try again later.");
            setToReportedCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAssignee = async () => {
        try {
            const response = await caseManager.getAssignee();
            if (response) {
                setAssignee(response);
                setCurrentTable("assignee");
            }
        } catch (error) {
            console.error(`Error fetching the fetchAssignee:`, error);
        }
    };

    const fetchPendingCases = async () => {
        try {
            const response = await caseManager.getPendingCases();
            setPendingCases(response.length || 0);
        } catch (error) {
            console.error(`Error fetching the fetchPendingCases:`, error);
        }
    };

    const fetchReportedAlert = async () => {
        try {
            const statusId = 0;
            const response = await caseManager.getReported(2, statusId);
            setReportedAlert(response);
        } catch (error) {
            console.error(`Error fetching the fetchReportedAlert:`, error);
        }
    };

    const fetchCases = async () => {
        try {
            const statusId = 0;
            const response = await caseManager.getReported(3, statusId);
            setCases(response);
        } catch (error) {
            console.error(`Error fetching the fetchCases:`, error);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await caseManager.getCaseDetailsSearch(caseId as number, productAccountNumber);
            if (response) {
                setCaseDetails([response]);
                setCaseCount(response.length || 0);
                setCurrentTable("caseDetailsSearch");
            } else {
                setCaseCount(0);
            }
        } catch (error) {
            console.error(`Error fetching the case details:`, error);
            setCaseCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCaseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setCaseId(value);
        if (value > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, caseId: undefined }));
        }
    };

    const handleProductAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProductAccountNumber(value);
        if (value.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, productAccountNumber: undefined }));
        }
    };

    const toggleGrouping = () => {
        setGrouping((prev) => !prev);
    };

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const areAllSelected = unAssigned.length > 0 && selectedRows.length === unAssigned.length;
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < unAssigned.length;

    const handleSubmit = async () => {
        try {
            const selectedData = unAssigned.filter((item) => selectedRows.includes(item.hitId));
            const tasks = selectedData.map((item) => {
                const payload: TaskAssignBulkPayload = {
                    assignTo: 1,
                    assignBy: loginDetails,
                    accHolderName: item.accHolderName,
                    accountNumber: String(item.accnumber),
                    amount: item.amt,
                    riskId: item.riskId,
                    transCount: item.transCount,
                    hitId: item.hitId,
                    isTaskAssigned: 1,
                    euid: 1,
                    uid: loginDetails,
                    scenarioId: item.scenarioId,
                };
                console.log('TaskAssignBulkPayload Payload:', payload);
                return searchApi.CreateBulkTask(payload);
            });
            await Promise.all(tasks);
            setSelectedRows([]);
            toast.success("Selected tasks created successfully!");
            console.log("Selected tasks created successfully!");
            window.location.reload();
        } catch (error) {
            toast.error("Error in creating bulk tasks!");
            console.error("Error in creating bulk tasks:", error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, mt: 5, p: 2, caretColor: 'transparent' }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 16px",
                        backgroundColor: "#e3f2fd",
                        borderRadius: "4px",
                        marginBottom: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FontAwesomeIcon
                            icon={faExclamationCircle}
                            style={{ color: "red", fontSize: "22px" }}
                        />
                        <Box>
                            <Typography variant="h6" color="error" className="commonStyle">
                                <>
                                    {pendingCases} Pending Alerts
                                </>
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "purple",
                                borderRadius: "50%",
                                width: 25,
                                height: 25,
                                color: "white",
                                fontSize: "14px",
                            }}
                        >
                            <FontAwesomeIcon icon={faBolt} />
                        </Box>
                        <Typography variant="h6" color="purple">
                            <span style={{ display: 'block' }} className="commonStyle"><> {reportedAlert.length > 0 ? reportedAlert.length : 0} To Be Reported</></span>
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FontAwesomeIcon
                            icon={faBan}
                            style={{ fontSize: "20px", color: "#1976d2" }}
                        />
                        <Typography variant="h6" color="#1976d2">
                            <span style={{ display: 'block' }} className="commonStyle"><>{cases.length > 0 ? cases.length : 0} Cases</></span>
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "black",
                                borderRadius: "50%",
                                width: 25,
                                height: 25,
                                color: "white",
                                fontSize: "24px",
                                marginRight: 1,
                            }}
                        >
                            <FontAwesomeIcon icon={faBell} style={{ color: "white", fontSize: "14px" }} />
                        </Box>
                        <Typography variant="h6" color="black">
                            <span className="commonStyle" style={{ display: 'block' }}>{reportedCount} Reported Cases</span>
                        </Typography>
                    </Box>
                </Box>
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 2, border: '1px solid #d3d3d3' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {isLoading && <Loader />}
                            <Box sx={{ display: "flex", gap: 1, marginBottom: 1, flexWrap: "wrap" }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        whiteSpace: "normal",
                                        backgroundColor: activeButton === "all" ? "#3f51b5" : "",
                                        color: activeButton === "all" ? "#fff" : "",
                                    }}
                                    onClick={() => {
                                        setActiveButton("all");
                                        fetchAll();
                                    }}
                                >
                                    All
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        whiteSpace: "normal",
                                        backgroundColor: activeButton === "unassigned" ? "#3f51b5" : "",
                                        color: activeButton === "unassigned" ? "#fff" : "",
                                    }}
                                    onClick={() => {
                                        setActiveButton("unassigned");
                                        fetchUnassigned();
                                    }}
                                >
                                    Unassigned
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        whiteSpace: "normal",
                                        backgroundColor: activeButton === "assignedToMe" ? "#3f51b5" : "",
                                        color: activeButton === "assignedToMe" ? "#fff" : "",
                                    }}
                                    onClick={async () => {
                                        setActiveButton("assignedToMe");
                                        if (selectedRows.length > 0) {
                                            await handleSubmit();
                                        }
                                        await fetchAssignedToMe();
                                    }}
                                >
                                    Assigned to me
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Box sx={{ flex: 1, minWidth: '100px' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Case ID"
                                        size="small"
                                        type="number"
                                        value={caseId || ""}
                                        onChange={handleCaseIdChange}
                                        error={!!errors.caseId}
                                        helperText={errors.caseId}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                fontSize: '14px',
                                                padding: '4px 8px',
                                                height: '32px',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '1px',
                                            },
                                            '& .MuiFormHelperText-root': {
                                                fontSize: '12px',
                                                marginTop: '2px',
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                            },
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: '100px' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Product Account/Application Number"
                                        size="small"
                                        value={productAccountNumber}
                                        onChange={handleProductAccountNumberChange}
                                        error={!!errors.productAccountNumber}
                                        helperText={errors.productAccountNumber}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                fontSize: '14px',
                                                padding: '4px 8px',
                                                height: '32px',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: '1px',
                                            },
                                            '& .MuiFormHelperText-root': {
                                                fontSize: '12px',
                                                marginTop: '2px',
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                            },
                                        }}
                                    />
                                </Box>
                                <Box sx={{ height: '32px' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            height: '36px',
                                        }}
                                        startIcon={
                                            <SearchIcon
                                                sx={{ color: 'white' }}
                                            />
                                        }
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
                {isLoading ? (
                    <Loader />
                ) : (
                    currentTable === "all" && (
                        <TableContainer component={Paper}
                            sx={{
                                marginTop: 2,
                                maxHeight: '300px',
                                overflow: 'auto'
                            }}>
                            {all.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="serial-cell">
                                                <Checkbox
                                                    checked={areAllSelectedForAll}
                                                    indeterminate={isIndeterminateForAll}
                                                    onChange={handleSelectAllForAll}
                                                    sx={{ transform: "scale(0.8)" }}
                                                />
                                                S.No
                                            </TableCell>
                                            <TableCell className="MuiTableCell-head">Account Holder Name</TableCell>
                                            <TableCell className="MuiTableCell-head">Account Number</TableCell>
                                            <TableCell className="MuiTableCell-head">Risk Level</TableCell>
                                            <TableCell className="MuiTableCell-head" style={{ textAlign: 'right' }}>Amount</TableCell>
                                            <TableCell className="MuiTableCell-head">Transaction Count</TableCell>
                                            <TableCell className="MuiTableCell-head">Scenario</TableCell>
                                            <TableCell className="MuiTableCell-head">Remark</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {all.map((row, index) => (
                                            <TableRow key={row.hitId}>
                                                <TableCell className="serial-cell">
                                                    <Checkbox
                                                        checked={selectedRowsForAll.includes(row.hitId)}
                                                        onChange={() => handleRowSelectForAll(row.hitId)}
                                                        sx={{ transform: "scale(0.8)" }}
                                                    />
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="small-cell">{row.accHolderName || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.accnumber || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.risk || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell" style={{ textAlign: 'right' }}>{row.amt != null ? formatter.format(row.amt) : 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.transCount || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.scenario || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.remark || 'Not Available'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography variant="body1" align="center" sx={{ margin: 2 }}>
                                    No records found
                                </Typography>
                            )}
                        </TableContainer>
                    )
                )}
                {currentTable === "unassigned" && (
                    <>
                        <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '300px', overflow: 'auto' }}>
                            {unassignedData.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="serial-cell"> <span style={{ position: 'sticky', top: '0 !important', zIndex: '1 !important', marginLeft: '13%' }}>
                                                <Checkbox
                                                    checked={areAllSelected}
                                                    indeterminate={isIndeterminate}
                                                    onChange={handleSelectAll}
                                                    sx={{ transform: "scale(0.8)" }}
                                                />
                                            </span>S.No</TableCell>
                                            <TableCell className="MuiTableCell-head">Account Holder Name</TableCell>
                                            <TableCell className="MuiTableCell-head">Account Number</TableCell>
                                            <TableCell className="MuiTableCell-head">Risk Level</TableCell>
                                            <TableCell className="MuiTableCell-head" style={{ textAlign: 'right' }}>Amount</TableCell>
                                            <TableCell className="MuiTableCell-head">Transaction Count</TableCell>
                                            <TableCell className="MuiTableCell-head">Scenario</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {unassignedData.map((row, index) => (
                                            <TableRow key={row.hitId}>
                                                <TableCell className="serial-cell"><span >
                                                    <Checkbox
                                                        checked={selectedRows.includes(row.hitId)}
                                                        onChange={() => handleRowSelect(row.hitId)}
                                                        sx={{ transform: "scale(0.8)" }}
                                                    />
                                                </span>{index + 1}</TableCell>
                                                <TableCell className="small-cell">{row.accHolderName || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.accnumber || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.risk || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell" style={{ textAlign: 'right' }}>{row.amt != null ? formatter.format(row.amt) : 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.transCount || 'Not Available'}</TableCell>
                                                <TableCell className="small-cell">{row.scenario || 'Not Available'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography variant="body1" align="center" sx={{ margin: 2 }}>
                                    No records found
                                </Typography>
                            )}
                        </TableContainer>
                    </>
                )}
                {currentTable === "assignedToMe" && (
                    <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '300px', overflow: 'auto' }}>
                        {assignedToMe.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="MuiTableCell-head">S.No</TableCell>
                                        <TableCell className="MuiTableCell-head">UserName</TableCell>
                                        <TableCell className="MuiTableCell-head">Account Holder Name</TableCell>
                                        <TableCell className="MuiTableCell-head">Account Number</TableCell>
                                        <TableCell className="MuiTableCell-head" style={{ textAlign: 'right' }}>Amount</TableCell>
                                        <TableCell className="MuiTableCell-head">Transaction Count</TableCell>
                                        <TableCell className="MuiTableCell-head">Risk Level</TableCell>
                                        <TableCell className="MuiTableCell-head">Scenario</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignedToMe.map((row, index) => (
                                        <TableRow key={row.uid}>
                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                            <TableCell className="small-cell">{row.userName || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.accHolderName || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.accnumber || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell" style={{ textAlign: 'right' }}>{row.amt != null ? formatter.format(row.amt) : 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.transCount || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.risk || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.scenario || 'Not Available'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography variant="body1" align="center" sx={{ margin: 2 }}>
                                No records found
                            </Typography>
                        )}
                    </TableContainer>
                )}
                {currentTable === "caseDetailsSearch" && (
                    <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '300px', overflow: 'auto' }}>
                        {caseDetails.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="MuiTableCell-head">S.No</TableCell>
                                        <TableCell className="MuiTableCell-head">Source System</TableCell>
                                        <TableCell className="MuiTableCell-head">Case ID</TableCell>
                                        <TableCell className="MuiTableCell-head">Customer Name</TableCell>
                                        <TableCell className="MuiTableCell-head">Case Risk</TableCell>
                                        <TableCell className="MuiTableCell-head">Case Alert</TableCell>
                                        <TableCell className="MuiTableCell-head">Case Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {caseDetails.map((detail, index) => (
                                        <TableRow key={detail.caseId}>
                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                            <TableCell className="small-cell">{detail.sourceSystem || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{detail.caseId || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{detail.customerName || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{detail.caseRisk || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{detail.caseAlert || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{detail.caseStatus || 'Not Available'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography variant="body1" align="center" sx={{ margin: 2 }}>
                                No records found
                            </Typography>
                        )}
                    </TableContainer>
                )}
                {currentTable === "assignee" && (
                    <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '300px', overflow: 'auto' }}>
                        {assignee.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="MuiTableCell-head">S.No</TableCell>
                                        <TableCell className="MuiTableCell-head">User Name</TableCell>
                                        <TableCell className="MuiTableCell-head">Assigner Role</TableCell>
                                        <TableCell className="MuiTableCell-head">Account Holder Name</TableCell>
                                        <TableCell className="MuiTableCell-head">Account Number</TableCell>
                                        <TableCell className="MuiTableCell-head" style={{ textAlign: 'right' }}>Amount</TableCell>
                                        <TableCell className="MuiTableCell-head">Transaction Count</TableCell>
                                        <TableCell className="MuiTableCell-head">Risk Level</TableCell>
                                        <TableCell className="MuiTableCell-head">Scenario</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignee.map((row, index) => (
                                        <TableRow key={row.accnumber}>
                                            <TableCell className="small-cell">{index + 1}</TableCell>
                                            <TableCell className="small-cell">{row.userName || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.assignerRole || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.accHolderName || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.accnumber || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell" style={{ textAlign: 'right' }}>{row.amt != null ? formatter.format(row.amt) : 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.transCount || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.risk || 'Not Available'}</TableCell>
                                            <TableCell className="small-cell">{row.scenario || 'Not Available'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography variant="body1" align="center" sx={{ margin: 2 }}>
                                No records found
                            </Typography>
                        )}
                    </TableContainer>
                )}
            </Box>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Box>
    );
};

export default CaseManager;