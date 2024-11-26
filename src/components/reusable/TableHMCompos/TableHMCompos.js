import './TableHMCompos.scss';
import { checkIsBlank, timeAsKey, showToast } from "../Utils";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, ListFilter, Pencil, Plus } from 'lucide-react';
import { Form, SelectBuilder } from "@FormHMCompos";
import Pagination from "@Pagination";
import ContextMenu from '../ContextMenu/ContextMenu';

export const FormatterDict = {
    TableComponents({
        tableInfo = { primaryKeyName:"", title: "", offHeaders: false, columnsInfo: [], filterFields: [], sortingFields: [] },
        apiServices = {
            GET_service: { action() { }, moreParams: {} },
            GET_replacedAction: { async action() { }, moreParams: {} },
            UPDATE_service: { action() { }, moreParams: {} },
            DELETE_service: { action() { }, moreParams: {} }
        },
        moreReducers = [
            // Example: { eventName: "onClick", reducer: (e, rowData) => {} }
        ],
    }) {
        return { tableInfo, apiServices, moreReducers };
    },
    AddingFormComponents({
        apiServices = {
            POST_service: { action() { }, moreParams: {} },
        },
        childrenBuildersInfo = [],
        handleSubmit = null
    }) {
        return { apiServices, childrenBuildersInfo, handleSubmit };
    },
    ContextMenuComponents(menuBuilders = []) {
        return { menuBuilders };
    },
    TableModes(canSelectingRow = false, canUpdatingRow = false, canDeletingRow = false, hasAddingForm = false, hasContextMenu = false) {
        return { canSelectingRow, canUpdatingRow, canDeletingRow, hasAddingForm, hasContextMenu };
    },
    ColumnInfo(name = "name", headerLabel = "Header Label", updatingFieldBuilder, replacedContent) {
        return { name, headerLabel, updatingFieldBuilder, replacedContent };
    },
    FilterField: (name = "name", label = "Name", formChildBuilder = ()=>{}) => ({ name, legend: label, builder: formChildBuilder }),
    SortingField: (name = "name", sortingLabel = "Name") => ({ name, sortingLabel }),
    TableRowMoreReducer: (eventName = "onClick", reducer = ()=>{}) => ({ eventName, reducer })
}

