import { UtilAxios } from "@reusable/Utils";
import { springService } from "@src/helpers/AxiosConfig";

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class UserGoodsService {
    static async getGoodsPages({ page, filterFields, sortedField, sortedMode }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-goods-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
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
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async addGoods(formData) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/add-goods`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}