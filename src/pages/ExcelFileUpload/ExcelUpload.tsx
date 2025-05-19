import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Box, Button, TextField, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../layouts/header/header";
import ExcelFileUploadApiService from "../../data/services/ExcelFileUpload/ExcelFileUpload_api_service";

interface ExcelRow {
    [key: string]: string | number | boolean;
}

const MAX_FILE_SIZE_MB = 10;

const ExcelUpload: React.FC = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [accountExcelData, setAccountExcelData] = useState<ExcelRow[]>([]);
    const [customerExcelData, setCustomerExcelData] = useState<ExcelRow[]>([]);
    const [transitionExcelData, setTransitionExcelData] = useState<ExcelRow[]>([]);
    const [accountFileName, setAccountFileName] = useState<string>("");
    const [customerFileName, setCustomerFileName] = useState<string>("");
    const [transitionFileName, setTransitionFileName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAccountUploaded, setIsAccountUploaded] = useState<boolean>(false);
    const [isCustomerUploaded, setIsCustomerUploaded] = useState<boolean>(false);
    const [isTransitionUploaded, setIsTransitionUploaded] = useState<boolean>(false);
    const apiService = new ExcelFileUploadApiService();

    const [processingFile, setProcessingFile] = useState<Record<string, boolean>>({
        account: false,
        customer: false,
        transition: false,
    });

    const [fileErrors, setFileErrors] = useState<Record<string, string>>({
        account: "",
        customer: "",
        transition: "",
    });

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        category: "account" | "customer" | "transition"
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setFileErrors((prev) => ({
                    ...prev,
                    [category]: "File size exceeds the maximum limit of 10MB.",
                }));
                return;
            }
            setProcessingFile((prev) => ({ ...prev, [category]: true }));
            setFileErrors((prev) => ({ ...prev, [category]: "" }));
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                if (data instanceof ArrayBuffer) {
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    if (!jsonData.length) {
                        setFileErrors((prev) => ({
                            ...prev,
                            [category]: "Your file does not contain any data. Please upload a valid data file.",
                        }));
                        setProcessingFile((prev) => ({ ...prev, [category]: false }));
                        return;
                    }
                    if (category === "account") {
                        setAccountExcelData(jsonData as ExcelRow[]);
                        setAccountFileName(file.name);
                        setIsAccountUploaded(false);
                    } else if (category === "customer") {
                        setCustomerExcelData(jsonData as ExcelRow[]);
                        setCustomerFileName(file.name);
                        setIsCustomerUploaded(false);
                    } else if (category === "transition") {
                        setTransitionExcelData(jsonData as ExcelRow[]);
                        setTransitionFileName(file.name);
                        setIsTransitionUploaded(false);
                    }
                }
                setProcessingFile((prev) => ({ ...prev, [category]: false }));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleCancel = (category: "account" | "customer" | "transition") => {
        if (category === "account") {
            setAccountFileName("");
            setAccountExcelData([]);
        } else if (category === "customer") {
            setCustomerFileName("");
            setCustomerExcelData([]);
        } else if (category === "transition") {
            setTransitionFileName("");
            setTransitionExcelData([]);
        }
    };

    const handleSave = async (
        pathId: number,
        data: ExcelRow[],
        category: "account" | "customer" | "transition"
    ) => {
        if (!data.length) {
            alert("No data to save.");
            return;
        }
        setIsLoading(true);
        try {
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            const file = fileInput.files?.[0];
            if (!file) {
                alert("File is missing. Please reselect the file.");
                return;
            }
            const response = await apiService.saveExcelFile([file], [pathId]);
            if (response) {
                console.log("File uploaded successfully!");
                if (category === "account") setIsAccountUploaded(true);
                if (category === "customer") setIsCustomerUploaded(true);
                if (category === "transition") setIsTransitionUploaded(true);
            } else {
                console.error("Error uploading file:", response);
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, marginTop: 5 }}>
                {[
                    {
                        title: "Customer Excel Sheet Upload",
                        category: "customer" as const,
                        fileName: customerFileName,
                        data: customerExcelData,
                        isUploaded: isCustomerUploaded,
                        pathId: 2,
                    },
                    {
                        title: "Account Excel Sheet Upload",
                        category: "account" as const,
                        fileName: accountFileName,
                        data: accountExcelData,
                        isUploaded: isAccountUploaded,
                        pathId: 1,
                    },
                    {
                        title: "Transition Excel Sheet Upload",
                        category: "transition" as const,
                        fileName: transitionFileName,
                        data: transitionExcelData,
                        isUploaded: isTransitionUploaded,
                        pathId: 3,
                    },
                ].map((section, index) => (
                    <Box key={index} m={2} style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: 8,
                        backgroundColor: "#fafafa",
                    }}>
                        <h6 style={{ marginBottom: "10px", marginTop: '1%' }}>
                            {section.title}
                        </h6>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ marginRight: "10px" }}
                                disabled={isLoading}
                            >
                                Choose File
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    hidden
                                    onChange={(event) => handleFileUpload(event, section.category)}
                                />
                            </Button>
                            <TextField
                                value={section.fileName}
                                placeholder="No file selected"
                                InputProps={{
                                    readOnly: true,
                                    sx: {
                                        height: "30px",
                                        padding: "0 8px",
                                        fontSize: "0.875rem",
                                    },
                                }}
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                            />
                        </div>
                        {processingFile[section.category] && (
                            <Typography color="red" sx={{ marginBottom: "10px" }}>
                                Processing file, please wait...
                            </Typography>
                        )}
                        {fileErrors[section.category] && (
                            <Typography color="red" sx={{ marginBottom: "10px" }}>
                                {fileErrors[section.category]}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSave(section.pathId, section.data, section.category)}
                            disabled={
                                processingFile[section.category] ||
                                section.isUploaded ||
                                isLoading ||
                                !section.data.length
                            }
                            sx={{ marginTop: "10px", marginRight: "10px" }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : "Save"}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleCancel(section.category)}
                            disabled={processingFile[section.category] || isLoading}
                            sx={{ marginTop: "10px" }}
                        >
                            Cancel
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ExcelUpload;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { Box, Button, TextField, CircularProgress } from "@mui/material";
// import Header from "../../layouts/header/header";
// import ExcelFileUploadApiService from "../../data/services/ExcelFileUpload/ExcelFileUpload_api_service";

