"use client";

import "./GoodsTrendChart.scss";
import { useState } from "react";
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

const timeRanges = [
    { label: "Last 3 months", value: 3 },
    { label: "Last 6 months", value: 6 },
    { label: "Last 9 months", value: 9 },
    { label: "Last 12 months", value: 12 },
];

export default function GoodsTrendChart({ data }) {
    const [selectedRange, setSelectedRange] = useState(6);
    const [isOpen, setIsOpen] = useState(false);

    const filteredData = data.slice(-selectedRange);

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
                    <LineChart data={filteredData}>
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
