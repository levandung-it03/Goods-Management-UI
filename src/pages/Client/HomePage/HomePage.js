import React from "react";
import "./HomePage.scss";
import ExportBills from "./ExportBills/ExportBills";
import ImportBills from "./ImportBills/ImportBills";
import { Statistics } from "./Statistics/Statistics";
import InventoryChart from "./InventoryChart/InventoryChart";
import GoodsTrendChart from "./GoodsTrendChart/GoodsTrendChart";

export default function HomePage() {
    return (
        <div className="homepage-container">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-heading">
                        Welcome to Product Management
                    </h1>
                    <p className="hero-subheading">
                        Efficiently manage your inventory and track goods
                        movement
                    </p>
                </div>
            </div>

            <div className="container">
                <header className="dashboard-header">
                    <h2 className="dashboard-title">Dashboard</h2>
                </header>

                <Statistics />

                <div className="grid-container">
                    <ExportBills />
                    <ImportBills />
                </div>
                <InventoryChart />
                <GoodsTrendChart />
            </div>
        </div>
    );
}
