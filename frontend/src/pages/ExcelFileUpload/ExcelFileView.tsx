import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Header from "../../layouts/header/header";
import ExcelFileUploadApiService from "../../data/services/ExcelFileUpload/ExcelFileUpload_api_service";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Loader from "../loader/loader";

interface ExcelRow {
    [key: string]: string | number | boolean | null;
}

interface FileData {
    imgId: number;
    fileName: string;
}

const ExcelFileView: React.FC = () => {

    const [fileData, setFileData] = useState<ExcelRow[]>([]);
    const [fileList, setFileList] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

    const apiService = new ExcelFileUploadApiService();

    const handleFetchFileNames = async (pathId: number) => {
        setIsLoading(true);
        setErrorMessage("");
        setFileData([]);
        setSelectedFile(null);
        setFileList([]);
        setSelectedPathId(pathId);
        try {
            const response = await apiService.fetchExcelFile(pathId);
            if (response && Array.isArray(response)) {
                const fileListData = response.map((fileId: string, index: number) => ({
                    imgId: parseInt(fileId, 10),
                    fileName: `File ${index + 1}`,
                }));
                setFileList(fileListData);
            } else {
                throw new Error("Failed to fetch file names.");
            }
        } catch (error) {
            console.error("Error fetching file names:", error);
            setErrorMessage("Error while fetching file names. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFetchExcelData = async (imgId: number, pathId: number) => {
        setFileData([]);
        setSelectedFile(null);
        setErrorMessage("");
        setIsLoading(true);
        try {
            const response = await apiService.getDocumentType(imgId, pathId);
            const workbook = XLSX.read(response, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            if (jsonData.length === 0) {
                throw new Error("No data found in the file.");
            }
            setFileData(jsonData as ExcelRow[]);
            setSelectedFile(imgId);
        } catch (error) {
            console.error("Error fetching file data:", error);
            setErrorMessage("Error while fetching file data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseExcelSheet = () => {
        setFileData([]);
        setSelectedFile(null);
    };

    const handleDownloadExcel = (fileName: string) => {
        if (!fileData.length) {
            alert("No data available to download.");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(fileData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 5 }}>
                <h6>
                    VIEW & DOWNLOAD
                </h6>
                <Box m={2}>
                    <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        {/* Customer file part */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFetchFileNames(2)}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader /> : "Fetch Customer Files"}
                        </Button>
                        {/* Account file part */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFetchFileNames(1)}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader /> : "Fetch Account Files"}
                        </Button>
                        {/* Transition File part */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFetchFileNames(3)}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader /> : "Fetch Transition Files"}
                        </Button>
                    </Box>
                    {fileList.map((file) => (
                        <Button
                            key={file.imgId}
                            variant="outlined"
                            color={selectedFile === file.imgId ? "secondary" : "primary"}
                            onClick={() => {
                                if (selectedPathId !== null) {
                                    handleFetchExcelData(file.imgId, selectedPathId);
                                } else {
                                    setErrorMessage("Path ID is not selected. Please select a valid path.");
                                }
                            }}
                            sx={{ marginRight: "10px", marginBottom: "1%" }}
                        >
                            {file.fileName}
                        </Button>
                    ))}

                    {errorMessage && fileData.length === 0 && (
                        <Typography color="red" sx={{ marginBottom: "10px" }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {fileData.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    padding: "10px",
                                    display: "flex",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CloudDownloadIcon />}
                                    onClick={() => handleDownloadExcel(`File_${selectedFile}`)}
                                    sx={{ marginRight: "20px" }}
                                >
                                    Download Excel File
                                </Button>
                                <Button variant="contained" color="error" onClick={handleCloseExcelSheet}>
                                    Close
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px",
                                    borderBottom: "1px solid #ccc",
                                }}
                            >
                                <Typography variant="h6">Showing data for {`File ${selectedFile}`}</Typography>
                            </Box>
                            <Box
                                sx={{
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                    overflowX: "auto",
                                    border: "1px solid #ccc",
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {Object.keys(fileData[0] || { Column: "No Columns" }).map((header, index) => (
                                                <TableCell
                                                    key={index}
                                                    sx={{
                                                        position: "sticky",
                                                        top: 0,
                                                        backgroundColor: "#f0f0f0",
                                                        zIndex: 1,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fileData.length > 0 ? (
                                            fileData.map((row, rowIndex) => (
                                                <TableRow key={rowIndex}>
                                                    {Object.values(row).map((cell, cellIndex) => (
                                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={Object.keys(fileData[0] || { Column: "" }).length}
                                                    align="center"
                                                >
                                                    No data available
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ExcelFileView;