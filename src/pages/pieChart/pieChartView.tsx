import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import PieChartApiService from '../../data/services/pieChart/pieChart_api_service';
import { InOutAmtTransferPayload, PieChartPayload, TransactionType, TransTypePayload } from '../../data/services/pieChart/pieChart_payload';
import { useParams } from 'react-router-dom';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PieChartView = () => {

    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [monthData, setMonth] = useState<PieChartPayload[]>([]);
    const [transTypeData, setTransTypeData] = useState<TransTypePayload[]>([]);
    const [transactionType, setTransaction] = useState<TransactionType[]>([]);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<number[]>([]);
    const [inOutData, setInOut] = useState<InOutAmtTransferPayload[]>([]);
    const { customerId, accountId: accountIdParam, hitId } = useParams();

    const pieChart = new PieChartApiService();

    useEffect(() => {
        fetchTransType();
        if (customerId) {
            fetchInOutAmtTransfer(Number(customerId));
        }
    }, [customerId]);

    const fetchTransType = async () => {
        try {
            const transactionData = await pieChart.getInstrument();
            setTransaction(transactionData);
        } catch (error) {
            console.error(`Error fetching the fetchTransactionType:`, error);
        }
    };

    let inOutDatas: InOutAmtTransferPayload[] = [];

    const fetchInOutAmtTransfer = async (customerId: number) => {
        try {
            const response = await pieChart.getInOutAmtTransfer(customerId);
            inOutDatas = response;
            setInOut(response);
        } catch (error) {
            console.error(`Error fetching the fetchInOutAmtTransfer:`, error);
        }
    };

    const pieChartLabelsPlugin = {
        id: 'pieChartLabelsPlugin',
        afterDraw(chart: { getDatasetMeta?: any; chartArea?: any; ctx?: any; data?: any; }) {
            const { ctx, data } = chart;
            const meta = chart.getDatasetMeta(0);
            const wrapText = (text: string, maxWidth: number) => {
                const words = text.split(' ');
                let line = '';
                const lines = [];
                words.forEach((word: string) => {
                    const testLine = line + word + ' ';
                    const testWidth = ctx.measureText(testLine).width;
                    if (testWidth > maxWidth && line !== '') {
                        lines.push(line);
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                });
                lines.push(line.trim());
                return lines;
            };
            data.datasets[0].data.forEach((value: number, index: number) => {
                const arc = meta.data[index];
                const { x, y } = arc.tooltipPosition();
                const label = data.labels[index];
                const labelLines = wrapText(label, 50);
                ctx.save();
                ctx.font = '12px Bookman Old Style';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                labelLines.forEach((line, lineIndex) => {
                    ctx.fillText(line, x, y + 14 * (lineIndex - (labelLines.length - 1) / 2));
                });
                const currentData = inOutDatas[0];
                if (currentData) {
                    let valueToDisplay: string | undefined;
                    switch (label) {
                        case 'Cash Deposit':
                            valueToDisplay = `${currentData.nonCashIncomingTransfer}`;
                            break;
                        case 'Cash Withdraw':
                            valueToDisplay = `${currentData.nonCashOutgoingTransfer}`;
                            break;
                        case 'Incoming Fund Transfer':
                            valueToDisplay = `${currentData.cashIncomingTransfer}`;
                            break;
                        case 'Outgoing Fund Transfer':
                            valueToDisplay = `${currentData.cashOutgoingTransfer}`;
                            break;
                        default:
                            valueToDisplay = undefined;
                    }
                    if (valueToDisplay) {
                        ctx.font = '10px Bookman Old Style';
                        ctx.fillStyle = 'white';
                        ctx.fillText(valueToDisplay, x, y + 14 * (labelLines.length / 2) + 16);
                    }
                }
                ctx.restore();
            });

            const drawCurvedText = (text: string, radius: number, centerX: number, centerY: number, startAngle: number, endAngle: number, color: string) => {
                const charSpacing = (endAngle - startAngle) / text.length;
                ctx.save();
                ctx.fillStyle = color;
                ctx.font = '14px Bookman Old Style';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    const angle = startAngle + i * charSpacing;
                    ctx.save();
                    ctx.translate(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
                    ctx.rotate(angle + Math.PI / 2);
                    ctx.fillText(char, 0, 0);
                    ctx.restore();
                }
                ctx.restore();
            };

            const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
            const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
            const radius = meta.data[0].outerRadius;

            const groups = [
                {
                    label: 'Outgoing Payment',
                    segments: [2, 3],
                    color: '#FF5733',
                },
                {
                    label: 'Incoming Payment',
                    segments: [0, 1],
                    color: '#006400',
                },
            ];

            groups.forEach((group) => {
                const startAngle = meta.data[group.segments[0]].startAngle;
                const endAngle = meta.data[group.segments[group.segments.length - 1]].endAngle;
                const midpointAngle = (startAngle + endAngle) / 2;
                const curvedRadius = radius + 20;
                drawCurvedText(group.label, curvedRadius, centerX, centerY, midpointAngle - Math.PI / 10, midpointAngle + Math.PI / 10, group.color);
            });
        },
    };

    const [fromDate, toDate] = selectedMonths.length >= 2
        ? selectedMonths.map((monthYear) => {
            const [month, year] = monthYear.split(' ');
            const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth();
            return new Date(Number(year), Number(monthIndex), 1).toISOString().split('T')[0];
        })
        : [undefined, undefined];

    const fetchMonthData = async () => {
        try {
            const accountId = accountIdParam ? Number(accountIdParam) : undefined;
            if (accountId === undefined || isNaN(accountId)) {
                throw new Error("Invalid accountId");
            }
            const [fromDate, toDate] = selectedMonths.length >= 2
                ? selectedMonths.map((monthYear) => {
                    const [month, year] = monthYear.split(' ');
                    const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth();
                    return new Date(Number(year), Number(monthIndex), 1).toISOString().split('T')[0];
                })
                : [undefined, undefined];
            const periodType = 1;
            const month = await pieChart.getMonthData(accountId, fromDate, toDate, periodType);
            setMonth(month);
            const selectedMonth = selectedMonths[0];
            const monthIndex = new Date(Date.parse(`${selectedMonth} 1`)).getMonth() + 1;
            console.log('monthIndex:', monthIndex);
            const transactionDetails = await pieChart.getTransactionDetails(accountId, monthIndex);
            console.log('transactionDetails:', transactionDetails);
            setTransTypeData(transactionDetails);
        } catch (error) {
            console.error('Error fetching the fetchMonthData:', error);
        }
    };

    const currentYear = new Date().getFullYear();

    const monthLabels = Array.from({ length: 12 }, (_, i) =>
        new Date(currentYear, i).toLocaleString('default', { month: 'short' })
    );

    const monthDataMap: Record<string, number> = monthData.reduce((acc: Record<string, number>, item: PieChartPayload) => {
        const shortMonth = new Date(`${item.month} 1`).toLocaleString('default', { month: 'short' });
        acc[shortMonth] = item.totalAmount;
        return acc;
    }, {});

    const monthChartData = monthLabels.map((month) => monthDataMap[month] || 0);

    const barChartData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Amount',
                data: monthChartData,
                backgroundColor: '#4caf50',
                borderColor: '#388e3c',
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
                beginAtZero: true,
            },
        },
    };

    const TransbarChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 12,
                },
                labels: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ],
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
                beginAtZero: true,
            },
        },
    };

    const handleTransactionTypeChange = (event: SelectChangeEvent<number[]>) => {
        const { target: { value } } = event;
        if (Array.isArray(value) && value.includes(-1)) {
            if (selectedTransactionTypes.length === transactionType.length) {
                setSelectedTransactionTypes([]);
            } else {
                setSelectedTransactionTypes(transactionType.map((t) => t.id));
            }
        } else {
            setSelectedTransactionTypes(typeof value === 'string'
                ? value.split(',').map(Number)
                : value);
        }
    };

    const data = {
        labels: [
            'Cash Deposit',
            'Incoming Fund Transfer',
            'Outgoing Fund Transfer',
            'Cash Withdraw',
        ],
        datasets: [
            {
                label: 'Transaction Breakdown',
                data: [25, 50, 13, 12],
                // data: [25, 50, 12.5, 12.5],
                backgroundColor: [
                    '#229a56',
                    '#1b7a44',
                    '#d44d3f',
                    '#d75c4f',
                    '#A93226',
                ],
                hoverOffset: 4,
                borderWidth: 0,
                borderRadius: 3,
                offset: [6, 0, 10, 10],
            },
        ],
    };

    const options: any = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
            tooltip: {
                enabled: true,
                position: 'nearest',
                yAlign: 'bottom' as 'bottom',
                xAlign: 'center' as 'center',
            },
        },
        onClick: (event: MouseEvent, elements: any[]) => {
            if (elements.length > 0) {
                const chartElement = elements[0];
                const datasetIndex = chartElement.datasetIndex;
                const index = chartElement.index;
                const value = data.datasets[datasetIndex].data[index];
                const isOutgoingPayment = [2, 3];
                const isIncomingPayment = [0, 1];
                let groupLabel = '';
                if (isOutgoingPayment.includes(index)) {
                    groupLabel = 'Outgoing Payment';
                } else if (isIncomingPayment.includes(index)) {
                    groupLabel = 'Incoming Payment';
                }
                setSelectedData({
                    label: groupLabel,
                    value: value
                });
                setOpen(true);
            }
        },
    };

    const monthYearOptions = Array.from({ length: 13 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    });

    const handleSelectAll = () => {
        setSelectedMonths(selectedMonths.length === monthYearOptions.length ? [] : [...monthYearOptions]);
    };

    const handleMonthChange = (event: any) => {
        const {
            target: { value },
        } = event;
        if (value[value.length - 1] === 'all') {
            setSelectedMonths(
                selectedMonths.length === monthYearOptions.length ? [] : [...monthYearOptions]
            );
            return;
        }
        setSelectedMonths(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const monthIndexMap: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    const monthlyCashAmount: number[] = Array(12).fill(0);
    const monthlyNonCashAmount: number[] = Array(12).fill(0);
    const monthlyTotalAmount: number[] = Array(12).fill(0);

    transTypeData.forEach((item) => {
        const month = new Date(item.period).toLocaleString('default', { month: 'short' });
        const index = monthIndexMap[month as keyof typeof monthIndexMap];
        if (index !== undefined) {
            monthlyCashAmount[index] += parseFloat(item.cashAmount as string || '0');
            monthlyNonCashAmount[index] += parseFloat(item.nonCashAmount as string || '0');
            monthlyTotalAmount[index] += item.totalAmount || 0;
        }
    });

    const TransbarChartData = {
        labels: Object.keys(monthIndexMap),
        datasets: [
            {
                label: 'Cash Amount',
                data: monthlyCashAmount,
                backgroundColor: '#4caf50',
                borderColor: '#388e3c',
                borderWidth: 1,
            },
            {
                label: 'Non-Cash Amount',
                data: monthlyNonCashAmount,
                backgroundColor: '#d75c4f',
                borderColor: '#d75c4f',
                borderWidth: 1,
            },
            {
                label: 'Total Amount',
                data: monthlyTotalAmount,
                backgroundColor: '#388e3c',
                borderColor: '#388e3c',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
                {/* Pie Chart */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 600,
                            padding: '0 16px',
                            flexDirection: 'column',
                        }}
                    >
                        <Pie data={data} options={options} plugins={[pieChartLabelsPlugin]} />
                    </Box>
                </Box>

                {/* Bar Chart */}
                <Box style={{ marginTop: '-10%' }}>
                    <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
                        {selectedData?.label || 'Details'}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined" sx={{ minWidth: 180 }}>
                                <InputLabel><span style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>Month/Year</span></InputLabel>
                                <Select
                                    label="Month/Year"
                                    multiple
                                    value={selectedMonths}
                                    onChange={handleMonthChange}
                                    size="small"
                                    className="commonStyle"
                                    autoComplete="off"
                                    input={<OutlinedInput placeholder="Select Months" />}
                                    renderValue={(selected) => {
                                        const selectedNames = (selected as string[]).map(
                                            (monthYear) =>
                                                monthYearOptions.find((option) => option === monthYear) || ''
                                        );
                                        const displayedNames = selectedNames.slice(0, 4);
                                        const hasMore = selectedNames.length > 4 ? ', ...' : '';
                                        return displayedNames.join(', ') + hasMore;
                                    }}
                                    sx={{ width: '100%', mt: 2, mb: 2 }}
                                    style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                                >
                                    <MenuItem
                                        value="all"
                                        onClick={() => handleSelectAll()}
                                        sx={{ height: 20 }} style={{ paddingLeft: 0 }}
                                    >
                                        <Checkbox
                                            checked={selectedMonths.length === monthYearOptions.length}
                                            indeterminate={
                                                selectedMonths.length > 0 && selectedMonths.length < monthYearOptions.length
                                            }
                                            style={{ padding: "0", marginRight: "10px" }}
                                            sx={{ transform: 'scale(0.8)' }}
                                        />
                                        <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                    </MenuItem>
                                    {/* Individual Month Options */}
                                    {monthYearOptions.map((monthYear) => (
                                        <MenuItem key={monthYear} value={monthYear} sx={{ height: 20 }}>
                                            <Checkbox checked={selectedMonths.indexOf(monthYear) > -1}
                                                style={{ padding: "0", marginRight: "10px" }}
                                                sx={{ transform: 'scale(0.8)' }} />
                                            <ListItemText primary={monthYear} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={6} md={4}>
                            <FormControl fullWidth variant="outlined" sx={{ minWidth: 180 }}>
                                <InputLabel><span style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}>InstrumentType</span></InputLabel>
                                <Select
                                    label="InstrumentType"
                                    multiple
                                    value={selectedTransactionTypes}
                                    onChange={handleTransactionTypeChange}
                                    size="small"
                                    className="commonStyle"
                                    autoComplete="off"
                                    input={<OutlinedInput placeholder="Select InstrumentType" />}
                                    renderValue={(selected) => {
                                        const selectedNames = (selected as number[]).map(
                                            (id) => {
                                                const transaction = transactionType.find((t) => t.id === id);
                                                return transaction ? transaction.name : '';
                                            }
                                        );
                                        const displayedNames = selectedNames.slice(0, 5);
                                        const hasMore = selectedNames.length > 5 ? ', ...' : '';
                                        return displayedNames.join(', ') + hasMore;
                                    }}
                                    sx={{ width: '100%', mt: 2, mb: 2 }}
                                    style={{ fontFamily: 'Bookman Old Style', fontSize: '12px' }}
                                >
                                    <MenuItem key="all" value={-1} sx={{ height: 20 }} style={{ paddingLeft: 0 }}>
                                        <Checkbox
                                            checked={selectedTransactionTypes.length === transactionType.length}
                                            indeterminate={
                                                selectedTransactionTypes.length > 0 && selectedTransactionTypes.length < transactionType.length
                                            }
                                            style={{ padding: "0", marginRight: "10px" }}
                                            sx={{ transform: 'scale(0.8)' }}
                                        />
                                        <ListItemText primary={<span className="bold-text">SELECT ALL</span>} />
                                    </MenuItem>
                                    {transactionType.map((type) => (
                                        <MenuItem key={type.id} value={type.id} sx={{ height: 20 }}>
                                            <Checkbox checked={selectedTransactionTypes.indexOf(type.id) > -1}
                                                style={{ padding: "0", marginRight: "10px" }}
                                                sx={{ transform: 'scale(0.8)' }} />
                                            <ListItemText primary={type.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} sm={6} md={2} style={{ marginTop: '1.5%' }}>
                            <Button variant="outlined" color="primary" onClick={fetchMonthData}>Search</Button>
                        </Grid>
                    </Grid>
                    {monthData.length > 0 && (
                        <Box sx={{ marginTop: 4, width: '50%', mb: '5%' }}>
                            <Bar data={barChartData} options={barChartOptions} />
                        </Box>
                    )}
                    {transTypeData.length > 0 && (
                        <Box sx={{ marginTop: 4, width: '50%' }}>
                            <Bar data={TransbarChartData} options={TransbarChartOptions} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PieChartView;