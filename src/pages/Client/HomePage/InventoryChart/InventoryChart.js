"use client";

import { useEffect, useState } from "react";
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
import { DashboardService } from "@services/DashBoardService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const sortOptions = [
    { label: "Quantity (High to Low)", value: "quantityDesc" },
    { label: "Quantity (Low to High)", value: "quantityAsc" },
    { label: "Alphabetical", value: "alphabetical" },
];

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function InventoryChart() {
    const [sortBy, setSortBy] = useState("quantityDesc");
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState(null);

    const sortedData = data
        ? [...data].sort((a, b) => {
              if (sortBy === "quantityDesc") return b.quantity - a.quantity;
              if (sortBy === "quantityAsc") return a.quantity - b.quantity;
              return a.product.localeCompare(b.product);
          })
        : [];

    // Add random colors if there are more items than available colors
    const extendedColors = sortedData.map(
        (_, index) => COLORS[index % COLORS.length] || getRandomColor()
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await DashboardService.getInventoryChartData();
                if (result && result.data) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading data...</div>;
    }

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
                                    fill={extendedColors[index]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value} units`,
                                props.payload
                                    ? props.payload.product
                                    : "Unknown Product",
                            ]}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
