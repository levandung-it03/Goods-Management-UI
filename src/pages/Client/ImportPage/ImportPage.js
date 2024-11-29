import Table from '@reusable/Table/Table';
import './ImportPage.scss';
import TableLeft from './TableLeft/TableLeft';
import TableRight from './TableRight/TableRight';

function ImportPage() {
    const [isLock, setIsLock] = useState(false);
    const [goodsIds, setGoodsIds] = useState([]);
    const [data, setData] = useState([]);

    return (
        <div className="import-page flex-col">
            <div className="title center">Create Bill Of Importing Goods</div>
            <div className="content">
                <Table />
            </div>
        </div>
    );
}

export default ImportPage;
