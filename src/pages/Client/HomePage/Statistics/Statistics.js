import { BarChart2, Package, ShoppingCart, Truck } from "lucide-react";
import "./Statistics.scss"; // Import SCSS file
import { DashboardService } from "@services/DashBoardService";
import { useEffect, useState } from "react";
export function Statistics() {
    const [data, setStatisticsData] = useState(null);
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const statistics = await DashboardService.getStatistics();
                console.log(statistics.data);
                setStatisticsData(statistics.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStatistics();
    }, []);
    if (!data) {
        return <div>Loading statistics...</div>;
    }
    return (
        <div className="card-container">
            <StatCard
                title="Export Bills Created"
                value={data.totalExportBills}
                icon={<ShoppingCart className="h-4 w-4" />}
            />
            <StatCard
                title="Import Bills Created"
                value={data.totalImportBills}
                icon={<Truck className="h-4 w-4" />}
            />
            <StatCard
                title="Suppliers"
                value={data.totalSuppliers}
                icon={<Package className="h-4 w-4" />}
            />
            <StatCard
                title="Goods"
                value={data.totalGoods}
                icon={<BarChart2 className="h-4 w-4" />}
            />
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <h3 className="stat-card-title">{title}</h3>
                {icon}
            </div>
            <div className="stat-card-body">
                <div className="stat-card-value">{value}</div>
            </div>
        </div>
    );
}
