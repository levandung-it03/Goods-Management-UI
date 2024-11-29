"use client";

import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { ChevronDown } from "lucide-react";
import "./InventoryChart.scss"; // Import SCSS file

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const sortOptions = [
    { label: "Quantity (High to Low)", value: "quantityDesc" },
    { label: "Quantity (Low to High)", value: "quantityAsc" },
    { label: "Alphabetical", value: "alphabetical" },
];

export default function InventoryChart({ data }) {
    const [sortBy, setSortBy] = useState("quantityDesc");
    const [isOpen, setIsOpen] = useState(false);

    const sortedData = [...data].sort((a, b) => {
        if (sortBy === "quantityDesc") return b.quantity - a.quantity;
        if (sortBy === "quantityAsc") return a.quantity - b.quantity;
        return a.product.localeCompare(b.product);
    });

    return (
        <div className="card">
            <div className="card-header">
                <h3>Inventory Status</h3>
            </div>
            <div className="card-content">
                <div className="mb-4 relative">
                    <button
                        className="button"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>
                            {sortOptions.find(
                                (option) => option.value === sortBy
                            )?.label || "Sort by"}
                        </span>
                        <ChevronDown className="chevron" />
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                            >
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className="dropdown-item"
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <ResponsiveContainer
                    width="100%"
                    height={350}
                    className="pie-chart-container"
                >
                    <PieChart>
                        <Pie
                            data={sortedData}
                            dataKey="quantity"
                            nameKey="product"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={(entry) => entry.product}
                        >
                            {sortedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value} units`,
                                props.payload.product,
                            ]}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
