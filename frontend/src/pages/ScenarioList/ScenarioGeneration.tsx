import React, { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import { Box, Grid, FormControl, InputLabel, MenuItem, Select, Checkbox, Table, ListItemText, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SelectChangeEvent, Button, TextField, Alert, Snackbar, FormHelperText, Dialog, DialogTitle, DialogContent, Card, DialogActions, } from '@mui/material';
import ScenarioListApiService from '../../data/services/scenarioList/ScenarioList_api_service';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ScenarioPayload, ScenarioSearch } from '../../data/services/scenarioList/Scenariolist_payload';
import Loader from '../loader/loader';

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

interface Country {
    id: number;
    name: string;
}

interface ModeofAccount {
    id: number;
    name: string;
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

const ScenarioList = () => {

    const [transactionType, setTransactionType] = useState<number | null>(null);
    const [productType, setProductType] = React.useState<number[]>([]);
    const [type, setType] = useState<number[]>([]);
    const [period, setPeriod] = useState<number[]>([]);
    const [lookBack, setLookBack] = useState<number[]>([]);
    const [scenariolist, setScenarioList] = useState<number | null>(null);
    const [scenarioOptions, setScenarioOptions] = useState<ScenarioList[]>([]);
    const [isScenarioListRequired, setIsScenarioListRequired] = useState(false);
    const [isProductTypeRequired, setIsProductTypeRequired] = useState(false);
    const [isFrequencyRequired, setIsFrequencyRequired] = useState(false);
    const [isTypeRequired, setIsTypeRequired] = useState(false);
    const [isProductTransCategoryRequired, setIsProductTransCategoryRequired] = useState(false);
    const [isRiskRequired, setIsRiskRequired] = useState(false);
    const [isSegmentRequired, setIsSegmentRequired] = useState(false);
    const [isOccupationRequired, setIsOccupationRequired] = useState(false);
    const [isLookBackRequired, setIsLookBackRequired] = useState(false);
    const [isCustomerTypeRequired, setIsCustomerTypeRequired] = useState(false);
    const [isCountryRequired, setIsCountryRequired] = useState(false);
    const [isModeRequired, setIsModeRequired] = useState(false);
    const [transactionTypeOptions, setTransactionTypeOptions] = useState<TransactionType[]>([]);
    const [productTypeOptions, setProductTypeOptions] = useState<ProductTransSubType[]>([]);
    const [periodOptions, setPeriodOptions] = useState<TransactionPeriod[]>([]);
    const [ProductTransCategory, setProductTransCategory] = useState<ProductTransCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
    const [noOfTransaction, setNoOfTransaction] = useState<string>("");
    const [tableData, setTableData] = useState<any[]>([]);
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
    const [scenario, setScenario] = useState<ScenarioSearch[]>([]);
    const scenarioListApi = new ScenarioListApiService();
    const [open, setOpen] = useState(false);
    const [dialogData, setDialogData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [country, setCountry] = useState<number[]>([]);
    const [countryOptions, setCountryOptions] = useState<Country[]>([]);
    const [modeOfAccount, setModeOfAccount] = useState<number[]>([]);
    const [modeOfAccountOptions, setModeOfAccountOptions] = useState<ModeofAccount[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [
                    scenarioList,
                    transactionType,
                    productType,
                    transactionPeriod,
                    productTransCategory,
                    customerType,
                    riskLevel,
                    segment,
                    occupation,
                    country,
                    modeOfAccount
                ] = await Promise.all([
                    scenarioListApi.getScenarioList(),
                    scenarioListApi.getTransactionType(),
                    scenarioListApi.getProductType(),
                    scenarioListApi.getTransactionPeriod(),
                    scenarioListApi.getProductTransCategory(),
                    scenarioListApi.getCustomerType(),
                    scenarioListApi.getRiskLevel(),
                    scenarioListApi.getSegment(),
                    scenarioListApi.getOccupationType(),
                    scenarioListApi.getCountry(),
                    scenarioListApi.getModeofAccount()
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
                setProductTransCategory(productTransCategory);
                setRiskLevelOptions(riskLevel);
                setSegmentTypeOptions(segment);
                setOccupationType(occupation);
                setCountryOptions(country);
                setModeOfAccountOptions(modeOfAccount);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchAllData();
        fetchScenario();
    }, []);

    const handleReset = () => {
        setScenarioList(null);
        setTransactionType(null);
        setProductType([]);
        setSelectedCategory([]);
        setType([]);
        setPeriod([]);
        setLookBack([]);
        setCustomerType([]);
        setRiskLevel([]);
        setSegmentType([]);
        setCountry([]);
        setModeOfAccount([]);
        setOccupationTypeId([]);
        setMinAmount("");
        setMaxAmount("");
        setMinPercentage("");
        setMaxPercentage("");
        setNoOfTransaction("");
        setMinTransaction("");
        setMaxTransaction("");
        setIsScenarioListRequired(false);
        setIsProductTypeRequired(false);
        setIsProductTransCategoryRequired(false);
        setIsFrequencyRequired(false);
        setIsTypeRequired(false);
        setIsRiskRequired(false);
        setIsLookBackRequired(false);
        setIsCustomerTypeRequired(false);
        setIsSegmentRequired(false);
        setIsOccupationRequired(false);
        setIsCountryRequired(false);
        setIsModeRequired(false);
    };

    const fetchScenario = async () => {
        try {
            setLoading(true);
            const response = await scenarioListApi.getScenario();
            setScenario(response);
        } catch (error) {
            console.error("Error fetching the fetchScenario:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionSave = async () => {

        //Required validation part
        let hasError = false;
        if (!scenariolist) {
            setIsScenarioListRequired(true);
            hasError = true;
        } else {
            setIsScenarioListRequired(false);
        }

        if (!productType || productType.length === 0) {
            setIsProductTypeRequired(true);
            hasError = true;
        } else {
            setIsProductTypeRequired(false);
        }

        if (!ProductTransCategory || ProductTransCategory.length === 0) {
            setIsProductTransCategoryRequired(true);
            hasError = true;
        } else {
            setIsProductTransCategoryRequired(false);
        }

        if (period.length === 0) {
            setIsFrequencyRequired(true);
            hasError = true;
        } else {
            setIsFrequencyRequired(false);
        }

        if (lookBack.length === 0) {
            setIsLookBackRequired(true);
            hasError = true;
        } else {
            setIsLookBackRequired(false);
        }

        if (!customerType || customerType.length === 0) {
            setIsCustomerTypeRequired(true);
            hasError = true;
        } else {
            setIsCustomerTypeRequired(false);
        }

        if (hasError) return;

        try {
            const selectedScenario = Number(scenarioOptions.find(scenario => scenario.id === scenariolist)?.id || 0);

            const selectedProductTypeIds = productType
                .map((id) => productTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedTypeIds = type
                .map((id) => productTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedCustomerTypeIds = customerType
                .map((id) => customerTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const customerRiskId = riskLevel
                .map((id) => riskLevelOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedSegmentTypeIds = segmentType
                .map((id) => segmentTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedOccupationTypeIds = occupationTypeId
                .map((id) => occupationType.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedCountryIds = country
                .map((id) => countryOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedModeOfTransIds = modeOfAccount
                .map((id) => modeOfAccountOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);
            let foundExistingData = false;

            const parsedMinAmount = minAmount && minAmount !== "." ? Number(minAmount.replace(/,/g, "")) : null;
            const parsedMaxAmount = maxAmount && maxAmount !== "." ? Number(maxAmount.replace(/,/g, "")) : null;
            const parsedminPercentage = minPercentage && minPercentage !== "." ? Number(minPercentage.replace(/,/g, "")) : null;
            const parsedmaxPercentage = maxPercentage && maxPercentage !== "." ? Number(maxPercentage.replace(/,/g, "")) : null;
            const parsedminTransaction = minTransaction && minTransaction !== "." ? Number(minTransaction.replace(/,/g, "")) : null;
            const parsedmaxTransaction = maxTransaction && maxTransaction !== "." ? Number(maxTransaction.replace(/,/g, "")) : null;

            for (const frequencyId of period) {
                for (const lookbackId of lookBack) {
                    console.log(`Fetching validation for Scenario: ${selectedScenario}, Frequency: ${frequencyId}, Lookback: ${lookbackId}`);

                    const validationResponse = await scenarioListApi.getValidation(
                        selectedScenario,
                        frequencyId,
                        lookbackId,
                        customerRiskId[0] || 0,
                        selectedSegmentTypeIds[0] || 0,
                        selectedCustomerTypeIds[0] || 0,
                        selectedOccupationTypeIds[0] || 0
                    );

                    console.log('Validation response:', validationResponse);

                    const existingData = validationResponse.find((data: any) =>
                        data.scenarioList === selectedScenario &&
                        data.frequencyId === frequencyId &&
                        data.lookBackId === lookbackId &&
                        (customerRiskId.length === 0 || customerRiskId.some((riskId: number) => data.riskId === riskId)) &&
                        (selectedSegmentTypeIds.length === 0 || selectedSegmentTypeIds.some((segmentId: number) => data.segmentId === segmentId)) &&
                        (selectedCustomerTypeIds.length === 0 || selectedCustomerTypeIds.some((typeId: number) => data.typeId === typeId)) &&
                        (selectedOccupationTypeIds.length === 0 || selectedOccupationTypeIds.some((occupationId: number) => data.occupationId === occupationId))
                    );

                    if (existingData) {
                        console.log('Existing data found:', existingData);
                        foundExistingData = true;
                        break;
                    }
                }

                if (foundExistingData) break;
            }

            if (foundExistingData) {
                setErrorMessage('This data already exists. Do you want to update?');
                setIsModalOpen(true);
                return;
            }

            for (const frequencyId of period) {
                for (const lookbackId of lookBack) {
                    const payload: ScenarioPayload = {
                        scenarioListId: selectedScenario,
                        productTypeId: productType[0] || 0,
                        transactionTypeId: selectedTypeIds[0],
                        // transactionTypeId: 0,
                        frequencyIds: [frequencyId],
                        lookbackIds: [lookbackId],
                        minAmt: parsedMinAmount || 0,
                        maxAmt: parsedMaxAmount || 0,
                        minPercentage: parsedminPercentage || 0,
                        maxPercentage: parsedmaxPercentage || 0,
                        minTransCount: parsedminTransaction || 0,
                        maxTransCount: parsedmaxTransaction || 0,
                        // minAmt: Number(minAmount) || 0,
                        // maxAmt: Number(maxAmount) || 0,
                        // minPercentage: Number(minPercentage) || 0,
                        // maxPercentage: Number(maxPercentage) || 0,
                        // minTransCount: Number(minTransaction) || 0,
                        // maxTransCount: Number(maxTransaction) || 0,
                        customerTypeIds: selectedCustomerTypeIds,
                        customerSegmentIds: selectedSegmentTypeIds.length > 0 ? selectedSegmentTypeIds : [0],
                        customerRiskIds: customerRiskId.length > 0 ? customerRiskId : [0],
                        occupationTypeIds: selectedOccupationTypeIds.length > 0 ? selectedOccupationTypeIds : [0],
                        countryIds: country,
                        modeOfTransIds: modeOfAccount,
                        extra1Ids: [],
                        extra2Ids: [],
                    };
                    console.log('Payload for creating scenario:', payload);

                    const response = await scenarioListApi.CreateScenario(payload);
                    if (response.status === 200) {
                        console.log('Scenario created successfully:', response);
                    } else {
                        console.error('Failed to create scenario:', response);
                    }
                }
            }
            setSuccessMessage('Scenario created successfully!');
        } catch (error) {
            console.error('Error in handleTransactionSave:', error);
        } finally {
            fetchScenario();
        }
    };

    const handleYes = async () => {
        try {
            const selectedScenario = Number(scenarioOptions.find(scenario => scenario.id === scenariolist)?.id || 0);
            const selectedProductTypeIds = productType
                .map((id) => productTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedTypeIds = type
                .map((id) => productTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedCustomerTypeIds = customerType
                .map((id) => customerTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const customerRiskId = riskLevel
                .map((id) => riskLevelOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedSegmentTypeIds = segmentType
                .map((id) => segmentTypeOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedOccupationTypeIds = occupationTypeId
                .map((id) => occupationType.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedCountryIds = country
                .map((id) => countryOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            const selectedModeOfTransIds = modeOfAccount
                .map((id) => modeOfAccountOptions.find(option => option.id === id)?.id)
                .filter((id): id is number => id !== undefined);

            for (const frequencyId of [...(period || [])]) {
                for (const lookbackId of lookBack) {
                    const payload: ScenarioPayload = {
                        scenarioListId: selectedScenario,
                        productTypeId: productType[0] || 0,
                        transactionTypeId: 0,
                        frequencyIds: [frequencyId],
                        lookbackIds: [lookbackId],
                        minAmt: Number(minAmount) || 0,
                        maxAmt: Number(maxAmount) || 0,
                        minPercentage: Number(minPercentage) || 0,
                        maxPercentage: Number(maxPercentage) || 0,
                        minTransCount: Number(minTransaction) || 0,
                        maxTransCount: Number(maxTransaction) || 0,
                        customerTypeIds: selectedCustomerTypeIds,
                        customerSegmentIds: selectedSegmentTypeIds.length > 0 ? selectedSegmentTypeIds : [0],
                        customerRiskIds: customerRiskId.length > 0 ? customerRiskId : [0],
                        occupationTypeIds: selectedOccupationTypeIds.length > 0 ? selectedOccupationTypeIds : [0],
                        countryIds: country,
                        modeOfTransIds: modeOfAccount,
                        extra1Ids: [],
                        extra2Ids: [],
                    };
                    const response = await scenarioListApi.CreateScenario(payload);
                    console.log('Payload Response:', payload);
                    console.log('Response of ScenarioPayload:', response);
                }
            }
            setSuccessMessage('Scenario created successfully!');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating scenario:', error);
            setErrorMessage('An error occurred while creating the scenario.');
        } finally {
            fetchScenario();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage('');
        // handleReset();
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "search_results.xlsx");
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

    const handleCountryChange = (selected: Array<number | string>) => {
        if (selected.includes("selectAll")) {
            if (country.length === countryOptions.length) {
                setCountry([]);
            } else {
                setCountry(countryOptions.map((option) => option.id));
            }
        } else {
            setCountry(selected.filter((item): item is number => typeof item === "number"));
        }
    };

    const handleModeofAccountChange = (selected: Array<number | string>) => {
        if (selected.includes("selectAll")) {
            if (modeOfAccount.length === modeOfAccountOptions.length) {
                setModeOfAccount([]);
            } else {
                setModeOfAccount(modeOfAccountOptions.map((option) => option.id));
            }
        } else {
            setModeOfAccount(selected.filter((item): item is number => typeof item === "number"));
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

    };

    const ErrorModal = ({ isOpen, onClose, message, onYes, }: { isOpen: boolean; onClose: () => void; message: string; onYes: () => void; }) => {
        if (!isOpen) return null;
        return (
            <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999, transition: 'opacity 0.3s ease-in-out', }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '30px', width: '600px', maxWidth: '90%', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease', opacity: isOpen ? 1 : 0, }}>
                    <p style={{ color: '#333', fontSize: '16px', marginBottom: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                        {message}
                    </p>

                    {/* Button Group */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={onYes} style={{ padding: '10px 20px', fontSize: '16px', color: '#fff', backgroundColor: '#4CAF50', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease', marginRight: '10px', }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
                        >
                            Yes
                        </button>

                        <button onClick={onClose} style={{ padding: '10px 20px', fontSize: '16px', color: '#fff', backgroundColor: '#f44336', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease', }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d32f2f')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f44336')}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, mt: 5, p: 2 }}>
                <Box ><h6>SCENARIO LIST</h6></Box>
                <Grid container spacing={1} sx={{ mb: 4 }}>
                    <Grid item xs={3}>
                        <FormControl fullWidth variant="outlined" error={isScenarioListRequired} >
                            <InputLabel className="centerLabel">Scenario List</InputLabel>
                            <Select label="Scenario List" value={scenariolist ?? ""}
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
                            <FormHelperText>{isScenarioListRequired ? "Scenario List is required." : ""}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl fullWidth variant="outlined" error={isProductTypeRequired}>
                            <InputLabel className="centerLabel">Transaction Type</InputLabel>
                            <Select
                                label="Transaction Type"
                                value={Array.from(new Set(productType ?? []))}
                                onChange={(e) => {
                                    const selectedValues = Array.from(new Set(e.target.value as number[]));
                                    setProductType(selectedValues);
                                    setType([]);
                                    setIsProductTypeRequired(false);
                                }}
                                renderValue={(selected) =>
                                    Array.from(new Set(selected))
                                        .map(
                                            (id) =>
                                                productTypeOptions.find((option) => option.productType.id === id)?.productType.name || ""
                                        )
                                        .join(", ")
                                }
                                multiple
                                size="small"
                                style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
                                autoComplete="off"
                                className="check"
                            >
                                {productTypeOptions
                                    .filter(
                                        (value, index, self) =>
                                            index === self.findIndex((t) => t.productType.id === value.productType.id)
                                    )
                                    .map((uniqueType) => (
                                        <MenuItem
                                            key={uniqueType.id}
                                            value={uniqueType.productType.id}
                                            sx={{ height: 20 }}
                                            style={{ paddingLeft: 0 }}
                                            className="check"
                                        >
                                            <Checkbox
                                                checked={productType?.includes(uniqueType.productType.id) || false}
                                                style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
                                                sx={{ transform: "scale(0.8)" }}
                                            />
                                            {uniqueType.productType.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                            <FormHelperText>
                                {isProductTypeRequired ? "Transaction Type is required." : ""}
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                        <FormControl fullWidth variant="outlined" error={isTypeRequired}>
                            <InputLabel className="centerLabel">Type</InputLabel>
                            <Select label="Type" multiple value={type}
                                onChange={(e) => {
                                    const selectedValues = e.target.value as number[];
                                    setType(selectedValues);
                                    setIsTypeRequired(selectedValues.length === 0);
                                }}
                                size="small"
                                className="check"
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => {
                                            const option = productTypeOptions.find((subType) => subType.id === id);
                                            return option?.name || "";
                                        })
                                        .join(", ")
                                }
                                MenuProps={{
                                    MenuListProps: {
                                        autoFocus: false,
                                        tabIndex: -1,
                                    },
                                }}
                            >
                                {Object.entries(
                                    productTypeOptions
                                        .filter((subType) => productType.includes(subType.productType.id))
                                        .reduce<Record<string, typeof productTypeOptions>>((acc, subType) => {
                                            const categoryName = subType.productTransCategory?.name || "No Category";
                                            acc[categoryName] = acc[categoryName] || [];
                                            acc[categoryName].push(subType);
                                            return acc;
                                        }, {})
                                ).map(([categoryName, subTypes]) => (
                                    <React.Fragment key={categoryName}>
                                        {/* Individual subType checkboxes */}
                                        {subTypes.map((subType, index) => (
                                            <MenuItem
                                                className="check"
                                                key={subType.id}
                                                value={subType.id}
                                                style={{
                                                    paddingLeft: 0
                                                }}
                                                sx={{ height: 20 }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        const isSelected = type.includes(subType.id);
                                                        if (isSelected) {
                                                            setType((prev) => prev.filter((id) => id !== subType.id));
                                                        } else {
                                                            setType((prev) => [...prev, subType.id]);
                                                        }
                                                    }
                                                }}
                                                autoFocus={index === 0}
                                            >
                                                <Checkbox
                                                    checked={type.includes(subType.id)}
                                                    onChange={(event) => {
                                                        const checked = event.target.checked;
                                                        if (checked) {
                                                            setType((prev) => [...prev, subType.id]);
                                                        } else {
                                                            setType((prev) => prev.filter((id) => id !== subType.id));
                                                        }
                                                    }}
                                                    style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}
                                                    sx={{ transform: 'scale(0.8)' }}
                                                />
                                                <span className="commonStyle" style={{ flex: 1 }}>
                                                    {subType.name}
                                                </span>
                                            </MenuItem>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Select>
                            <FormHelperText> {isTypeRequired ? "Type is required." : ""} </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                        <FormControl fullWidth variant="outlined" error={isProductTransCategoryRequired}>
                            <InputLabel className="centerLabel">ProductTransCategory</InputLabel>
                            <Select
                                label="ProductTransCategory"
                                multiple
                                value={selectedCategory}
                                onChange={(e) => {
                                    const selectedValues = e.target.value as number[];
                                    setSelectedCategory(selectedValues);
                                    // setIsProductTransCategoryRequired(selectedValues.length === 0);
                                    setIsProductTypeRequired(false);
                                }}
                                size="small"
                                className="check"
                                renderValue={(selected) => {
                                    const selectedValues = selected as number[];
                                    return selectedValues
                                        .map((id) => {
                                            const option = ProductTransCategory.find((category) => category.id === id);
                                            return option?.name || "";
                                        })
                                        .join(", ");
                                }}
                            >
                                {ProductTransCategory.map((category) => (
                                    <MenuItem key={category.id} value={category.id}
                                        className="check"
                                        sx={{ height: 20 }}
                                        style={{ display: "flex", paddingLeft: 0 }}>
                                        <Checkbox checked={selectedCategory.includes(category.id)} style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }} sx={{ transform: "scale(0.8)" }} />
                                        <span className="check" style={{ flex: 1 }}>
                                            {category.name}
                                        </span>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{isProductTransCategoryRequired ? "ProductTransCategory is required." : ""}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                        <FormControl fullWidth variant="outlined" error={isFrequencyRequired} >
                            <InputLabel className='centerLabel'>Frequency</InputLabel>
                            <Select label="Frequency" value={period ?? []}
                                onChange={(e) => {
                                    const values = e.target.value as number[];
                                    setPeriod(values);
                                    setIsFrequencyRequired(false);
                                }}
                                renderValue={(selected) =>
                                    periodOptions
                                        .filter(option => selected.includes(option.id))
                                        .map(option => option.name)
                                        .join(', ')
                                }
                                multiple
                                size="small"
                                style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                                autoComplete="off"
                                className="check"
                            >
                                {periodOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.id} sx={{ height: 20 }} style={{ paddingLeft: 0 }} className='check'>
                                        <Checkbox
                                            checked={period?.includes(option.id) || false}
                                            style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                                            sx={{ transform: 'scale(0.8)' }}
                                        />
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText> {isFrequencyRequired ? "Frequency is required." : ""}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                        <FormControl fullWidth variant="outlined" error={isLookBackRequired}>
                            <InputLabel className='centerLabel' >Look Back</InputLabel>
                            <Select
                                label="Look Back"
                                value={lookBack ?? []}
                                onChange={(e) => {
                                    const values = e.target.value as number[];
                                    setLookBack(values);
                                    setIsLookBackRequired(false);
                                }}
                                renderValue={(selected) =>
                                    periodOptions
                                        .filter(option => selected.includes(option.id))
                                        .map(option => option.name)
                                        .join(',')
                                }
                                multiple
                                size="small"
                                className='check'
                                autoComplete="off"
                            >
                                {periodOptions.map((period) => (
                                    <MenuItem key={period.id} value={period.id} sx={{ height: 20 }} style={{ paddingLeft: 0 }} className='check'>
                                        <Checkbox
                                            checked={lookBack?.includes(period.id) || false}
                                            style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                                            sx={{ transform: 'scale(0.8)' }} />
                                        <span className='check'>{period.name}</span>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>  {isLookBackRequired ? "Look Back is required." : ""} </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3} mt={1}>
                        <FormControl fullWidth variant="outlined" error={isCustomerTypeRequired} >
                            <InputLabel className="centerLabel">Customer Type</InputLabel>
                            <Select label="Customer Type" value={customerType}
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
                            <FormHelperText> {isCustomerTypeRequired ? "Customer Type is required." : ""} </FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3} mt={1}>
                        <FormControl fullWidth variant="outlined" >
                            <InputLabel className="centerLabel">Risk Level</InputLabel>
                            <Select label="Risk Level" value={riskLevel}
                                onChange={(e) => {
                                    const selectedValues = e.target.value as number[];
                                    handleSelectChange(selectedValues);
                                    // setIsRiskRequired(selectedValues.length === 0); // Check if the array is empty
                                }}
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
                            {/* <FormHelperText> {isRiskRequired ? "RiskLevel is required." : ""}  </FormHelperText> */}
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5} mt={1}>
                        <FormControl fullWidth variant="outlined" >
                            <InputLabel className="centerLabel">Segment Type</InputLabel>
                            <Select label="Segment Type" value={segmentType}
                                onChange={(e) => {
                                    handleSegmentTypeChange(e.target.value as Array<number>);

                                }}

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
                            {/* <FormHelperText> {isSegmentRequired ? "Segment is required." : ""}  </FormHelperText> */}
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5} mt={1}>
                        <FormControl fullWidth variant="outlined"  >
                            <InputLabel className="centerLabel">Occupation Type</InputLabel>
                            <Select label="Occupation Type" value={occupationTypeId}
                                onChange={(e) => {
                                    handleOccupationTypeChange(e); // Call the existing function
                                    // setIsOccupationRequired((e.target.value as Array<number>).length === 0); // Additional logic
                                }}
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
                            {/* <FormHelperText> {isOccupationRequired ? "Occupation is required." : ""} </FormHelperText> */}
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5} mt={1}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel className="centerLabel">Country</InputLabel>
                            <Select label="Country" value={country}
                                onChange={(e) => {
                                    handleCountryChange(e.target.value as Array<number | string>); // Call the handler with the selected values
                                    // setIsCountryRequired((e.target.value as Array<number | string>).length === 0); // Check if the array is empty
                                }}
                                multiple
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const selectedNames = (selected as number[]).map(
                                        (id) => countryOptions.find((option) => option.id === id)?.name || ""
                                    );
                                    const displayedNames = selectedNames.slice(0, 3);
                                    const hasMore = selectedNames.length > 3 ? ", ..." : "";
                                    return displayedNames.join(", ") + hasMore;
                                }}
                            >
                                <MenuItem value="selectAll" sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                    <Checkbox
                                        checked={country.length === countryOptions.length}
                                        indeterminate={country.length > 0 && country.length < countryOptions.length}
                                        sx={{ transform: 'scale(0.8)' }}
                                    />
                                    <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                </MenuItem>
                                {countryOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.id} sx={{ height: 20 }}>
                                        <Checkbox checked={country.includes(option.id)} sx={{ transform: 'scale(0.8)' }} />
                                        <ListItemText primary={option.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* <FormHelperText> {isCountryRequired ? "Country is required." : ""} </FormHelperText> */}
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5} mt={1}>
                        <FormControl fullWidth variant="outlined" >
                            <InputLabel className="centerLabel">ModeofAccount</InputLabel>
                            <Select label="ModeofAccount" value={modeOfAccount}
                                onChange={(e) => {
                                    handleModeofAccountChange(e.target.value as Array<number | string>); // Call the handler with the selected values
                                    // setIsModeRequired((e.target.value as Array<number | string>).length === 0); // Check if the array is empty
                                }}
                                multiple
                                size="small"
                                className="check"
                                autoComplete="off"
                                renderValue={(selected) => {
                                    const selectedNames = (selected as number[]).map(
                                        (id) => modeOfAccountOptions.find((option) => option.id === id)?.name || ""
                                    );
                                    const displayedNames = selectedNames.slice(0, 3);
                                    const hasMore = selectedNames.length > 3 ? ", ..." : "";
                                    return displayedNames.join(", ") + hasMore;
                                }}
                            >
                                <MenuItem value="selectAll" sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                    <Checkbox
                                        checked={modeOfAccount.length === modeOfAccountOptions.length}
                                        indeterminate={modeOfAccount.length > 0 && modeOfAccount.length < modeOfAccountOptions.length}
                                        sx={{ transform: 'scale(0.8)' }}
                                    />
                                    <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                </MenuItem>
                                {modeOfAccountOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.id} sx={{ height: 20 }}>
                                        <Checkbox checked={modeOfAccount.includes(option.id)} sx={{ transform: 'scale(0.8)' }} />
                                        <ListItemText primary={option.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* <FormHelperText>
                                {isModeRequired ? "Mode is required." : ""}
                            </FormHelperText> */}
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={1} sx={{ mb: 4 }}>
                    {/* Min Amount */}

                    <Grid item xs={1.5}>
                        <TextField label="Min Amount" type="text" variant="outlined" size="small" value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            // onKeyPress={(e) => !/^[0-9,.]$/.test(e.key) && e.preventDefault()}
                            onKeyPress={(e) => {
                                if (!/^[0-9,.]$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
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
                        {/* <TextField
                            label="Min Amount"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={minAmount}
                            onChange={(e) => {
                                const input = e.target.value.replace(/[^0-9,.]/g, "");
                                const sanitizedInput = input
                                    .replace(/(\..*?)\./g, "$1")
                                    .replace(/(,.*?),/g, "$1");
                                const formattedValue =
                                    sanitizedInput && sanitizedInput !== "."
                                        ? Number(sanitizedInput.replace(/,/g, "")).toLocaleString("en-US")
                                        : "";

                                setMinAmount(formattedValue);
                            }}
                            onKeyPress={(e) => {
                                const validRegex = /^[0-9.,]$/;
                                if (!validRegex.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
                            fullWidth
                            InputProps={{
                                sx: {
                                    height: "30px",
                                    "& input": {
                                        fontSize: "12px",
                                        fontFamily: "Bookman Old Style,serif",
                                    },
                                },
                            }}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    fontSize: "12px",
                                    fontFamily: "Bookman Old Style,serif",
                                },
                            }}
                            autoComplete="off"
                        /> */}

                    </Grid>

                    {/* Max Amount */}
                    <Grid item xs={1.5}>
                        <TextField label="Max Amount" type="text" variant="outlined" size="small" value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            // onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onKeyPress={(e) => {
                                if (!/^[0-9,.]$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
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
                        <TextField label="Min Percentage" type="text" variant="outlined" size="small" value={minPercentage}
                            onChange={(e) => setMinPercentage(e.target.value)}
                            // onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onKeyPress={(e) => {
                                if (!/^[0-9,.]$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
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
                        <TextField label="Max Percentage" type="text" variant="outlined" size="small"
                            value={maxPercentage}
                            onChange={(e) => setMaxPercentage(e.target.value)}
                            // onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onKeyPress={(e) => {
                                if (!/^[0-9,.]$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
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
                        <TextField label="Min Transaction" type="text" variant="outlined" size="small"
                            value={minTransaction}
                            onChange={(e) => setMinTransaction(e.target.value)}
                            // onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onKeyPress={(e) => {
                                if (!/^[0-9,.]$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
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
                        <TextField label="Max Transaction" type="text" variant="outlined" size="small"
                            value={maxTransaction}
                            onChange={(e) => setMaxTransaction(e.target.value)}
                            // onKeyPress={(e) => !/^[0-9.]$/.test(e.key) && e.preventDefault()}
                            onKeyPress={(e) => {
                                if (!/^[0-9,.]$/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const pasteData = e.clipboardData.getData("Text");
                                if (/[^0-9,.]/.test(pasteData)) {
                                    e.preventDefault();
                                }
                            }}
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
                            onClick={handleTransactionSave}
                            size="small"
                            fullWidth
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" color="primary" onClick={handleReset} size="small" fullWidth >  Reset </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" disabled={tableData.length === 0} onClick={exportToExcel} fullWidth >
                            <FileDownloadIcon fontSize="small" />
                        </Button>
                    </Grid>
                </Grid>
                {loading && <Loader />}
                <TableContainer
                    component={Paper}
                    // style={{
                    //     maxHeight: '320px',
                    //     overflowY: 'auto',
                    //     position: 'relative',
                    // }}
                    sx={{
                        maxHeight: { sm: 200, xs: 300, lg: 300 },
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
                                        <TableCell className='scenariotable' align='left'>{item.scenarioCode}/{item.sceCode}</TableCell>
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

                                <br></br>
                                <h6 className='allheading'>Scenario Mapping Details</h6>
                                <TableContainer component={Card} style={{ maxHeight: '200px', overflow: 'auto' }}>
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

            <ErrorModal
                isOpen={isModalOpen}
                onClose={closeModal}
                message={errorMessage}
                onYes={handleYes}
            // onYes={closeModal}
            />
        </Box >
    );
};

export default ScenarioList;