// interface ExcelRow {
//     [key: string]: string | number | boolean;
// }

// const MAX_FILE_SIZE_MB = 5;

// const ExcelUpload: React.FC = () => {
//     const [accountExcelData, setAccountExcelData] = useState<ExcelRow[]>([]);
//     const [customerExcelData, setCustomerExcelData] = useState<ExcelRow[]>([]);
//     const [transitionExcelData, setTransitionExcelData] = useState<ExcelRow[]>([]);
//     const [accountFileName, setAccountFileName] = useState<string>("");
//     const [customerFileName, setCustomerFileName] = useState<string>("");
//     const [transitionFileName, setTransitionFileName] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [isAccountUploaded, setIsAccountUploaded] = useState<boolean>(false);
//     const [isCustomerUploaded, setIsCustomerUploaded] = useState<boolean>(false);
//     const [isTransitionUploaded, setIsTransitionUploaded] = useState<boolean>(false);

//     const apiService = new ExcelFileUploadApiService();

//     const handleFileUpload = (
//         event: React.ChangeEvent<HTMLInputElement>,
//         category: "account" | "customer" | "transition"
//     ) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             // Check file size
//             const fileSizeMB = file.size / (1024 * 1024);
//             if (fileSizeMB > MAX_FILE_SIZE_MB) {
//                 alert("File size exceeds the maximum limit of 5MB.");
//                 return;
//             }

//             if (category === "account") {
//                 setAccountFileName(file.name);
//             } else if (category === "customer") {
//                 setCustomerFileName(file.name);
//             } else if (category === "transition") {
//                 setTransitionFileName(file.name);
//             }

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const data = e.target?.result;
//                 if (data instanceof ArrayBuffer) {
//                     const workbook = XLSX.read(data, { type: "array" });
//                     const sheetName = workbook.SheetNames[0];
//                     const sheet = workbook.Sheets[sheetName];
//                     const jsonData = XLSX.utils.sheet_to_json(sheet);

//                     if (category === "account") {
//                         setAccountExcelData(jsonData as ExcelRow[]);
//                     } else if (category === "customer") {
//                         setCustomerExcelData(jsonData as ExcelRow[]);
//                     } else if (category === "transition") {
//                         setTransitionExcelData(jsonData as ExcelRow[]);
//                     }
//                 }
//             };

//             reader.readAsArrayBuffer(file);
//         }
//     };

//     const handleSave = async (
//         pathId: number,
//         data: ExcelRow[],
//         category: "account" | "customer" | "transition"
//     ) => {
//         if (!data.length) {
//             alert("No data to save.");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//             const file = fileInput.files?.[0];

