import { BarChart2, Package, ShoppingCart, Truck } from "lucide-react";
import "./Statistics.scss"; // Import SCSS file

export function Statistics({ data }) {
    return (
        <div className="card-container">
            <StatCard
                title="Export Bills Created"
                value={data.exportBills}
                icon={<ShoppingCart className="h-4 w-4" />}
            />
            <StatCard
                title="Import Bills Created"
                value={data.importBills}
                icon={<Truck className="h-4 w-4" />}
            />
            <StatCard
                title="Suppliers"
                value={data.suppliers}
                icon={<Package className="h-4 w-4" />}
            />
            <StatCard
                title="Goods"
                value={data.goods}
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
