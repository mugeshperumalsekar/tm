import React, { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import { Box, Grid, FormControl, InputLabel, MenuItem, Select, Checkbox, Table, ListItemText, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SelectChangeEvent, Button, TextField, Alert, Snackbar, FormHelperText, Dialog, DialogTitle, DialogContent, DialogActions, Card, } from '@mui/material';
import ScenarioListApiService from '../../data/services/scenarioList/ScenarioList_api_service';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ScenariolistPayload, ScenarioSearch } from '../../data/services/scenarioList/Scenariolist_payload';

interface ScenarioList {
    id: number;
    name: string;
    code: string;
    orderNo: number;
}

interface TransactionType {
    id: number;
    name: string;
    code: string;
}

interface TransactionPeriod {
    id: number;
    name: string;
    days: number;
}

interface OccupationType {
    id: number;
    name: string;
    code: string;
}

interface SegmentType {
    id: number;
    name: string;
    code: string;
    orderNo: string;
}

interface RiskLevel {
    id: number;
    name: string;
    code: string;
}

interface CustomerCategory {
    id: number;
    name: string;
}

interface CustomerType {
    id: number;
    name: string;
    customerCategory: CustomerCategory;
}

interface ProductType {
    createdAt: string;
    updatedAt: string;
    status: string;
    id: number;
    name: string;
    code: string;
}

interface ProductTransCategory {
    createdAt: string;
    updatedAt: string;
    status: string;
    id: number;
    name: string;
    code: string;
}

interface ProductTransSubType {
    createdAt: string;
    updatedAt: string;
    status: string;
    id: number;
    name: string;
    code: string;
    productType: ProductType;
    productTransCategory: ProductTransCategory;
}

interface Country {
    id: number;
    name: string;
}

interface ModeofAccount {
    id: number;
    name: string;
}