//             if (!file) {
//                 alert("File is missing. Please reselect the file.");
//                 return;
//             }

//             const formData = new FormData();
//             formData.append("files", file);
//             formData.append("pathId", String(pathId));

//             const response = await apiService.saveExcelFile([file], [pathId]);

//             if (response) {
//                 console.log("File uploaded successfully!");
//                 if (category === "account") setIsAccountUploaded(true);
//                 if (category === "customer") setIsCustomerUploaded(true);
//                 if (category === "transition") setIsTransitionUploaded(true);
//             } else {
//                 console.error("Error uploading file:", response);
//             }
//         } catch (error) {
//             console.error("Upload error:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ display: "flex" }}>
//             <Header />
//             <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                 {[
//                     {
//                         title: "Account Excel Sheet Upload",
//                         category: "account" as const,
//                         fileName: accountFileName,
//                         data: accountExcelData,
//                         isUploaded: isAccountUploaded,
//                         pathId: 1,
//                     },
//                     {
//                         title: "Customer Excel Sheet Upload",
//                         category: "customer" as const,
//                         fileName: customerFileName,
//                         data: customerExcelData,
//                         isUploaded: isCustomerUploaded,
//                         pathId: 2,
//                     },
//                     {
//                         title: "Transition Excel Sheet Upload",
//                         category: "transition" as const,
//                         fileName: transitionFileName,
//                         data: transitionExcelData,
//                         isUploaded: isTransitionUploaded,
//                         pathId: 3,
//                     },
//                 ].map((section, index) => (
//                     <Box key={index} m={2}>
//                         <h6 style={{ marginBottom: "10px",marginTop:'4%' }}>{section.title}</h6>
//                         <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
//                             <Button
//                                 variant="contained"
//                                 component="label"
//                                 sx={{ backgroundColor: "primary", color: "white", marginRight: "10px" }}
//                                 disabled={isLoading}
//                             >
//                                 Choose File
//                                 <input
//                                     type="file"
//                                     accept=".xlsx, .xls"
//                                     hidden
//                                     onChange={(event) => {
//                                         handleFileUpload(event, section.category);

//                                         if (section.category === "account") {
//                                             setIsAccountUploaded(false);
//                                         } else if (section.category === "customer") {
//                                             setIsCustomerUploaded(false);
//                                         } else if (section.category === "transition") {
//                                             setIsTransitionUploaded(false);
//                                         }
//                                     }}
//                                 />
//                             </Button>
//                             <TextField
//                                 value={section.fileName}
//                                 placeholder="No file selected"
//                                 InputProps={{ readOnly: true }}
//                                 sx={{ width: "300px" }}
//                             />
//                         </div>

//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={() => handleSave(section.pathId, section.data, section.category)}
//                             disabled={section.isUploaded || isLoading || !section.data.length}
//                             sx={{ marginTop: "20px" }}
//                         >
//                             {isLoading ? <CircularProgress size={24} /> : "Save"}
//                         </Button>
//                     </Box>
//                 ))}
//             </Box>
//         </Box>
//     );
// };

// export default ExcelUpload;


// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { Box, Button, TextField } from "@mui/material";
// import Header from "../../layouts/header/header";
// import ExcelFileUploadApiService from "../../data/services/ExcelFileUpload/ExcelFileUpload_api_service";

// interface ExcelRow {
//   [key: string]: string | number | boolean;
// }

// const ExcelUpload: React.FC = () => {
//   const [accountExcelData, setAccountExcelData] = useState<ExcelRow[]>([]);
//   const [customerExcelData, setCustomerExcelData] = useState<ExcelRow[]>([]);
//   const [transitionExcelData, setTransitionExcelData] = useState<ExcelRow[]>([]);
//   const [accountFileName, setAccountFileName] = useState<string>("");
//   const [customerFileName, setCustomerFileName] = useState<string>("");
//   const [transitionFileName, setTransitionFileName] = useState<string>("");
//   const [isAccountUploaded, setIsAccountUploaded] = useState<boolean>(false); // Track upload state
//   const [isCustomerUploaded, setIsCustomerUploaded] = useState<boolean>(false);
//   const [isTransitionUploaded, setIsTransitionUploaded] = useState<boolean>(false);

//   const apiService = new ExcelFileUploadApiService();

