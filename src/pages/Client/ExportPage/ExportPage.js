import { useState } from 'react';
import './ExportPage.scss';
import TableLeft from './TableLeft/TableLeft';
import TableRight from './TableRight/TableRight';

function ExportPage() {
    const [data, setData] = useState([]);

    return (
        <div className="export-page flex-col">
            <div className="title center">Create Bill Of Exporting Goods</div>
            <div className="content">
                <div className="table-left flex-col">
                    <TableLeft setData={setData} />
                </div>
                <div className="table-right flex-col">
                    <TableRight data={data} />
                </div>
            </div>
        </div>
    );
}

export default ExportPage;
