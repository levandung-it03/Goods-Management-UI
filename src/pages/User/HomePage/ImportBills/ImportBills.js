import { ArrowDownIcon } from "lucide-react";
import { useState } from "react";
import { BillDetailsModal } from "../BillDetailsModal/BillDetailsModal";
import "./ImportBills.scss"; // Đảm bảo import SCSS file

export default function ImportBills({ importBills }) {
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
                    <ArrowDownIcon className="icon" />
                    Latest Import Bills
                </h3>
            </div>
            <div className="card-body">
                <ul>
                    {importBills.map((bill) => (
                        <li
                            key={bill.id}
                            className="card-item"
                            onClick={() => openModal(bill)}
                        >
                            <div className="card-item-header">
                                <span className="id">{bill.id}</span>
                                <span className="time">{bill.createdTime}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <BillDetailsModal
                bill={selectedBill}
                isOpen={isModalOpen}
                onClose={closeModal}
                type="import"
            />
        </div>
    );
}
