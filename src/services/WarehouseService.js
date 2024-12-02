import { UtilAxios, UtilMethods } from "@reusable/Utils";
import { springService } from "@src/configs/AxiosConfig";

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class UserWarehouseService {
    static async getWarehousePages({ page, filterFields, sortedField, sortedMode }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-warehouses-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateWarehouse(formData) {
        try {
            const response = await springService.put(`${USER_PREFIX_PART}/v1/update-warehouse`, formData);
            if (response.status === 200)    UtilMethods.showToast(response.data.message, "success");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async addWarehouse(formData) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/add-warehouse`, formData);
            if (response.status === 200)    UtilMethods.showToast(response.data.message, "success");
            console.log(response)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async deleteWarehouse(id) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/delete-warehouse`, { id });
            if (response.status === 200)    UtilMethods.showToast(response.data.message, "success");
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
}