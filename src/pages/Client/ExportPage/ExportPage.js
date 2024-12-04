import { useState } from 'react';
import './ExportPage.scss';
import TableLeft from './TableLeft/TableLeft';
import TableRight from './TableRight/TableRight';

function ExportPage() {
    const [isLock, setIsLock] = useState(false);
    const [data, setData] = useState([]);

    return (
        <div className="export-page flex-col">
            <div className="title center">Create Bill Of Exporting Goods</div>
            <div className="content">
                <div className="table-left flex-col">
                    <TableLeft setData={setData} isLock={isLock} setIsLock={setIsLock} />
                </div>
                <div className="table-right flex-col">
                    <TableRight data={data} isLock={isLock} setIsLock={setIsLock} />
                </div>
            </div>
        </div>
    );
}

export default ExportPage;