export function Table(props) {
    console.log("table");
    const { tableComponents, addingFormComponents, contextMenuComponents, tableModes } = props;
    const { primaryKeyName } = tableComponents.tableInfo;
    const [tableState, setTableState] = useState([]);
    const [contextMenu, setContextMenu] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filterData, setFilterData] = useState(null);
    const [sortData, setSortData] = useState(null);

    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [selectedRows, setSelectedRows] = useState({});
    
    const handleSelectAll = useCallback((e) => {
        setSelectedRows(prev => {
            const result = {...prev};
            if (!checkIsBlank(prev[currentPage])) {
                if (tableState.length === Object.keys(prev[currentPage]).length)  //--Already has fully value, but select all again (remove)
                    delete result[currentPage];
                else  //--Having not enough fully rowsData
                    result[currentPage] = tableState.reduce((acc, rowData) => ({
                        ...acc,
                        [rowData[primaryKeyName]]: true
                    }), {});
            }
            else    //--Have nothing about this current-page.
                result[currentPage] = tableState.reduce((acc, rowData) => ({
                    ...acc,
                    [rowData[primaryKeyName]]: true
                }), {});
            return result;
        });
    }, [tableState, currentPage, primaryKeyName]);

    const handleSelectingRow = useCallback((e, rowData) => {
        setSelectedRows(prev => {
            const primaryValue = rowData[primaryKeyName];
            const result = {...prev};
            if (!checkIsBlank(prev[currentPage])) {
                if (!checkIsBlank(prev[currentPage][primaryValue])) {   //--Already has value, but select again (remove)
                    delete result[currentPage][primaryValue];
                    checkIsBlank(result[currentPage]) && delete result[currentPage];
                } else {    //--Haven't had value yet (add)
                    result[currentPage][primaryValue] = true;
                    return result;
                }
            } else {    //--Haven't had "page" property, value absolutely either(add)
                result[currentPage] = {};
                result[currentPage][primaryValue] = true;
            }
            return result;
        });
    }, [currentPage, primaryKeyName]);

    const handleContextMenu = useCallback((e, rowData) => {
        e.preventDefault();
        const menuItemsBuilders = [];
        if (tableModes.canUpdatingRow)
            menuItemsBuilders.push(rowData => (
                { text: 'Update Row Info', icon: <Pencil />, action: () => setUpdatingRowId(rowData[primaryKeyName]) })
            );
        menuItemsBuilders.push(...contextMenuComponents.menuBuilders);
        setContextMenu({
            isShown: true,
            x: e.pageX,
            y: e.pageY,
            menuItems: menuItemsBuilders.map(menuContextBuilder => menuContextBuilder(rowData))
        });
    }, [primaryKeyName, contextMenuComponents, tableModes.canUpdatingRow]);

    useEffect(() => {
        async function fetchData() {
            if (tableComponents.apiServices.GET_replacedAction) {
                const params = tableComponents.apiServices.GET_replacedAction.moreParams;
                return tableComponents.apiServices.GET_replacedAction.action(params);
            } else {
                const request = { page: currentPage, ...tableComponents.apiServices.GET_service.moreParams };
                if (filterData && Object.keys(filterData).length !== 0)
                    request.filterFields = filterData;
                if (sortData && Object.keys(sortData).length !== 0) {
                    request.sortedField = sortData.sortedField;
                    request.sortedMode = sortData.sortedMode;
                }
                const result = await tableComponents.apiServices.GET_service.action(request);
                return result;
            }
        };
        fetchData()
            .then(response => {
                setTableState(response.data.data);
                setTotalPages(response.data.totalPages);
                showToast(response.message, "success");
            })
            .catch(error => showToast(error.message, "error"));
    }, [sortData, filterData, currentPage, tableComponents.apiServices.GET_replacedAction]);

    return (
        <>
            <div className="table-wrapper">
                <div className="table-feature">
                    <div className="table-title">{tableComponents.tableInfo.title}</div>
                    <Tools
                        sortData={sortData} setSortData={setSortData}
                        filterData={filterData} setFilterData={setFilterData}
                        tableInfo={tableComponents.tableInfo}
                    />
                </div>
                <div className="table-header">
                    <div className="table-row">
                        {tableModes.canSelectingRow && <div className="table-cell-checkbox">
                            <input type="checkbox" onChange={handleSelectAll}
                                checked={!!selectedRows[currentPage] && tableState.length === Object.keys(selectedRows[currentPage]).length}/>
                        </div>}
                        {!tableComponents.tableInfo.offHeaders && tableComponents.tableInfo.columnsInfo.map((columnInfo, index) =>
                            <div key={index} className="table-cell">{columnInfo.headerLabel}</div>
                        )}
                    </div>
                </div>
                <div className="table-body">
                    {tableState.map((rowData, index) =>
                        <TableRowBuilder
                            key={"table-row-" + timeAsKey + index}
                            rowData={rowData}
                            primaryKeyName={primaryKeyName}
                            columnsInfo={tableComponents.tableInfo.columnsInfo}
                            tableModes={tableModes}
                            UPDATE_service={tableComponents.apiServices.UPDATE_service}

                            currentPage={currentPage}
                            selectedRows={selectedRows}
                            updatingRowIdState={updatingRowId}
                            handleContextMenu={handleContextMenu}

                            onClick={e => tableModes.canSelectingRow && handleSelectingRow(e, rowData)}
                            onContextMenu={e => handleContextMenu(e, rowData)}
                            {...tableComponents.moreReducers.reduce((acc, obj) =>
                                ({ ...acc, [obj.eventName]: e => obj.reducer(e, rowData)})
                            , {})}
                        />
                    )}
                    {tableModes.hasAddingForm &&
                        <AddingForm
                            className="table-adding-form"
                            key={"table-adding-form-" + timeAsKey}
                            tableModes={tableModes}
                            addingFormComponents={addingFormComponents}
                        />}
                </div>
            </div>
            {tableModes.hasContextMenu && <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />}
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </>
    );
}

