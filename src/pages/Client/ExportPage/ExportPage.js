import { useEffect, useState } from 'react';
import './ExportPage.scss';
import TableLeft from './TableLeft/TableLeft';
import TableRight from './TableRight/TableRight';
import { cookieHelpers } from '@src/utils/helpers';

function ExportPage() {
    const [goodsIds, setGoodsIds] = useState([1, 2, 3]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const url = `https://3fba-2001-ee0-5006-a220-6c73-c71-dc0c-4b18.ngrok-free.app/api/private/user/v1/flux-goods-quantity?goodsFromWarehouseIds=${goodsIds.join(
            ',',
        )}`;
        const headers = new Headers({
            Authorization: `Bearer ${cookieHelpers.getCookies().accessToken}`,
            'ngrok-skip-browser-warning': true,
        });

        fetch(url, { headers })
            .then((response) => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                function read() {
                    reader.read().then(({ done, value }) => {
                        if (done) return;
                        const text = decoder.decode(value, { stream: true });
                        console.log(text);
                        read();
                    });
                }

                read();
            })
            .catch((error) => console.error('Error:', error));
    }, [goodsIds]);

    return (
        <div className="export-page flex-col">
            <div className="title center">Create Bill Of Exporting Goods</div>
            <div className="content">
                <div className="table-left flex-col">
                    <TableLeft setGoodsIds={setGoodsIds} setData={setData} />
                </div>
                <div className="table-right flex-col">
                    <TableRight data={data} />
                </div>
            </div>
        </div>
    );
}

export default ExportPage;
