import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { BillDetailsModal } from "../BillDetailsModal/BillDetailsModal";
import "./ExportBills.scss"; // Đảm bảo import SCSS file

export default function ExportBills({ exportBills }) {
    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
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
                            key={bill.id}
                            className="bill-item"
                            onClick={() => openModal(bill)}
                        >
                            <div className="header-card">
                                <span className="id">{bill.id}</span>
                                <div className="details">
                                    <span className="created-time">
                                        {bill.createdTime}
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