function TableRowBuilder({
    //--States
    primaryKeyName, rowData, columnsInfo, tableModes, UPDATE_service,
    //--State-setters
    updatingRowIdState, handleContextMenu, moreReducers,
    //--Unchangable
    isUpdatingRow, selectedRows, currentPage, ...props
}) {
    const primaryKeyValue = useMemo(() => rowData[primaryKeyName], [primaryKeyName]);

    const buildHeadingCell = useCallback(() => {
        if (tableModes.canUpdatingRow && isUpdatingRow)
            return undefined;
        else if (tableModes.canSelectingRow)
            return <input type="checkbox" readOnly checked={!!selectedRows[currentPage] && !!selectedRows[currentPage][primaryKeyValue]} />
        else
            return <span>{primaryKeyValue}</span>
    }, [isUpdatingRow, selectedRows, tableModes.canSelectingRow, tableModes.canUpdatingRow]);

    useEffect(() => {
        if (checkIsBlank(tableModes.canUpdatingRow))
            UPDATE_service.moreParams = {
                ...UPDATE_service.moreParams,
                [primaryKeyName]: primaryKeyValue   //--Always attach primaryKeyValue when updating-row.
            };
    }, [UPDATE_service, primaryKeyValue, primaryKeyName, tableModes.canUpdatingRow]);

    return (<div className="table-row" {...props}>
        <div className="table-cell-checkbox" key="table-heading-cell">
            {buildHeadingCell()}
        </div>
        {tableModes.canUpdatingRow && isUpdatingRow
            ? <Form
                offFieldsets={true}
                POST_service={UPDATE_service}
                defaultValues={rowData}
                childrenBuildersInfo={columnsInfo.map(columnInfo => columnInfo.updatingFieldBuilder)}
            />
            : columnsInfo.map((columnInfo, index) => <div className="table-cell" key={"table-cell-" + timeAsKey + index}>
                {columnInfo.replacedContent ? columnInfo.replacedContent(rowData) : <span>{rowData[columnInfo.name]}</span>}
            </div>)
        }
    </div>);
}

function AddingForm({ tableModes, addingFormComponents, ...props }) {
    const [isAddingRow, setIsAddingRow] = useState(false);

    useEffect(() => {
        if (tableModes.hasAddingForm && isAddingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') setIsAddingRow(false); // Turn off adding mode
            };
            window.addEventListener('keydown', handleKeyDown);

            return () => {  // Cleanup when component unmount or isAddingRow is false
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isAddingRow, tableModes.hasAddingForm]);

    return isAddingRow ? (
        <Form
            {...props}
            offFieldsets={true}
            POST_service={addingFormComponents.POST_service}
            childrenBuildersInfo={addingFormComponents.childrenBuildersInfo}
        />
    ) : <div className="table-row add-row" onClick={() => setIsAddingRow(true)}>
        <div className="table-cell"> <Plus /> </div>
        <div className="table-cell">Add row</div>
    </div>;
}

function Tools(props) {
    const { setSortData, setFilterData, tableInfo } = props;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const handleOpenSortBlock = useCallback((e) => {
        if (isSortOpen === false && isFilterOpen)
            setIsFilterOpen(!isFilterOpen);
        setIsSortOpen(!isSortOpen);
    }, [isFilterOpen, isSortOpen]);
    
    const handleOpenFilterBlock = useCallback((e) => {
        if (isFilterOpen === false && isSortOpen)
            setIsSortOpen(!isSortOpen);
        setIsFilterOpen(!isFilterOpen);
    }, [isFilterOpen, isSortOpen]);

    return (<div className="table-tool center">
        {tableInfo.filterFields &&
            <div className={`tool-button filter-box${isFilterOpen ? '-open' : ''}`}
                key={"tool-button-filter-" + timeAsKey}>
                <ListFilter className="tool-icon" onClick={handleOpenFilterBlock} />
                <Form
                    className="filter-box"
                    childrenBuildersInfo={tableInfo.filterFields}
                    replacedSubmitBtnBuilder={formData => <div className="filter-submit-btn">
                        <button onClick={e => { e.preventDefault(); setFilterData(formData); }}>Confirm Filter</button>
                    </div>}
                />
            </div>
        }
        {tableInfo.sortingFields &&
            <div className={`tool-button sort-box${isSortOpen ? '-open' : ''}`}
                key={"tool-button-sort-" + timeAsKey}>
                <ArrowDownUp className="tool-icon" onClick={handleOpenSortBlock} />
                <Form
                    className="sort-box"
                    childrenBuildersInfo={[
                        { name: "sortedFiled", legend: "Sorted Field", builder: SelectBuilder({ name: "sortedFiled",
                            options: tableInfo.sortingFields.map(info => ({ value: info.name, text: info.sortingLabel }))
                        })},
                        { name: "sortedMode", legend: "Sorted Mode", builder: SelectBuilder({ name: "sortedMode",
                            options: [{ value: 1, text: 'Ascending' }, { value: -1, text: 'Descending' }]
                        })},
                    ]}
                    replacedSubmitBtnBuilder={formData => <div className="sorting-submit-btn">
                        <button onClick={e => { e.preventDefault(); setSortData(formData); }}>Confirm Sort</button>
                    </div>}
                />
            </div>
        }
    </div>);
}