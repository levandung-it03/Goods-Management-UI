import { UtilAxios } from "@reusable/Utils";
import { springService } from "@src/configs/AxiosConfig";

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class UserSupplierService {
    static async getSupplierPages({ page, filterFields, sortedField, sortedMode }) {
        try {
            const response = await springService.get(`${USER_PREFIX_PART}/v1/get-suppliers-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateSupplier(formData) {
        try {
            const response = await springService.put(`${USER_PREFIX_PART}/v1/update-supplier`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async addSupplier(formData) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/add-supplier`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}