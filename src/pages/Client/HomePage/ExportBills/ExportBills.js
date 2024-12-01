import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { BillDetailsModal } from "../BillDetailsModal/BillDetailsModal";
import { DashboardService } from "@services/DashBoardService";
import "./ExportBills.scss"; // Đảm bảo import SCSS file
import { formatArrayToTime } from "@src/utils/formatters";

export default function ExportBills() {
    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exportBills, setExportBills] = useState(null);
    useEffect(() => {
        const fetchExportBills = async () => {
            try {
                const result = await DashboardService.getExportBills();
                console.log(result.data);
                setExportBills(result.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchExportBills();
    }, []);
    if (!exportBills) {
        return <div>Loading exportBills...</div>;
    }
    const openModal = async (bill) => {
        try {
            let billDetails = await DashboardService.getDetailExportBill(
                bill.exportBillId
            ); // Gọi API lấy chi tiết
            billDetails.receiverName = bill.receiverName;
            billDetails.createdTime = bill.createdTime;
            billDetails.billId = bill.exportBillId;
            console.log(billDetails);
            setSelectedBill(billDetails);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching bill details:", error);
        }
    };

    const closeModal = () => {
        setSelectedBill(null);
        setIsModalOpen(false);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">
                    <ArrowUpIcon className="icon" />
                    Latest Export Bills
                </h3>
            </div>
            <div className="bill-list">
                <ul>
                    {exportBills.map((bill) => (
                        <li
                            key={bill.exportBillId}
                            className="bill-item"
                            onClick={() => openModal(bill)}
                        >
                            <div className="header-card">
                                <span className="id">{bill.exportBillId}</span>
                                <div className="details">
                                    <span className="created-time">
                                        {formatArrayToTime(bill.createdTime)}
                                    </span>
                                    <span className="receiver">
                                        {bill.receiverName}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <BillDetailsModal
                bill={selectedBill}
                isOpen={isModalOpen}
                onClose={closeModal}
                type="export"
            />
        </div>
    );
}
