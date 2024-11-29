import { X } from "lucide-react";
import "./BillDetailsModal.scss"; // Đảm bảo import SCSS file

export function BillDetailsModal({ bill, isOpen, onClose, type }) {
    if (!isOpen || !bill) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>
                        {type === "export" ? "Export" : "Import"} Bill Details
                    </h2>
                    <span onClick={onClose} className="modal-close-btn">
                        <X size={24} />
                    </span>
                </div>
                <div className="modal-body">
                    <p>
                        <strong>Bill ID:</strong> {bill.id}
                    </p>
                    <p>
                        <strong>Created Time:</strong> {bill.createdTime}
                    </p>
                    {bill.receiverName && (
                        <p>
                            <strong>Receiver Name:</strong> {bill.receiverName}
                        </p>
                    )}
                    <div>
                        <h3 className="font-semibold mb-2">Products:</h3>
                        <table className="modal-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Warehouse</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.warehouse}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