//   const handleFileUpload = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     category: "account" | "customer" | "transition"
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
//         alert("Invalid file type. Please upload an Excel file.");
//         return;
//       }

//       if (category === "account") {
//         setAccountFileName(file.name);
//       } else if (category === "customer") {
//         setCustomerFileName(file.name);
//       } else if (category === "transition") {
//         setTransitionFileName(file.name);
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = e.target?.result;
//         if (data instanceof ArrayBuffer) {
//           const workbook = XLSX.read(data, { type: "array" });
//           const sheetName = workbook.SheetNames[0];
//           const sheet = workbook.Sheets[sheetName];
//           const jsonData = XLSX.utils.sheet_to_json(sheet);

//           if (category === "account") {
//             setAccountExcelData(jsonData as ExcelRow[]);
//           } else if (category === "customer") {
//             setCustomerExcelData(jsonData as ExcelRow[]);
//           } else if (category === "transition") {
//             setTransitionExcelData(jsonData as ExcelRow[]);
//           }
//         }
//       };

//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const handleSave = async (
//     pathId: number,
//     data: ExcelRow[],
//     category: "account" | "customer" | "transition"
//   ) => {
//     if (!data.length) {
//       alert("No data to save.");
//       return;
//     }

//     try {
//       const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//       const file = fileInput.files?.[0];

//       if (!file) {
//         alert("File is missing. Please reselect the file.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("files", file);
//       formData.append("pathId", String(pathId));

//       const response = await apiService.saveExcelFile([file], [pathId]);

//       if (response) {
//         console.log("File uploaded successfully!");

//         if (category === "account") {
//           setIsAccountUploaded(true);
//         } else if (category === "customer") {
//           setIsCustomerUploaded(true);
//         } else if (category === "transition") {
//           setIsTransitionUploaded(true);
//         }
//       } else {
//         const errorMessage = await response.text();
//         console.log(`Error uploading file: ${errorMessage}`);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <Header />
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         {/* Account Upload Section */}
//         <Box m={2}>
//           <h6 >Account Excel Sheet Upload</h6>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
//             <Button
//               variant="contained"
//               component="label"
//               sx={{ backgroundColor: "primary", color: "white", marginRight: "10px" }}
//             >
//               Choose File
//               <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 hidden
//                 onChange={(event) => handleFileUpload(event, "account")}
//               />
//             </Button>
//             <TextField
//               value={accountFileName}
//               placeholder="No file selected"
//               InputProps={{ readOnly: true }}
//               sx={{ width: "300px" }}
//             />
//           </div>

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => handleSave(1, accountExcelData, "account")}
//             disabled={isAccountUploaded || !accountExcelData.length}
//             sx={{ marginTop: "20px" }}
//           >
//             Save
//           </Button>
//         </Box>

//         {/* Customer Upload Section */}
//         <Box m={2}>
//           <h3 style={{ marginBottom: "10px" }}>Customer Excel Sheet Upload</h3>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
//             <Button
//               variant="contained"
//               component="label"
//               sx={{ backgroundColor: "primary", color: "white", marginRight: "10px" }}
//             >
//               Choose File
//               <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 hidden
//                 onChange={(event) => handleFileUpload(event, "customer")}
//               />
//             </Button>
//             <TextField
//               value={customerFileName}
//               placeholder="No file selected"
//               InputProps={{ readOnly: true }}
//               sx={{ width: "300px" }}
//             />
//           </div>

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => handleSave(2, customerExcelData, "customer")}
//             disabled={isCustomerUploaded || !customerExcelData.length}
//             sx={{ marginTop: "20px" }}
//           >
//             Save
//           </Button>
//         </Box>

//         {/* Transition Upload Section */}
//         <Box m={2}>
//           <h3 style={{ marginBottom: "10px" }}>Transition Excel Sheet Upload</h3>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
//             <Button
//               variant="contained"
//               component="label"
//               sx={{ backgroundColor: "primary", color: "white", marginRight: "10px" }}
//             >
//               Choose File
//               <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 hidden
//                 onChange={(event) => handleFileUpload(event, "transition")}
//               />
//             </Button>
//             <TextField
//               value={transitionFileName}
//               placeholder="No file selected"
//               InputProps={{ readOnly: true }}
//               sx={{ width: "300px" }}
//             />
//           </div>

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => handleSave(3, transitionExcelData, "transition")}
//             disabled={isTransitionUploaded || !transitionExcelData.length}
//             sx={{ marginTop: "20px" }}
//           >
//             Save
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ExcelUpload;