import { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, SelectChangeEvent, Select, MenuItem, InputLabel, FormControl, Typography, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Card, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Table, TableHead, TableRow, TableCell, TableBody, TextareaAutosize } from '@mui/material';
import AlertViewApiService from '../../data/services/alert/alert-api-service';
import { AlertPayload } from '../../data/services/alert/alert-payload';
import { useSelector } from 'react-redux';
import Loader from '../loader/loader';

interface LevelStatus {
    id: number;
    levelId: number;
    statusId: number;
    uid: number;
    status: string;
    passingLevelId: number;
    isAlive: number;
}

interface Document {
    name: string;
}

const AlertGeneral = () => {

    const alertApiService = new AlertViewApiService();
    const { customerId, hitId, accountId } = useParams();
    const [alerts, setAlerts] = useState<AlertPayload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [selectedAction, setSelectedAction] = useState<string>('0');
    const [fileError, setFileError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [remarks, setRemarks] = useState('');
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [document, setDocument] = useState<Document | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [imageIds, setImageIds] = useState<string[]>([]);
    const documentView = new AlertViewApiService();
    const [isFetchDocumentEnabled, setIsFetchDocumentEnabled] = useState(false);

    useEffect(() => {
        const fetchAlertDetails = async () => {
            try {
                setIsLoading(true);
                const alertData = await alertApiService.getAlertDetails(hitId);
                setAlerts(alertData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching the fetchAlertDetails:", error);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAlertDetails();
        fetchLevelStatus();
    }, [hitId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setFileError(null);
        } else {
            setSelectedFile(null);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedAction(event.target.value);
    };

    const fetchLevelStatus = async () => {
        try {
            const results = await alertApiService.getLevelOneData(3);
            setLevelStatus(results);
        } catch (error) {
            console.error("Error fetching level statuses:", error);
        }
    };

    const handleButtonClick = async (customerId: number, accountId: number, alertId: number, fileType: string) => {
        try {
            if (fileType === 'image') {
                const imageData = await documentView.getImage(customerId, accountId, alertId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Image(base64String);
            } else if (fileType === 'pdf') {
                const pdfData = await documentView.getPDF(customerId, accountId, alertId);
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const handleFetchDocumentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (customerId && accountId && hitId) {
            handleButtonClick(
                parseInt(customerId),
                parseInt(accountId),
                parseInt(hitId),
                'pdf'
            );
        } else {
            console.error('Missing parameters in URL');
        }
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const binary = new Uint8Array(buffer);
        const bytes = [];
        for (let i = 0; i < binary.length; i++) {
            bytes.push(String.fromCharCode(binary[i]));
        }
        const base64String = btoa(bytes.join(''));
        return `data:image/png;base64,${base64String}`;
    };

    const MAX_FILE_SIZE_MB = 20;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const handleRemarksChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRemarks(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            console.error("No file selected");
            setFileError("File is required!");
            return;
        }
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            console.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB`);
            alert(`File size exceeds ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`);
            setFileError(`File size exceeds ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`);
            return;
        }
        console.log("Uploading file:", selectedFile);
        try {
            const alertId = parseInt(hitId || "0", 10);
            const customerIdValue = parseInt(customerId || "0", 10);
            const accountIdValue = parseInt(accountId || "0", 10);
            const imgName = selectedFile.name;
            const response = await alertApiService.saveDocument(
                [selectedFile],
                alertId,
                customerIdValue,
                accountIdValue,
                imgName
            );
            console.log("File uploaded successfully:", response);
            setSuccessMessage("File Uploaded Successfully!");
            setIsFetchDocumentEnabled(true);
        } catch (error) {
            console.error("Error during file upload:", error);
            setIsFetchDocumentEnabled(false);
        }
    };

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const handleRemarks = async () => {
        const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));
        if (!selectedStatus) {
            console.error("Selected status not found.");
            return;
        }
        const LevelFlowPayload = {
            hitId: hitId ? parseInt(hitId, 10) : 0,
            accountId: accountId ? parseInt(accountId, 10) : 0,
            customerId: customerId ? parseInt(customerId, 10) : 0,
            statusId: selectedStatus.statusId,
            caseId: 0,
            remark: remarks,
            level_id: loginDetails.accessLevel,
            valid: 1,
            isAlive: selectedStatus.isAlive,
            passingLevelId: selectedStatus.passingLevelId,
            uid: loginDetails.id
        };
        console.log('LevelFlowPayload:', LevelFlowPayload);
        try {
            await alertApiService.createStatus(LevelFlowPayload);
            console.log('Status successfully updated');
            handleSubmit();
        } catch (error) {
            console.log('Error Inserting the handleRemarks:', error);
        }
    };

    const handleCloseImageModals = () => {
        setShowImageModal(false);
    };

    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({
        base64: null,
        filename: null,
    });

    return (
        <>
            <Box>
                {isLoading && <Loader />}
                <Card style={{
                    padding: '1%',
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                    width: '100%',
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={8} md={6}>
                            <h5>Alert Name</h5>
                            <span>
                                <b>Scenario : </b>
                                {alerts[0]?.scenario || 'Not Available'}
                            </span>
                        </Grid>
                    </Grid>
                </Card>
                <Card style={{
                    padding: '1%',
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                    width: '100%',
                    marginTop: '1%'
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <span><b>Number Of Alert : </b>{alerts.length || 'Not Available'}</span>
                        </Grid>
                    </Grid>
                    <div>
                        <span><u><b>Transaction Details : </b></u></span>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Transaction Count</TableCell>
                                    <TableCell>Account Number</TableCell>
                                    <TableCell>Risk Level</TableCell>
                                    <TableCell>Remark</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {alerts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" style={{ padding: '16px' }}>
                                            <Typography variant="h6" color="textSecondary" style={{ fontSize: '12px' }}>
                                                No Records Found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    alerts.map((alert, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{alert.amount != null ? formatter.format(alert.amount) : 'Not Available'}</TableCell>
                                            <TableCell>{alert.trans_count || 'Not Available'}</TableCell>
                                            <TableCell>{alert.acc_number || 'Not Available'}</TableCell>
                                            <TableCell>{alert.risk || 'Not Available'}</TableCell>
                                            <TableCell>{alert.remark || 'Not Available'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
                <br></br>
                <h5>Audit Log</h5>
                <Card style={{
                    padding: '1%',
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                    width: '100%',
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={8}>
                            <TextareaAutosize
                                style={{ width: '100%', minHeight: '16px', resize: 'none' }}
                                placeholder="Type here..."
                                autoFocus
                                id="outlined-multiline-static"
                                value={remarks}
                                minRows={3}
                                onChange={handleRemarksChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel htmlFor="record-type" className='commonStyle'>Status</InputLabel>
                                <Select
                                    label="Status"
                                    size='small'
                                    variant="outlined"
                                    className='commonStyle'
                                    value={selectedAction}
                                    onChange={handleStatusChange}
                                    style={{ width: '100%' }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                overflowY: 'auto',
                                            },
                                        },
                                        disableScrollLock: true,
                                        disablePortal: true,
                                    }}
                                >
                                    {levelStatus.map((status: any) => (
                                        <MenuItem
                                            className="custom-menu-item"
                                            key={status.id}
                                            value={status.id}
                                        >
                                            {status.status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Card>
                <Grid container spacing={2} style={{ marginTop: '1%' }}>
                    <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            id="upload-document"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="upload-document">
                            <Button variant="outlined" component="span">
                                Document Upload
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Attachment"
                            type="text"
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={selectedFile ? selectedFile.name : ''}
                            error={fileError === "File is required!"}
                            helperText={fileError === "File is required!" ? fileError : ""}
                            disabled
                            style={{
                                borderColor: fileError === "File is required!" ? "red" : "inherit",
                            }}
                        />
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handleRemarks}>
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: '2%' }}
                            onClick={() => {
                                setRemarks('');
                                setSelectedAction('');
                                setSelectedFile(null);
                                setFileError(null);
                                setSuccessMessage(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid container item xs={12} spacing={2} style={{ marginTop: '1%' }}>
                        <Grid item xs={4}>
                            <Button variant="outlined" color="primary" onClick={handleFetchDocumentClick} disabled={!isFetchDocumentEnabled}>
                                Fetch Document
                            </Button>
                        </Grid>
                        {pdfData.base64 && (
                            <Grid item xs={8}>
                                <div>
                                    <h6>PDF Preview</h6>
                                    <iframe
                                        title="PDF Preview"
                                        width="100%"
                                        height="300px"
                                        style={{ border: 'none' }}
                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                    />
                                    {pdfData.filename && (
                                        <div style={{ marginTop: '10px' }}>
                                            <a
                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                download={pdfData.filename}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </Grid>
                        )}
                    </Grid>
                    {/* Success Message */}
                    {successMessage && (
                        <Grid item xs={12}>
                            <Typography variant="h6" color="green" className="commonStyle" style={{ marginTop: '10px' }}>
                                {successMessage}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
                <br></br>
            </Box>

            <Dialog open={showImageModal} onClose={handleCloseImageModals} fullWidth maxWidth="md">
                <DialogContent>
                    {imageIds.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {imageIds.map((id: string, index: number) => (
                                <img
                                    key={index}
                                    src={id}
                                    alt={`Image ${index + 1}`}
                                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                                />
                            ))}
                        </div>
                    ) : (
                        <Typography>No images available</Typography>
                    )}
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImageModals}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AlertGeneral;