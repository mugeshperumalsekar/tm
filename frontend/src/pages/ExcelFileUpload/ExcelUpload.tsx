import React, { useState } from "react";
import { Box, Button, TextField, Typography, useMediaQuery, useTheme, IconButton, Snackbar, Alert } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Header from "../../layouts/header/header";
import DeleteIcon from '@mui/icons-material/Delete';
import ExcelFileUploadApiService from "../../data/services/ExcelFileUpload/ExcelFileUpload_api_service";

const MAX_FILE_SIZE_MB = 10;

type FileCategory = "account" | "customer" | "transition";

const pathIdMap: Record<FileCategory, number> = {
    account: 1,
    customer: 2,
    transition: 3
};

const ExcelUpload: React.FC = () => {

    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const apiService = new ExcelFileUploadApiService();

    const [dates, setDates] = useState<{ [key in FileCategory]: Dayjs | null }>({
        account: null,
        customer: null,
        transition: null
    });

    const [uploadedFiles, setUploadedFiles] = useState<Record<FileCategory, File | null>>({
        account: null,
        customer: null,
        transition: null
    });

    const [uploadStatus, setUploadStatus] = useState<{ [key in FileCategory]: boolean }>({
        account: false,
        customer: false,
        transition: false
    });

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
        open: false,
        message: "",
        severity: "success"
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: "", severity: "success" });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, category: FileCategory) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setSnackbar({ open: true, message: "File size exceeds 10MB limit.", severity: "error" });
                return;
            }
            setUploadedFiles(prevState => ({ ...prevState, [category]: file }));
        }
        fileInput.value = "";
    };

    const handleDeleteFile = (category: FileCategory) => {
        setUploadedFiles(prevState => ({ ...prevState, [category]: null }));
        const fileInput = document.getElementById(`upload-${category}`) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleDeleteDate = (category: FileCategory) => {
        setDates((prev) => ({ ...prev, [category]: null }));
    };

    const handleUpload = async (category: FileCategory) => {
        const file = uploadedFiles[category];
        if (!file) {
            setSnackbar({ open: true, message: "File is missing. Please reselect the file.", severity: "error" });
            return;
        }
        if (!dates[category]) {
            setSnackbar({ open: true, message: "Please select a date before saving.", severity: "error" });
            return;
        }
        const userSelectedDate = dayjs(dates[category]).format("YYYY-MM-DD");
        const systemTime = dayjs().format("HH:mm:ss");
        const finalDateTime = `${userSelectedDate} ${systemTime}`;
        const pathId = pathIdMap[category];
        setIsLoading(true);
        try {
            const response = await apiService.saveExcelFile([file], [pathId], finalDateTime);
            if (response) {
                setSnackbar({ open: true, message: `File uploaded successfully for ${category}!`, severity: "success" });
                setUploadedFiles(prev => ({ ...prev, [category]: null }));
                setDates(prev => ({ ...prev, [category]: null }));
                const fileInput = document.getElementById(`upload-${category}`) as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                setSnackbar({ open: true, message: `Error uploading ${category} file.`, severity: "error" });
            }
        } catch (error) {
            setSnackbar({ open: true, message: `Upload error for ${category}.`, severity: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, marginTop: 5 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {(["customer", "account", "transition"] as FileCategory[]).map((category) => (
                        <Box key={category} m={2} sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: 2, backgroundColor: "#fafafa" }}>
                            <Typography variant="h6" gutterBottom>
                                {category.charAt(0).toUpperCase() + category.slice(1)} File Upload
                            </Typography>
                            <div style={{ gap: '1%', display: 'flex' }}>
                                <div >
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        style={{ display: "none" }}
                                        id={`upload-${category}`}
                                        onChange={(e) => handleFileChange(e, category)}
                                    />
                                    <label htmlFor={`upload-${category}`}>
                                        <Button variant="outlined" component="span">Upload File</Button>
                                    </label>
                                </div>
                                <div>
                                    <TextField
                                        label="File Name"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        value={uploadedFiles[category]?.name || ""}
                                        disabled
                                    />
                                </div>
                                <div>
                                    {uploadedFiles[category] && (
                                        <IconButton onClick={() => handleDeleteFile(category)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </div>
                                <div>
                                    <DatePicker
                                        label="Select Date"
                                        value={dates[category] ? dayjs(dates[category]) : null}
                                        onChange={(date) => setDates((prev) => ({ ...prev, [category]: date ? date.toDate() : null }))}
                                        disabled={!uploadedFiles[category]}
                                        format="YYYY-MM-DD"
                                        slotProps={{ textField: { size: "small" } }}
                                    />
                                    {dates[category] && (
                                        <IconButton onClick={() => handleDeleteDate(category)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </div>
                            </div>
                            <br></br>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpload(category)}
                                    disabled={!uploadedFiles[category]}
                                >
                                    Upload {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Button>
                            </div>
                        </Box>
                    ))}
                </LocalizationProvider>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default ExcelUpload;