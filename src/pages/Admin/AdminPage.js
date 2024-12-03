import { useMemo, useState } from 'react';
import './AdminPage.scss';
import { FormatterDict, Table } from '@reusable/TableHMCompos/TableHMCompos';
import { InputBuilder } from '@reusable/FormHMCompos/FormHMCompos';
import { AdminService } from '@services/adminService';
import Dialog from '@reusable/Dialog/Dialog';

function AdminPage() {
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const tableComponents = useMemo(
        () =>
            FormatterDict.TableComponents({
                tableInfo: {
                    title: 'Users',
                    primaryKeyName: 'userId',
                    columnsInfo: [
                        FormatterDict.ColumnInfo('userId', 'Id', {
                            name: 'userId',
                            builder: InputBuilder({ type: 'text', readOnly: true }),
                        }),
                        FormatterDict.ColumnInfo('status', 'Status', {
                            name: 'status',
                            builder: InputBuilder({ type: 'text' }),
                        }),
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
                        // TODO: change icon for update status column
                        FormatterDict.ColumnInfo('statusUpdateBtn', '', null, 
                            (rowData) => 
                            <button onClick={() => {
                                console.log("user id: ", rowData["userId"])
                                console.log("data: ", rowData)
                            }}>
                                Activate
                            </button>
                        ),
                    ],
                    filterFields: [
                        FormatterDict.FilterField('userId', 'Id', InputBuilder({ type: 'number' })),
                        FormatterDict.FilterField('status', 'Status', InputBuilder({ type: 'text' })),
                        FormatterDict.FilterField('email', 'Email', InputBuilder({ type: 'text' })),
                    ],
                    sortingFields: [
                        FormatterDict.SortingField('userId', 'Id'),
                        FormatterDict.SortingField('email', 'Email'),
                    ],
                },
                // TODO: add api services
                apiServices: {
                    GET_service: { action: AdminService.getClientPage },
                    // UPDATE_service: { action: UserGoodsService.updateGoods },
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
                ],
            }),
        [],
    );

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([]), []);

    return (
        <div className="client-list">
            <Table
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(true, true, false, true, true)}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}

export default AdminPage;
