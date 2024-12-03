import { useEffect, useMemo, useState } from 'react';
import './AdminPage.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import { AdminService } from '@services/adminService';
import Dialog from '@reusable/Dialog/Dialog';
import { notification, Tooltip } from "antd";

function AdminPage() {
    const [totalClients, setTotalClients] = useState(10);
    const [totalActiveClients, setTotalActiveClients] = useState(7);
    const [totalInactiveClients, setTotalInactiveClients] = useState(3);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const fetchTotalClient = async () => {
        const data = await AdminService.getTotalClients();
        setTotalClients(data.data);
    }
    
    const fetchTotalActiveClient = async () => {
        const data = await AdminService.getTotalActiveClients();
        setTotalActiveClients(data.data);
    }
    
    const fetchTotalInactiveClient = async () => {
        const data = await AdminService.getTotalInactiveClients();
        setTotalInactiveClients(data.data);
    }

    useEffect(() => {
        fetchTotalClient();
        fetchTotalActiveClient();
        fetchTotalInactiveClient();
    }, []);

    const tableComponents = useMemo(
        () =>
            FormatterDict.TableComponents({
                tableInfo: {
                    title: 'Clients',
                    primaryKeyName: 'userId',
                    columnsInfo: [
                        FormatterDict.ColumnInfo('userId', 'Id', {
                            name: 'userId',
                            builder: InputBuilder({ type: 'text', readOnly: true }),
                        }),
                        FormatterDict.ColumnInfo('status', 'Status', null, 
                            (rowData) => 
                            <Tooltip title={`Change status to ${(rowData["status"] === "Active" ? "Inactive" : "Active")}`}>
                                <button
                                    onClick={async () => {
                                        const newStatus = (rowData["status"] === "Active" ? "Inactive" : "Active");
                                        rowData["status"] = newStatus;
                                        notification.open({
                                            message: `Client's status is now ${newStatus.toLowerCase()}`,
                                            description: "Notification from application.",
                                            duration: 1.5,
                                        });
                                        await AdminService.updateClientStatus(rowData["userId"], newStatus);
                                        await fetchTotalActiveClient();
                                        await fetchTotalInactiveClient();
                                    }}
                                    style={{
                                        padding: "5px",
                                        width: "90%",
                                        background: "white",
                                        border: "1px solid black",
                                        cursor: "pointer"
                                    }}
                                >
                                    {rowData["status"]}
                                </button>
                            </Tooltip>
                        ),
                        FormatterDict.ColumnInfo('email', 'Email', {
                            name: 'email',
                            builder: InputBuilder({ type: 'text', readOnly: true }),
                        }),
                        FormatterDict.ColumnInfo('createdAt', 'Created At', {
                            name: 'createdAt',
                            builder: InputBuilder({ type: 'text', readOnly: true }),
                        }),
                        FormatterDict.ColumnInfo('firstName', 'First name', {
                            name: 'firstName',
                            builder: InputBuilder({ type: 'text' }),
                        }),
                        FormatterDict.ColumnInfo('lastName', 'Last name', {
                            name: 'lastName',
                            builder: InputBuilder({ type: 'text' }),
                        }),
                        FormatterDict.ColumnInfo('gender', 'Gender', {
                            name: 'gender',
                            builder: InputBuilder({ type: 'text' }),
                        }),
                        FormatterDict.ColumnInfo('dateOfBirth', 'Date of birth', {
                            name: 'dateOfBirth',
                            builder: InputBuilder({ type: 'text' }),
                        }),
                        FormatterDict.ColumnInfo('phone', 'Phone', {
                            name: 'phone',
                            builder: InputBuilder({ type: 'text' }),
                        }),
                        
                    ],
                    filterFields: [
                        FormatterDict.FilterField('userId', 'Id', InputBuilder({ type: 'number' })),
                        FormatterDict.FilterField('status', 'Status', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('email', 'Email', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('firstName', 'First name', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('lastName', 'Last name', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('phone', 'Phone', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('gender', 'Gender', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('dob', 'Date of birth', InputBuilder({ type: 'text' })),
                    ],
                    sortingFields: [
                        FormatterDict.SortingField('userId', 'Id'),
                        FormatterDict.SortingField('email', 'Email'),
                        FormatterDict.SortingField('firstName', 'First name'),
                        FormatterDict.SortingField('lastName', 'Last name'),
                        FormatterDict.SortingField('dob', 'Date of birth'),
                    ],
                },
                apiServices: {
                    GET_service: { action: AdminService.getClientPage },
                },
            }),
        [],
    );

    const addingFormComponents = useMemo(
        () =>
            FormatterDict.AddingFormComponents({
                apiServices: {
                    POST_service: { 
                        action: AdminService.createClient
                    },
                },
                childrenBuildersInfo: [
                    { 
                        name: 'email',
                        builder: InputBuilder({
                            type: 'text',
                            placeholder: 'Email',
                            validators: [
                                (email) => {
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    return emailRegex.test(email) || 'Must be valid email';
                                }
                            ]
                        })
                    },
                    { 
                        name: 'password',
                        builder: InputBuilder({
                            type: 'password',
                            placeholder: 'Password',
                            validators: [
                                (password) => {
                                    return password.length >= 8 || "Password's length must be at least 8 characters"
                                },
                                // (password) => {
                                //     const hasLowercase = /[a-z]/.test(password);
                                //     const hasUppercase = /[A-Z]/.test(password);
                                //     const hasDigit = /\d/.test(password);
                                //     return hasLowercase && hasUppercase && hasDigit || "Password must contains at least one lower case, one upper case letter and one digit"
                                // }
                            ]
                        })
                    },
                    { 
                        name: 'firstName',
                        builder: InputBuilder({
                            type: 'text',
                            placeholder: 'First name',
                        })
                    },
                    { 
                        name: 'lastName',
                        builder: InputBuilder({
                            type: 'text',
                            placeholder: 'Last name',
                        })
                    },
                    { 
                        name: 'gender',
                        builder: InputBuilder({
                            type: 'text',
                            placeholder: 'Gender (Male/Female)',
                        })
                    },
                    { 
                        name: 'dob',
                        builder: InputBuilder({
                            type: 'date',
                            placeholder: 'Date of birth (yyyy-MM-dd)',
                        })
                    },
                    { 
                        name: 'phone',
                        builder: InputBuilder({
                            type: 'text',
                            placeholder: 'Phone',
                        })
                    },
                ],
            }),
        [],
    );

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([]), []);

    return (
        <div className='client-container'>
            <div className="client-statistics">
                <div className="statistics-item">
                    <span className="label">Total Clients</span>
                    <span className="value">{totalClients}</span>
                </div>
                <div className="statistics-item">
                    <span className="label">Active Clients</span>
                    <span className="value">{totalActiveClients}</span>
                </div>
                <div className="statistics-item">
                    <span className="label">Inactive Clients</span>
                    <span className="value">{totalInactiveClients}</span>
                </div>
            </div>
            <div className="client-list">
                <Table
                    tableComponents={tableComponents}
                    addingFormComponents={addingFormComponents}
                    contextMenuComponents={contextMenuComponents}
                    tableModes={FormatterDict.TableModes(true, false, false, true, true)}
                />
                <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
            </div>
        </div>
    );
}

export default AdminPage;
