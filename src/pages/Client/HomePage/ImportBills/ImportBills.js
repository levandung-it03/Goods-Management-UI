import { ArrowDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { BillDetailsModal } from "../BillDetailsModal/BillDetailsModal";
import "./ImportBills.scss"; // Đảm bảo import SCSS file
import { DashboardService } from "@services/DashBoardService";
import { formatArrayToTime } from "@src/utils/formatters";
export default function ImportBills() {
    const [selectedBill, setSelectedBill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importBills, setImportBills] = useState(null);
    useEffect(() => {
        const fetchImportBills = async () => {
            try {
                const result = await DashboardService.getImportBills();

                setImportBills(result.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchImportBills();
    }, []);
    if (!importBills) {
        return <div>Loading ImportBills...</div>;
    }
    const openModal = async (bill) => {
        try {
            let billDetails = await DashboardService.getDetailImportBill(
                bill.importBillId
            ); // Gọi API lấy chi tiết
            billDetails.createdTime = bill.createdTime;
            billDetails.billId = bill.importBillId;
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
                    <ArrowDownIcon className="icon" />
                    Latest Import Bills
                </h3>
            </div>
            <div className="card-body">
                <ul>
                    {importBills.map((bill) => (
                        <li
                            key={bill.importBillId}
                            className="card-item"
                            onClick={() => openModal(bill)}
                        >
                            <div className="card-item-header">
                                <span className="id">{bill.importBillId}</span>
                                <span className="time">
                                    {formatArrayToTime(bill.createdTime)}
                                </span>
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
