import "./HomePage.scss";
import ExportBills from "./ExportBills/ExportBills";
import ImportBills from "./ImportBills/ImportBills";
import { Statistics } from "./Statistics/Statistics";
import InventoryChart from "./InventoryChart/InventoryChart";
import GoodsTrendChart from "./GoodsTrendChart/GoodsTrendChart";

const exportBills = [
    {
        id: "EXP001",
        createdTime: "2023-06-01 10:30",
        receiverName: "John Doe",
        products: [
            { name: "Laptop", quantity: 50, warehouse: "Main" },
            { name: "Mouse", quantity: 100, warehouse: "Peripherals" },
        ],
    },
    {
        id: "EXP002",
        createdTime: "2023-06-02 14:45",
        receiverName: "Jane Smith",
        products: [
            { name: "Smartphone", quantity: 100, warehouse: "Electronics" },
            { name: "Charger", quantity: 200, warehouse: "Electronics" },
        ],
    },
    {
        id: "EXP003",
        createdTime: "2023-06-03 09:15",
        receiverName: "Bob Johnson",
        products: [
            { name: "Headphones", quantity: 200, warehouse: "Audio" },
            { name: "Speakers", quantity: 50, warehouse: "Audio" },
        ],
    },
];

const InventoryChartData = [
    { product: "Laptop", quantity: 150 },
    { product: "Smartphone", quantity: 300 },
    { product: "Tablet", quantity: 80 },
    { product: "Headphones", quantity: 200 },
    { product: "Smartwatch", quantity: 100 },
];

const GoodsTrendChartData = [
    { date: "2023-01", export: 100, import: 80 },
    { date: "2023-02", export: 120, import: 90 },
    { date: "2023-03", export: 140, import: 100 },
    { date: "2023-04", export: 160, import: 110 },
    { date: "2023-05", export: 180, import: 120 },
    { date: "2023-06", export: 200, import: 130 },
    { date: "2023-07", export: 220, import: 140 },
    { date: "2023-08", export: 240, import: 150 },
    { date: "2023-09", export: 260, import: 160 },
    { date: "2023-10", export: 280, import: 170 },
    { date: "2023-11", export: 300, import: 180 },
    { date: "2023-12", export: 320, import: 190 },
];

const importBills = [
    {
        id: "IMP001",
        createdTime: "2023-06-04 11:00",
        products: [
            { name: "Keyboard", quantity: 75, warehouse: "Peripherals" },
            { name: "Mouse", quantity: 100, warehouse: "Peripherals" },
        ],
    },
    {
        id: "IMP002",
        createdTime: "2023-06-05 13:30",
        products: [
            { name: "Monitor", quantity: 30, warehouse: "Display" },
            { name: "HDMI Cable", quantity: 50, warehouse: "Accessories" },
        ],
    },
    {
        id: "IMP003",
        createdTime: "2023-06-06 10:45",
        products: [
            { name: "Tablet", quantity: 50, warehouse: "Electronics" },
            { name: "Stylus", quantity: 100, warehouse: "Accessories" },
        ],
    },
];

const statisticsData = {
    importBills: 50,
    exportBills: 20,
    suppliers: 100,
    goods: 200,
};

export default function HomePage() {
    return (
        <div className="homepage-container">
            <div className="hero-section">
                <div className="hero-content">
                    <div>
                        <h1 className="hero-heading">
                            Welcome to Product Management
                        </h1>
                        <p className="hero-subheading">
                            Efficiently manage your inventory and track goods
                            movement
                        </p>
                    </div>
                </div>
            </div>

            <div className="container">
                <header className="dashboard-header">
                    <h2 className="dashboard-title">Dashboard</h2>
                </header>

                <Statistics data={statisticsData} />

                <div className="grid-container">
                    <ExportBills exportBills={exportBills} />
                    <ImportBills importBills={importBills} />
                </div>
                <InventoryChart data={InventoryChartData} />
                <GoodsTrendChart data={GoodsTrendChartData} />
            </div>
        </div>
    );
}
