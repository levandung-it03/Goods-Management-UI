import { UtilAxios, UtilMethods } from '@reusable/Utils';
import { springService } from '@src/configs/AxiosConfig';

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class UserGoodsService {
    static async getGoodsPages({ page, filterFields, sortedField, sortedMode }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-goods-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            response.data.data.data.forEach((obj) => {
                obj.supplierName = obj.supplier.supplierName;
                delete obj.supplier;
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getSimpleGoodsPages({ goodsName, page }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-simple-goods-pages`, {
                params: { goodsName, page },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getGoodsFromWarehousePages({ page, filterFields, sortedField, sortedMode, goodsId }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-goods-from-warehouse-pages`, {
                params: { page, filterFields, sortedField, sortedMode, id: goodsId },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            response.data.data.data.forEach((obj) => {
                obj.warehouseId = obj.warehouse.warehouseId;
                obj.warehouseName = obj.warehouse.warehouseName;
                obj.address = obj.warehouse.address;
                delete obj.warehouse;
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateGoods(formData) {
        try {
            const response = await springService.put(`${USER_PREFIX_PART}/v1/update-goods`, formData);
            if (response.status === 200)    UtilMethods.showToast(response.data.message, "success");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async addGoods(formData) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/add-goods`, formData);
            if (response.status === 200)    UtilMethods.showToast(response.data.message, "success");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async deleteGoods(id) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/delete-goods`, { id });
            if (response.status === 200)    UtilMethods.showToast(response.data.message, "success");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}
