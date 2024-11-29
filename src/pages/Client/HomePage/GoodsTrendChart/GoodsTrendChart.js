"use client";

import { useEffect, useState } from "react";
import "./GoodsTrendChart.scss";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { DashboardService } from "@services/DashBoardService"; // Giả sử bạn đã import API service của mình

const timeRanges = [
    { label: "Last 3 months", value: 3 },
    { label: "Last 6 months", value: 6 },
    { label: "Last 9 months", value: 9 },
    { label: "Last 12 months", value: 12 },
];

export default function GoodsTrendChart() {
    const [selectedRange, setSelectedRange] = useState(6); // Mặc định chọn 6 tháng
    const [isOpen, setIsOpen] = useState(false);
    const [chartData, setChartData] = useState([]);

    // Hàm tính toán ngày bắt đầu và kết thúc dựa trên selectedRange
    const calculateStartDate = (range) => {
        const endDate = new Date(); // Ngày hiện tại
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - range); // Lùi lại n tháng tùy thuộc vào range

        // Format lại ngày theo dạng YYYY-MM-DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        };
    };

    // Hàm gọi API với startDate và endDate
    const fetchChartData = async (startDate, endDate) => {
        try {
            console.log(startDate, endDate);
            const result = await DashboardService.getGoodsTrendChart(
                startDate,
                endDate
            );
            setChartData(result.data); // Giả sử result.data là dữ liệu bạn muốn hiển thị trên biểu đồ
        } catch (error) {
            console.error("Error fetching inventory chart data:", error);
        }
    };

    useEffect(() => {
        const { startDate, endDate } = calculateStartDate(selectedRange);
        fetchChartData(startDate, endDate); // Truyền startDate và endDate vào API
    }, [selectedRange]);

    return (
        <div className="goods-trend-chart">
            <div className="chart-header">
                <h3 className="chart-title">Goods Movement Trend</h3>
            </div>
            <div className="chart-body">
                <div className="select-container">
                    <button
                        className="select-button"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>
                            {timeRanges.find(
                                (range) => range.value === selectedRange
                            )?.label || "Select time range"}
                        </span>
                        <ChevronDown className="chevron-icon" />
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-content">
                                {timeRanges.map((range) => (
                                    <button
                                        key={range.value}
                                        className="dropdown-item"
                                        onClick={() => {
                                            setSelectedRange(range.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date
                                    .getFullYear()
                                    .toString()
                                    .substr(-2)}`;
                            }}
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.toLocaleString("default", {
                                    month: "long",
                                })} ${date.getFullYear()}`;
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="export"
                            name="Export"
                            stroke="#2563eb"
                        />
                        <Line
                            type="monotone"
                            dataKey="import"
                            name="Import"
                            stroke="#16a34a"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