const ScenarioList = () => {

    const [transactionType, setTransactionType] = useState<number | null>(null);
    const [productType, setProductType] = React.useState<number[]>([]);
    const [period, setPeriod] = useState<number | null>(null);
    const [lookBack, setLookBack] = useState<number | null>(null);
    const [scenariolist, setScenarioList] = useState<number | null>(null);
    const [scenarioOptions, setScenarioOptions] = useState<ScenarioList[]>([]);
    const [isScenarioListRequired, setIsScenarioListRequired] = useState(false);
    const [isProductTypeRequired, setIsProductTypeRequired] = useState(false);
    const [isFrequencyRequired, setIsFrequencyRequired] = useState(false);
    const [isLookBackRequired, setIsLookBackRequired] = useState(false);
    const [isCustomerTypeRequired, setIsCustomerTypeRequired] = useState(false);
    const [transactionTypeOptions, setTransactionTypeOptions] = useState<TransactionType[]>([]);
    const [productTypeOptions, setProductTypeOptions] = useState<ProductTransSubType[]>([]);
    const [periodOptions, setPeriodOptions] = useState<TransactionPeriod[]>([]);
    const [includeCustomerType, setIncludeCustomerType] = useState(false);
    const [includeCustomerRisk, setIncludeCustomerRisk] = useState(false);
    const [includeCustomerSegment, setIncludeCustomerSegment] = useState(false);
    const [includeOccupationType, setIncludeOccupationType] = useState(false);
    const [noOfTransaction, setNoOfTransaction] = useState<string>("");
    const [tableData, setTableData] = useState<any[]>([]);
    const scenarioListApi = new ScenarioListApiService();
    const [customerTypeOptions, setCustomerTypeOptions] = useState<CustomerType[]>([]);
    const [riskLevelOptions, setRiskLevelOptions] = useState<RiskLevel[]>([]);
    const [segmentTypeOptions, setSegmentTypeOptions] = useState<SegmentType[]>([]);
    const [customerType, setCustomerType] = useState<number[]>([]);
    const [riskLevel, setRiskLevel] = useState<number[]>([]);
    const [segmentType, setSegmentType] = useState<number[]>([]);
    const [occupationType, setOccupationType] = useState<OccupationType[]>([]);
    const [occupationTypeId, setOccupationTypeId] = useState<number[]>([]);
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [minPercentage, setMinPercentage] = useState('');
    const [maxPercentage, setMaxPercentage] = useState('');
    const [minTransaction, setMinTransaction] = useState('');
    const [maxTransaction, setMaxTransaction] = useState('');
    const [individualOptions, setIndividualOptions] = useState<CustomerType[]>([]);
    const [nonIndividualOptions, setNonIndividualOptions] = useState<CustomerType[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    // const [scenario, setScenario] = useState<FetchScenarioPayload[]>([]);
    const [scenario, setScenario] = useState<ScenarioSearch[]>([]);
    const [open, setOpen] = useState(false);
    const [dialogData, setDialogData] = useState<any>(null);
    const [country, setCountry] = useState<number[]>([]);
    const [countryOptions, setCountryOptions] = useState<Country[]>([]);
    const [modeOfAccount, setModeOfAccount] = useState<number[]>([]);
    const [modeOfAccountOptions, setModeOfAccountOptions] = useState<ModeofAccount[]>([]);
    // useEffect(() => {
    //     fetchScenario();
    // }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [
                    scenarioList,
                    transactionType,
                    productType,
                    transactionPeriod,
                    customerType,
                    riskLevel,
                    segment,
                    occupation
                ] = await Promise.all([
                    scenarioListApi.getScenarioList(),
                    scenarioListApi.getTransactionType(),
                    scenarioListApi.getProductType(),
                    scenarioListApi.getTransactionPeriod(),
                    scenarioListApi.getCustomerType(),
                    scenarioListApi.getRiskLevel(),
                    scenarioListApi.getSegment(),
                    scenarioListApi.getOccupationType()
                ]);
                const groupedCustomerTypes = customerType.reduce((acc: any, item: CustomerType) => {
                    const categoryId = item.customerCategory.id;
                    if (!acc[categoryId]) {
                        acc[categoryId] = [];
                    }
                    acc[categoryId].push(item);
                    return acc;
                }, {});
                const individual = groupedCustomerTypes[1] || [];
                const nonIndividual = groupedCustomerTypes[2] || [];
                setCustomerTypeOptions(customerType);
                setIndividualOptions(individual);
                setNonIndividualOptions(nonIndividual);
                setScenarioOptions(scenarioList);
                setTransactionTypeOptions(transactionType);
                setProductTypeOptions(productType);
                setPeriodOptions(transactionPeriod);
                setRiskLevelOptions(riskLevel);
                setSegmentTypeOptions(segment);
                setOccupationType(occupation);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchAllData();
    }, []);

    // const handleSearch = async () => {
    //     try {
    //         const selectedScenario = scenarioOptions.find(scenario => scenario.id === scenariolist)?.id || "Not Selected";
    //         const selectedPeriod = periodOptions.find(option => option.id === period)?.id || "Not Selected";
    //         const selectedLookBack = periodOptions.find(option => option.id === lookBack)?.id || "Not Selected";

    //         //Multiple check dropdown part
    //         const selectedProductTypeNames = productType
    //             .map((id) => productTypeOptions.find(option => option.id === id)?.id || "")
    //             .filter(id => id !== "");
    //         const selectedCustomerTypeNames = customerType
    //             .map((id) => customerTypeOptions.find(option => option.id === id)?.id || "")
    //             .filter(id => id !== "");
    //         const selectedRiskLevelNames = riskLevel
    //             .map((id) => riskLevelOptions.find(option => option.id === id)?.id || "")
    //             .filter(id => id !== "");
    //         const selectedSegmentTypeNames = segmentType
    //             .map((id) => segmentTypeOptions.find(option => option.id === id)?.id || "")
    //             .filter(id => id !== "");
    //         const selectedOccupationTypeNames = occupationTypeId
    //             .map((id) => occupationType.find(option => option.id === id)?.id || "")
    //             .filter(id => id !== "");
    //         console.log("Selected Scenario List:", selectedScenario);
    //         console.log("Selected Product Type:", selectedProductTypeNames.join(", "));
    //         console.log("Selected Frequency Of Alert Generation:", selectedPeriod);
    //         console.log("Selected Look Back:", selectedLookBack);
    //         console.log("Selected Customer Types:", selectedCustomerTypeNames.join(", "));
    //         console.log("Selected Risk Levels:", selectedRiskLevelNames.join(", "));
    //         console.log("Selected Segment Types:", selectedSegmentTypeNames.join(", "));
    //         console.log("Selected Occupation Types:", selectedOccupationTypeNames.join(", "));
    //         console.log("Min Amount:", minAmount);
    //         console.log("Max Amount:", maxAmount);
    //         console.log("Min Percentage:", minPercentage);
    //         console.log("Max Percentage:", maxPercentage);
    //         console.log("Min Transactions:", minTransaction);
    //         console.log("Max Transactions:", maxTransaction);
    //     } catch (error) {
    //         console.error('Error in handleSearch:', error);
    //     }
    // };

    const handleReset = () => {
        setScenarioList(null);
        setTransactionType(null);
        setProductType([]);
        setPeriod(null);
        setLookBack(null);
        setCustomerType([]);
        setRiskLevel([]);
        setSegmentType([]);
        setOccupationTypeId([]);
        setMinAmount("");
        setMaxAmount("");
        setMinPercentage("");
        setMaxPercentage("");
        setNoOfTransaction("");
        setMinTransaction("");
        setMaxTransaction("");
        //Validation Error message clear
        setIsScenarioListRequired(false);
        setIsProductTypeRequired(false);
        setIsFrequencyRequired(false);
        setIsLookBackRequired(false);
        setIsCustomerTypeRequired(false);
    };

    const fetchScenario = async () => {
        try {
            const response = await scenarioListApi.getScenario();
            setScenario(response);
        } catch (error) {
            console.error("Error fetching the fetchScenario:", error);
        }
    };

    // const handleTransactionSave = async () => {
    //     let hasError = false;

    //     if (!scenariolist) {
    //         setIsScenarioListRequired(true);
    //         hasError = true;
    //     } else {
    //         setIsScenarioListRequired(false);
    //     }

    //     if (!productType || productType.length === 0) {
    //         setIsProductTypeRequired(true);
    //         hasError = true;
    //     } else {
    //         setIsProductTypeRequired(false);
    //     }

    //     if (!period) {
    //         setIsFrequencyRequired(true);
    //         hasError = true;
    //     } else {
    //         setIsFrequencyRequired(false);
    //     }

    //     if (!lookBack) {
    //         setIsLookBackRequired(true);
    //         hasError = true;
    //     } else {
    //         setIsLookBackRequired(false);
    //     }

    //     if (!customerType || customerType.length === 0) {
    //         setIsCustomerTypeRequired(true);
    //         hasError = true;
    //     } else {
    //         setIsCustomerTypeRequired(false);
    //     }

    //     if (hasError) {
    //         return;
    //     }
    //     try {
    //         const selectedScenario = Number(scenarioOptions.find(scenario => scenario.id === scenariolist)?.id || 0);
    //         const selectedPeriod = Number(periodOptions.find(option => option.id === period)?.id || 0);
    //         const selectedLookBack = Number(periodOptions.find(option => option.id === lookBack)?.id || 0);

    //         const selectedProductTypeIds = productType
    //             .map((id) => productTypeOptions.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);
    //         const selectedCustomerTypeIds = customerType
    //             .map((id) => customerTypeOptions.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);
    //         const selectedRiskLevelIds = riskLevel
    //             .map((id) => riskLevelOptions.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);
    //         const selectedSegmentTypeIds = segmentType
    //             .map((id) => segmentTypeOptions.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);
    //         const selectedOccupationTypeIds = occupationTypeId
    //             .map((id) => occupationType.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);
    //             const selectedCountryIds = country
    //             .map((id) => countryOptions.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);

    //             const selectedModeOfTransIds = country
    //             .map((id) => modeOfAccountOptions.find(option => option.id === id)?.id)
    //             .filter((id): id is number => id !== undefined);


    //         const parsedMinAmount = Number(minAmount) || 0;
    //         const parsedMaxAmount = Number(maxAmount) || 0;
    //         const parsedMinPercentage = Number(minPercentage) || 0;
    //         const parsedMaxPercentage = Number(maxPercentage) || 0;
    //         const parsedMinTransaction = Number(minTransaction) || 0;
    //         const parsedMaxTransaction = Number(maxTransaction) || 0;

    //         const payload: ScenarioPayload = {
    //             id: Number(id) || 0, 
    //             scenarioListId: selectedScenario,
    //             productTypeId: selectedProductTypeIds[0] || 0,
    //             transactionTypeId: 0,
    //             frequencyId: selectedPeriod,
    //             lookbackId: selectedLookBack,
    //             minAmt: parsedMinAmount,
    //             maxAmt: parsedMaxAmount,
    //             minPercentage: parsedMinPercentage,
    //             maxPercentage: parsedMaxPercentage,
    //             minTransCount: parsedMinTransaction,
    //             maxTransCount: parsedMaxTransaction,
    //             customerTypeIds: selectedCustomerTypeIds,
    //             customerSegmentIds: selectedSegmentTypeIds,
    //             customerRiskIds: selectedRiskLevelIds,
    //             occupationTypeIds: selectedOccupationTypeIds,
    //             countryIds:selectedCountryIds,
    //                     modeOfTransIds:selectedModeOfTransIds,
    //         };
    //         console.log('Payload Responses:', payload);
    //         const response = await scenarioListApi.CreateScenario(payload);
    //         // fetchScenario();
    //         console.log('Response of ScenarioPayload:', response);
    //         console.log("Scenario inserted successfully:", response);
    //         setScenarioList(null);
    //         setProductType([]);
    //         setSuccessMessage('Scenario created successfully!');
    //         handleReset();
    //     } catch (error) {
    //         console.error('Error in handleTransactionSave:', error);
    //     } finally {
    //         fetchScenario();
    //     }
    // };

    const handleSave = async () => {
        try {
            const transactionTypeMapping: { [key: number]: string } = {
                1: 'CASH',
                2: 'NONCASH',
            };
            const periodMapping: { [key: number]: string } = {
                1: 'ONE_MONTH',
                2: 'THREE_MONTH',
                3: 'SIX_MONTH',
                4: 'NINE MONTH',
                5: 'TWELVE_MONTH',
            };
            const transactionTypeString = transactionType != null ? transactionTypeMapping[transactionType] || '' : '';
            const periodString = period != null ? periodMapping[period] || '' : '';
            const payload: ScenariolistPayload = {
                transactionType: transactionTypeString,
                scenarioListId: scenariolist || 0,
                riskLevel: includeCustomerRisk ? 'true' : 'false',
                occupationType: includeOccupationType ? 'true' : 'false',
                segmentType: includeCustomerSegment ? 'true' : 'false',
                customerType: includeCustomerType ? 'true' : 'false',
                period: periodString,
                amount: [Number(tableData[0]?.amount) || 0],
                noOfTransaction: [Number(tableData[0]?.noOfTransaction) || 0],
                percentageValue: [Number(tableData[0]?.percentage) || 0],
                transaction_period_id: Number(period) || 0,
            };
            console.log('Payload to API:', payload);
            const response = await scenarioListApi.CreateScenarioList(payload);
            console.log('Save successful:', response);
            alert('Data saved successfully!');
        } catch (error: any) {
            console.error('Error saving data:', error);
            if (error.response) {
                console.error('Response Data:', error.response.data);
                console.error('Response Status:', error.response.status);
            }
            alert('Failed to save data. Please try again.');
        }
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        setTableData((prevData) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [field]: field === "noOfTransaction" ? parseInt(value.replace(/[^0-9]/g, ''), 10) || null : value.replace(/[^0-9]/g, ''),
            };
            return newData;
        });
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "search_results.xlsx");
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const newValue = Number(value);
        setCustomerType(prevState => {
            if (checked) {
                return [...prevState, newValue];
            } else {
                return prevState.filter(id => id !== newValue);
            }
        });
    };

    const handleSelectChange = (selected: Array<number | string>) => {
        if (selected.includes("selectAll")) {
            if (riskLevel.length === riskLevelOptions.length) {
                setRiskLevel([]);
            } else {
                setRiskLevel(riskLevelOptions.map((option) => option.id));
            }
        } else {
            setRiskLevel(selected.filter((item): item is number => typeof item === "number"));
        }
    };

    const handleSegmentTypeChange = (selected: Array<number | string>) => {
        if (selected.includes("selectAll")) {
            if (segmentType.length === segmentTypeOptions.length) {
                setSegmentType([]);
            } else {
                setSegmentType(segmentTypeOptions.map((option) => option.id));
            }
        } else {
            setSegmentType(selected.filter((item): item is number => typeof item === "number"));
        }
    };

    const handleOccupationTypeChange = (event: SelectChangeEvent<number[] | string[]>) => {
        const value = event.target.value as Array<number | string>;
        if (value.includes("selectAll")) {
            if (occupationTypeId.length === occupationType.length) {
                setOccupationTypeId([]);
            } else {
                setOccupationTypeId(occupationType.map((occupation) => occupation.id));
            }
        } else {
            setOccupationTypeId(value.filter((item): item is number => typeof item === "number"));
        }
    };

    const handleCheckboxClick = (id: number, isIndividual = false, isSubheading = false) => {
        setProductType((prev) => {
            const isSelected = prev.includes(id);
            const relatedType = productTypeOptions.find((type) => type.id === id);
            if (!relatedType) return prev;
            if (isIndividual) {
                return isSelected
                    ? prev.filter((pid) => pid !== id)
                    : [...prev, id];
            }
            if (isSubheading) {
                const subheadingName = relatedType.productTransCategory?.name;
                const relatedIdsToCheck = productTypeOptions
                    .filter((type) => type.productTransCategory?.name === subheadingName)
                    .map((type) => type.id);
                if (isSelected) {
                    return prev.filter((pid) => !relatedIdsToCheck.includes(pid));
                } else {
                    return [...prev, ...relatedIdsToCheck];
                }
            }
            const parentCategory = relatedType.productType?.name;
            const relatedIdsToCheck = productTypeOptions
                .filter((type) => type.productType?.name === parentCategory)
                .map((type) => type.id);
            if (isSelected) {
                return prev.filter((pid) => !relatedIdsToCheck.includes(pid));
            } else {
                return [...prev, ...relatedIdsToCheck];
            }
        });
    };

    // Single Select CheckBox for Product Type
    // const handleCheckboxClick = (id: number) => {
    //     setProductType([id]); 
    //     setIsProductTypeRequired(false); 
    // };

    const handleClickOpen = async (id: any) => {
        try {
            const data = await scenarioListApi.scenarioDetails(id);
            setDialogData(data);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching scenario details:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setScenarioList(null);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, mt: 5, p: 2, caretColor: 'transparent' }}>
                <Box >
                    <h6>SCENARIO LIST</h6>
                </Box>

                {/* Dropdowns in a single row */}
                <Grid container spacing={1} sx={{ mb: 4 }}>

                    <Grid item xs={12} md={3}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            error={isScenarioListRequired}
                        >
                            <InputLabel className="commonStyle">Scenario List</InputLabel>
                            <Select
                                label="Scenario List"
                                value={scenariolist ?? ""}
                                onChange={(e) => {
                                    setScenarioList(Number(e.target.value));
                                    setIsScenarioListRequired(false);
                                }}
                                size="small"
                                className="check"
                                autoComplete="off"
                            >
                                {scenarioOptions.map((scenario) => (
                                    <MenuItem key={scenario.id} value={scenario.id}>
                                        <span className="check">{scenario.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {isScenarioListRequired ? "Scenario List is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    {/* Product Type dropdown */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth variant="outlined" error={isProductTypeRequired}>
                            <InputLabel className="commonStyle">Product Type</InputLabel>
                            <Select
                                label="Product Type"
                                multiple
                                value={productType ?? []}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setProductType(Array.isArray(value) ? value : []);
                                    if (value.length > 0) {
                                        setIsProductTypeRequired(false);
                                    }
                                }}
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const uniqueValues = selected
                                        .map((id) => {
                                            const selectedOption = productTypeOptions.find((type) => type.id === id);
                                            if (selectedOption) {
                                                return (
                                                    selectedOption.name ||
                                                    selectedOption.productTransCategory?.name
                                                );
                                            }
                                            return null;
                                        })
                                        .filter(Boolean);
                                    return Array.from(new Set(uniqueValues)).join(", ");
                                }}
                            >
                                {productTypeOptions.map((type, index, self) => {
                                    const isProductTypeDuplicate =
                                        self.findIndex((t) => t.productType?.name === type.productType?.name) < index;
                                    const isProductTransCategoryDuplicate =
                                        self.findIndex((t) => t.productTransCategory?.name === type.productTransCategory?.name) < index;
                                    const isAllSubValuesSelected = self
                                        .filter((t) => t.productType?.name === type.productType?.name)
                                        .every((t) => productType.includes(t.id));
                                    return (
                                        <React.Fragment key={type.id}>

                                            {/* Product Type Main Heading part */}
                                            {!isProductTypeDuplicate && type.productType?.name && (
                                                <MenuItem value={type.id} className="check" sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                                    <Checkbox
                                                        checked={isAllSubValuesSelected}
                                                        onChange={() => { handleCheckboxClick(type.id, false); setIsProductTypeRequired(false); }}
                                                        sx={{ transform: "scale(0.8)" }}
                                                    />
                                                    <ListItemText
                                                        primary={
                                                            <span className="bold-text" style={{ color: "black", textTransform: "uppercase" }}>
                                                                SELECT ALL {type.productType?.name}
                                                            </span>
                                                        }
                                                    />
                                                </MenuItem>
                                            )}

                                            {/* Subheading (e.g., Cash, Non-Cash) */}
                                            {!isProductTransCategoryDuplicate && type.productTransCategory?.name && (
                                                <MenuItem value={type.id} className="check" sx={{ height: 20 }}>
                                                    <Checkbox
                                                        checked={self
                                                            .filter((t) => t.productTransCategory?.name === type.productTransCategory?.name)
                                                            .every((t) => productType.includes(t.id))}
                                                        onChange={() => { handleCheckboxClick(type.id, false, true); setIsProductTypeRequired(false); }}
                                                        sx={{ transform: "scale(0.8)" }}
                                                    />
                                                    <ListItemText
                                                        primary={<span className="bold-text" style={{ color: "black" }}>{type.productTransCategory?.name}</span>}
                                                    />
                                                </MenuItem>
                                            )}

                                            {/* Name values */}
                                            {type.name && (
                                                <MenuItem value={type.id} className="check" sx={{ height: 20 }} style={{ paddingLeft: 34 }}>
                                                    <Checkbox
                                                        checked={productType.includes(type.id)}
                                                        onChange={() => { handleCheckboxClick(type.id, true); setIsProductTypeRequired(false); }}

                                                        sx={{ transform: "scale(0.8)" }}
                                                    />
                                                    <ListItemText primary={type.name} className="bold-text" />
                                                </MenuItem>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </Select>
                            <FormHelperText>
                                {isProductTypeRequired ? "Product Type is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    {/* Single Select CheckBox for Product Type
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth variant="outlined" error={isProductTypeRequired}>
                            <InputLabel className="commonStyle">Product Type</InputLabel>
                            <Select
                                label="Product Type"
                                multiple
                                value={productType ?? []}
                                onChange={() => { }}
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const uniqueValues = selected
                                        .map((id) => {
                                            const selectedOption = productTypeOptions.find((type) => type.id === id);
                                            if (selectedOption) {
                                                return selectedOption.name || selectedOption.productTransCategory?.name;
                                            }
                                            return null;
                                        })
                                        .filter(Boolean);
                                    return Array.from(new Set(uniqueValues)).join(", ");
                                }}
                            >
                                {productTypeOptions.map((type, index, self) => {
                                    return (
                                        <React.Fragment key={type.id}>
                                            <MenuItem value={type.id} className="check" sx={{ height: 20 }}>
                                                <Checkbox
                                                    checked={productType.includes(type.id)} 
                                                    onChange={() => handleCheckboxClick(type.id)}
                                                    sx={{ transform: "scale(0.8)" }}
                                                />
                                                <ListItemText primary={type.name} className="bold-text" />
                                            </MenuItem>
                                        </React.Fragment>
                                    );
                                })}
                            </Select>
                            <FormHelperText>
                                {isProductTypeRequired ? "Product Type is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid> */}

                    {/* <Grid item xs={12} md={2.4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className='commonStyle'>Transaction Type</InputLabel>
                            <Select
                                label="Transaction Type"
                                value={transactionType ?? ""}
                                onChange={(e) => setTransactionType(Number(e.target.value))}
                                size="small"
                                className='check'
                                autoComplete="off"
                            >
                                {transactionTypeOptions.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        <span className='check'>{type.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}

                    <Grid item xs={12} md={3}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            sx={{ minWidth: 180 }}
                            error={isFrequencyRequired}
                        >
                            <InputLabel><span style={{ fontFamily: 'Bookman Old Style', fontSize: '12px', marginTop: '8px' }}>Frequency Of Alert Generation</span></InputLabel>
                            <Select
                                label="Frequency Of Alert Generation"
                                value={period ?? ""}
                                onChange={(e) => { setPeriod(Number(e.target.value)); setIsFrequencyRequired(false); }}
                                size="small"
                                style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                            >
                                {periodOptions.map((period) => (
                                    <MenuItem key={period.id} value={period.id} style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>
                                        {period.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {isFrequencyRequired ? "Frequency is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth variant="outlined" error={isLookBackRequired}>
                            <InputLabel className='commonStyle' >Look Back</InputLabel>
                            <Select
                                label="Look Back"
                                value={lookBack ?? ""}
                                onChange={(e) => { setLookBack(Number(e.target.value)); setIsLookBackRequired(false); }}
                                size="small"
                                className='check'
                                autoComplete="off"
                            >
                                {periodOptions.map((period) => (
                                    <MenuItem key={period.id} value={period.id}>
                                        <span className='check'>{period.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {isLookBackRequired ? "Look Back is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} mt={1}>
                        <FormControl fullWidth variant="outlined" error={isCustomerTypeRequired} >
                            <InputLabel className="commonStyle">Customer Type</InputLabel>
                            <Select
                                label="Customer Type"
                                value={customerType}
                                onChange={(e) => {
                                    setCustomerType(e.target.value as number[]);
                                    setIsCustomerTypeRequired(false);
                                }}
                                multiple
                                size="small"
                                className="check"
                                renderValue={(selected) => {
                                    const selectedNames = (selected as number[]).map(
                                        (id) => customerTypeOptions.find((option) => option.id === id)?.name || ""
                                    );
                                    const maxDisplayCount = 3;
                                    const displayNames = selectedNames.slice(0, maxDisplayCount);
                                    const displayText = displayNames.join(", ");

                                    return selectedNames.length > maxDisplayCount
                                        ? `${displayText}, ...`
                                        : displayText;
                                }}
                            >
                                {/* SELECT ALL */}
                                <MenuItem sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                    <Checkbox
                                        checked={customerType.length === customerTypeOptions.length}
                                        indeterminate={customerType.length > 0 && customerType.length < customerTypeOptions.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setCustomerType(customerTypeOptions.map((option) => option.id));
                                                setIsCustomerTypeRequired(false);
                                            } else {
                                                setCustomerType([]);
                                            }
                                        }}
                                        sx={{ transform: 'scale(0.8)' }}
                                    />
                                    <ListItemText primary={<span className="bold-text" style={{ paddingLeft: 0 }}>SELECT ALL</span>} />
                                </MenuItem>

                                {/* INDIVIDUAL OPTIONS */}
                                {individualOptions.length > 0 && (
                                    <>
                                        <MenuItem style={{ paddingLeft: 14 }} sx={{ height: 20 }}>
                                            <Checkbox
                                                checked={individualOptions.every(option => customerType.includes(option.id))}
                                                indeterminate={
                                                    individualOptions.some(option => customerType.includes(option.id)) &&
                                                    !individualOptions.every(option => customerType.includes(option.id))
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCustomerType(prev => [
                                                            ...prev,
                                                            ...individualOptions.map(option => option.id),
                                                        ]);
                                                        setIsCustomerTypeRequired(false);
                                                    } else {
                                                        setCustomerType(prev =>
                                                            prev.filter(id => !individualOptions.some(option => option.id === id))
                                                        );
                                                    }
                                                }}
                                                sx={{ transform: 'scale(0.8)' }}
                                            />
                                            <ListItemText primary={<span className="bold-text">SELECT ALL INDIVIDUAL</span>} />
                                        </MenuItem>
                                        {individualOptions.map((option) => (
                                            <MenuItem key={option.id} value={option.id} style={{ paddingLeft: 28, height: 20 }}>
                                                <Checkbox
                                                    checked={customerType.includes(option.id)}
                                                    // onChange={handleCheckboxChange}
                                                    onChange={(e) => {
                                                        const { checked, value } = e.target;
                                                        setCustomerType((prev) =>
                                                            checked
                                                                ? [...prev, Number(value)]
                                                                : prev.filter((id) => id !== Number(value))
                                                        );
                                                        if (checked) setIsCustomerTypeRequired(false);
                                                    }}
                                                    value={option.id}
                                                    sx={{ transform: 'scale(0.8)' }}
                                                />
                                                <ListItemText primary={option.name} sx={{ fontSize: '10px' }} />
                                            </MenuItem>
                                        ))}
                                    </>
                                )}

                                {/* NON-INDIVIDUAL OPTIONS */}
                                {nonIndividualOptions.length > 0 && (
                                    <>
                                        <MenuItem style={{ paddingLeft: 14 }} sx={{ height: 20 }}>
                                            <Checkbox
                                                checked={nonIndividualOptions.every(option => customerType.includes(option.id))}
                                                indeterminate={
                                                    nonIndividualOptions.some(option => customerType.includes(option.id)) &&
                                                    !nonIndividualOptions.every(option => customerType.includes(option.id))
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCustomerType(prev => [
                                                            ...prev,
                                                            ...nonIndividualOptions.map(option => option.id),
                                                        ]);
                                                        setIsCustomerTypeRequired(false);
                                                    } else {
                                                        setCustomerType(prev =>
                                                            prev.filter(id => !nonIndividualOptions.some(option => option.id === id))
                                                        );
                                                    }
                                                }}
                                                sx={{ transform: 'scale(0.8)' }}
                                            />
                                            <ListItemText primary={<span className="bold-text">SELECT ALL NON-INDIVIDUAL</span>} />
                                        </MenuItem>
                                        {nonIndividualOptions.map((option) => (
                                            <MenuItem key={option.id} value={option.id} style={{ paddingLeft: 28, height: 20 }}>
                                                <Checkbox
                                                    checked={customerType.includes(option.id)}
                                                    // onChange={handleCheckboxChange}
                                                    onChange={(e) => {
                                                        const { checked, value } = e.target;
                                                        setCustomerType((prev) =>
                                                            checked
                                                                ? [...prev, Number(value)]
                                                                : prev.filter((id) => id !== Number(value))
                                                        );
                                                        if (checked) setIsCustomerTypeRequired(false);
                                                    }}
                                                    value={option.id}
                                                    sx={{ transform: 'scale(0.8)' }}
                                                />
                                                <ListItemText primary={option.name} />
                                            </MenuItem>
                                        ))}
                                    </>
                                )}
                            </Select>
                            <FormHelperText>
                                {isCustomerTypeRequired ? "Customer Type is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} mt={1}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className="commonStyle">Risk Level</InputLabel>
                            <Select
                                label="Risk Level"
                                value={riskLevel}
                                onChange={(e) => handleSelectChange(e.target.value as number[])}
                                multiple
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const selectedNames = (selected as number[]).map(
                                        (id) => riskLevelOptions.find((option) => option.id === id)?.name || ""
                                    );
                                    return selectedNames.join(", ");
                                }}
                            >
                                <MenuItem value="selectAll" sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                    <Checkbox
                                        checked={riskLevel.length === riskLevelOptions.length}
                                        indeterminate={riskLevel.length > 0 && riskLevel.length < riskLevelOptions.length}
                                        sx={{ transform: 'scale(0.8)' }}
                                    />
                                    <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                </MenuItem>
                                {riskLevelOptions.map((period) => (
                                    <MenuItem key={period.id} value={period.id} sx={{ height: 20 }}>
                                        <Checkbox checked={riskLevel.includes(period.id)} sx={{ transform: 'scale(0.8)' }} />
                                        <ListItemText primary={period.name} className="bold-text" />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} mt={1}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className="commonStyle">Segment Type</InputLabel>
                            <Select
                                label="Segment Type"
                                value={segmentType}
                                onChange={(e) => handleSegmentTypeChange(e.target.value as Array<number | string>)}
                                multiple
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const selectedNames = (selected as number[]).map(
                                        (id) => segmentTypeOptions.find((option) => option.id === id)?.name || ""
                                    );
                                    return selectedNames.join(", ");
                                }}
                            >
                                <MenuItem value="selectAll" sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                    <Checkbox
                                        checked={segmentType.length === segmentTypeOptions.length}
                                        indeterminate={segmentType.length > 0 && segmentType.length < segmentTypeOptions.length}
                                        sx={{ transform: 'scale(0.8)' }}
                                    />
                                    <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                </MenuItem>
                                {segmentTypeOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.id} sx={{ height: 20 }}>
                                        <Checkbox checked={segmentType.includes(option.id)} sx={{ transform: 'scale(0.8)' }} />
                                        <ListItemText primary={option.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3} mt={1}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className="commonStyle">Occupation Type</InputLabel>
                            <Select
                                label="Occupation Type"
                                value={occupationTypeId}
                                onChange={handleOccupationTypeChange}
                                multiple
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const selectedNames = (selected as number[]).map(
                                        (id) => occupationType.find((occupation) => occupation.id === id)?.name || ""
                                    );
                                    return selectedNames.join(", ");
                                }}
                            >
                                {/* Select All Option */}
                                <MenuItem value="selectAll" sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                    <Checkbox
                                        checked={occupationTypeId.length === occupationType.length}
                                        indeterminate={occupationTypeId.length > 0 && occupationTypeId.length < occupationType.length}
                                        sx={{ transform: 'scale(0.8)' }}
                                    />
                                    <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                </MenuItem>
                                {/* Individual Options */}
                                {occupationType.map((occupation) => (
                                    <MenuItem key={occupation.id} value={occupation.id} sx={{ height: 20 }}>
                                        <Checkbox checked={occupationTypeId.includes(occupation.id)} sx={{ transform: 'scale(0.8)' }} />
                                        <ListItemText primary={occupation.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ mb: 4 }}>
                    {/* Min Amount */}
                    <Grid item xs={1.5}>
                        <TextField
                            label="Min Amount"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onInput={(e) => {
                                const input = (e.target as HTMLInputElement).value;
                                if (input.split('.').length > 2) {
                                    (e.target as HTMLInputElement).value = input.slice(0, -1);
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: '30px',
                                    '& input': {
                                        fontSize: '12px',
                                        fontFamily: 'Bookman Old Style,serif',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '12px',
                                    fontFamily: 'Bookman Old Style,serif',
                                },
                            }}
                            autoComplete="off"
                        />
                    </Grid>
                    {/* Max Amount */}
                    <Grid item xs={1.5}>
                        <TextField
                            label="Max Amount"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onInput={(e) => {
                                const input = (e.target as HTMLInputElement).value;
                                if (input.split('.').length > 2) {
                                    (e.target as HTMLInputElement).value = input.slice(0, -1);
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: '30px',
                                    '& input': {
                                        fontSize: '12px',
                                        fontFamily: 'Bookman Old Style,serif',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '12px',
                                    fontFamily: 'Bookman Old Style,serif',
                                },
                            }}
                            autoComplete="off"
                        />
                    </Grid>
                    {/* Min Percentage */}
                    <Grid item xs={1.5}>
                        <TextField
                            label="Min Percentage"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={minPercentage}
                            onChange={(e) => setMinPercentage(e.target.value)}
                            onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onInput={(e) => {
                                const input = (e.target as HTMLInputElement).value;
                                if (input.split('.').length > 2) {
                                    (e.target as HTMLInputElement).value = input.slice(0, -1);
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: '30px',
                                    '& input': {
                                        fontSize: '12px',
                                        fontFamily: 'Bookman Old Style,serif',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '12px',
                                    fontFamily: 'Bookman Old Style,serif',
                                },
                            }}
                            autoComplete="off"
                        />
                    </Grid>
                    {/* Max Percentage */}
                    <Grid item xs={1.5}>
                        <TextField
                            label="Max Percentage"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={maxPercentage}
                            onChange={(e) => setMaxPercentage(e.target.value)}
                            onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onInput={(e) => {
                                const input = (e.target as HTMLInputElement).value;
                                if (input.split('.').length > 2) {
                                    (e.target as HTMLInputElement).value = input.slice(0, -1);
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: '30px',
                                    '& input': {
                                        fontSize: '12px',
                                        fontFamily: 'Bookman Old Style,serif',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '12px',
                                    fontFamily: 'Bookman Old Style,serif',
                                },
                            }}
                            autoComplete="off"
                        />
                    </Grid>
                    {/* Min Transaction */}
                    <Grid item xs={1.5}>
                        <TextField
                            label="Min Transaction"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={minTransaction}
                            onChange={(e) => setMinTransaction(e.target.value)}
                            onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onInput={(e) => {
                                const input = (e.target as HTMLInputElement).value;
                                if (input.split('.').length > 2) {
                                    (e.target as HTMLInputElement).value = input.slice(0, -1);
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: '30px',
                                    '& input': {
                                        fontSize: '12px',
                                        fontFamily: 'Bookman Old Style, serif',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '12px',
                                    fontFamily: 'Bookman Old Style, serif',
                                },
                            }}
                            autoComplete="off"
                        />
                    </Grid>
                    {/* Max Transaction */}
                    <Grid item xs={1.5}>
                        <TextField
                            label="Max Transaction"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={maxTransaction}
                            onChange={(e) => setMaxTransaction(e.target.value)}
                            onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onInput={(e) => {
                                const input = (e.target as HTMLInputElement).value;
                                if (input.split('.').length > 2) {
                                    (e.target as HTMLInputElement).value = input.slice(0, -1);
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: '30px',
                                    '& input': {
                                        fontSize: '12px',
                                        fontFamily: 'Bookman Old Style, serif',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: '12px',
                                    fontFamily: 'Bookman Old Style, serif',
                                },
                            }}
                            autoComplete="off"
                        />
                    </Grid>

                    {/* Search Button */}
                    <Grid item xs={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            // onClick={handleTransactionSave}
                            size="small"
                            fullWidth
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReset}
                            size="small"
                            fullWidth
                        >
                            Reset
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="contained"
                            disabled={tableData.length === 0}
                            onClick={exportToExcel}
                            fullWidth
                        >
                            <FileDownloadIcon fontSize="small" />
                        </Button>
                    </Grid>
                </Grid>

                {/* <TableContainer component={Paper} style={{ maxHeight: '320px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Transaction Type</TableCell>
                                <TableCell align='center'>Customer Type</TableCell>
                                <TableCell align='center'>Risk Level</TableCell>
                                <TableCell align='center'>Segment</TableCell>
                                <TableCell align='center'>Occupation</TableCell>
                                <TableCell align='center'>Period</TableCell>
                                <TableCell align='center'>Amount</TableCell>
                                <TableCell align='center'>No of Transaction</TableCell>
                                <TableCell align='center'>Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{row.transactionType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.customerType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.riskLevel || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.segmentType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.occupationType || 'N/A'}</TableCell>
                                    <TableCell align="center">{row.period || 'N/A'}</TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Amount"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.amount || ""}
                                            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Transactions"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.noOfTransaction || ""}
                                            onChange={(e) => handleInputChange(index, "noOfTransaction", e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <input
                                            type="text"
                                            placeholder="Enter Percentage"
                                            style={{ width: '100%' }}
                                            value={tableData[index]?.percentage || ""}
                                            onChange={(e) => handleInputChange(index, "percentage", e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}
                <TableContainer
                    component={Paper}
                    style={{
                        maxHeight: '320px',
                        overflowY: 'auto',
                        position: 'relative',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ height: '30px' }}>
                                <TableCell className='scenariotable' align='left'>S.no</TableCell>
                                <TableCell className='scenariotable' align='left'>Code</TableCell>
                                <TableCell className='scenariotable' align='left'>Scenario</TableCell>
                                <TableCell className='scenariotable' align='left'>ProductType</TableCell>
                                <TableCell className='scenariotable' align='left'>Frequency</TableCell>
                                <TableCell className='scenariotable' align='left'>Lookback</TableCell>
                                <TableCell className='scenariotable' align='left'>MinAmt</TableCell>
                                <TableCell className='scenariotable' align='left'>MaxAmt</TableCell>
                                <TableCell className='scenariotable' align='left'>Min%</TableCell>
                                <TableCell className='scenariotable' align='left'>Max%</TableCell>
                                <TableCell className='scenariotable' align='left'>MinCount</TableCell>
                                <TableCell className='scenariotable' align='left'>MaxCount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scenario.length > 0 ? (
                                scenario.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{
                                            height: '20px',
                                            '& td, & th': {
                                                padding: '4px',
                                            },
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.sceCode}</TableCell>
                                        <TableCell
                                            className="scenariotable"
                                            align="left"
                                            style={{ cursor: 'pointer', color: 'blue', padding: '4px' }}
                                            onClick={() => handleClickOpen(item.id)}
                                        >
                                            {item.scenario}
                                        </TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.productTypeName}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.frequencyName}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.lookbackName}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.minAmt}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.maxAmt}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.minPercentage}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.maxPercentage}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.minTransCount}</TableCell>
                                        <TableCell className='scenariotable' align='left'>{item.maxTransCount}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow sx={{ height: '30px' }}>
                                    <TableCell colSpan={12} style={{ textAlign: 'center', padding: '4px' }}>
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                    <DialogTitle className="custom-dialog-title">SCENARIO DETAILS</DialogTitle>
                    <DialogContent>
                        {dialogData ? (
                            <div className="dialog-box">
                                {/* Grid Container */}
                                <p><strong className='allheading'>Scenario List:</strong> {dialogData.scenarioList.name}</p>
                                {/* Scenario Condition */}
                                <h6 className='allheading'>Product Transaction Type</h6>
                                <TableContainer component={Card} style={{ maxHeight: '350px', overflow: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="MuiTableCell-head">S.No</TableCell>
                                                <TableCell className="MuiTableCell-head">Category</TableCell>
                                                <TableCell className="MuiTableCell-head">Name</TableCell>
                                                <TableCell className="MuiTableCell-head">Code</TableCell>
                                                <TableCell className="MuiTableCell-head">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* Product Transaction Type */}
                                            <TableRow>
                                                <TableCell className="small-cell">1</TableCell>
                                                <TableCell className="small-cell">Product  Type</TableCell>
                                                <TableCell className="small-cell">{dialogData.productTransType.name}</TableCell>
                                                <TableCell className="small-cell">{dialogData.productTransType.code}</TableCell>
                                                <TableCell className="small-cell">{dialogData.productTransType.status}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* Product Transaction Type */}
                                {/* <Grid item xs={12} md={4}>
                                        <h6 className='allheading'>Product Transaction Type</h6>
                                        <p><strong>Name:</strong> {dialogData.productTransType.name}</p>
                                        <p><strong>Code:</strong> {dialogData.productTransType.code}</p>
                                        <h6 className='allheading'>Product Type</h6>
                                        <p><strong>Name:</strong> {dialogData.productTransType.productType.name}</p>
                                        <p><strong>Code:</strong> {dialogData.productTransType.productType.code}</p>
                                        <h6 className='allheading'>Product Transaction Category</h6>
                                        <p><strong>Name:</strong> {dialogData.productTransType.productTransCategory.name}</p>
                                        <p><strong>Code:</strong> {dialogData.productTransType.productTransCategory.code}</p>
                                        <h6 className='allheading'>Product Type</h6>
                                        <p><strong>Name:</strong> {dialogData.productType.name}</p>
                                        <p><strong>Code:</strong> {dialogData.productType.code}</p>
                                        <h6 className='allheading'>Product Transaction Category</h6>
                                        <p><strong>Name:</strong> {dialogData.productTransCategory.name}</p>
                                        <p><strong>Code:</strong> {dialogData.productTransCategory.code}</p>
                                    </Grid> */}
                                <br></br>
                                <h6 className='allheading'>Scenario Mapping Details</h6>
                                <TableContainer component={Card} style={{ maxHeight: '350px', overflow: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="MuiTableCell-head">S.No</TableCell>
                                                <TableCell className="MuiTableCell-head">Customer Type</TableCell>
                                                <TableCell className="MuiTableCell-head">Customer Type Category</TableCell>
                                                <TableCell className="MuiTableCell-head">Customer Segment</TableCell>
                                                <TableCell className="MuiTableCell-head">Occupation Type</TableCell>
                                                <TableCell className="MuiTableCell-head">Customer Risk</TableCell>
                                                <TableCell className="MuiTableCell-head">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dialogData.scenarioMappingDetails?.map((detail: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell className="small-cell">{index + 1}</TableCell>
                                                    <TableCell className="small-cell">{detail.customerType?.name || 'N/A'}</TableCell>
                                                    <TableCell className="small-cell">{detail.customerType?.customerCategory?.name || 'N/A'}</TableCell>
                                                    <TableCell className="small-cell">{detail.customerSegment?.name || 'N/A'}</TableCell>
                                                    <TableCell className="small-cell">{detail.occupationType?.name || 'N/A'}</TableCell>
                                                    <TableCell className="small-cell">{detail.customerRisk?.name || 'N/A'}</TableCell>
                                                    <TableCell className="small-cell">{detail.status || 'N/A'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* <div>
                                    <h5 className='allheading'>Scenario Mapping Details</h5>
                                    <Grid container spacing={3}>
                                        {dialogData.scenarioMappingDetails?.map((detail: any, index: number) => (
                                            <Grid item xs={12} md={4} key={index}>
                                                <div>
                                                    <h6 className='allheading'>Scenario {index + 1}</h6>
                                                    <p><strong>Customer Type:</strong> {detail.customerType?.name || 'N/A'}</p>
                                                    <p><strong>Customer Type Category:</strong> {detail.customerType?.customerCategory?.name || 'N/A'}</p>
                                                    <p><strong>Customer Segment:</strong> {detail.customerSegment?.name || 'N/A'}</p>
                                                    <p><strong>Occupation Type:</strong> {detail.occupationType?.name || 'N/A'}</p>
                                                    <p><strong>Customer Risk:</strong> {detail.customerRisk?.name || 'N/A'}</p>
                                                    <p><strong>Status:</strong> {detail.status || 'N/A'}</p>
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div> */}
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1%' }}>
                    {tableData.length > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            SAVE
                        </Button>
                    )}
                </Grid>
            </Box>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>;

        </Box >
    );
};

export default ScenarioList;