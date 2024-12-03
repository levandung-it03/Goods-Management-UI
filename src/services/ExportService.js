import { UtilAxios, UtilMethods } from '@reusable/Utils';
import { springService } from '@src/configs/AxiosConfig';

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class UserExportService {
    static async getExportBillPages({ page, filterFields, sortedField, sortedMode }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-export-bill-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            response.data.data.data.forEach((obj) => {
                obj.createdTime = UtilMethods.formatResponseLocalDateTime(obj.createdTime);
                delete obj.warehouse;
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async getExportBillWarehouseGoods({ page, filterFields, sortedField, sortedMode, exportBillId }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-warehouse-goods-of-export-bill-pages`, {
                params: { page, filterFields, sortedField, sortedMode, id: exportBillId },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            response.data.data.data.forEach((obj) => {
                obj.goodsId = obj.warehouseGoods.goods.goodsId;
                obj.goodsName = obj.warehouseGoods.goods.goodsName;
                obj.unitPrice = obj.warehouseGoods.goods.unitPrice;
                obj.supplierName = obj.warehouseGoods.goods.supplier.supplierName;
                obj.warehouseName = obj.warehouseGoods.warehouse.warehouseName;
                delete obj.warehouseGoods;
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async createExportBill(formData) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/create-export-bill`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getTotalExportPrice(exportBillId) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/total-export-bill/${exportBillId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}
