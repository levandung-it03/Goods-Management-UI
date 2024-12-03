import { springService } from '@src/configs/AxiosConfig';

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class UserExportService {
    static async createExportBill(formData) {
        try {
            const response = await springService.post(`${USER_PREFIX_PART}/v1/create-export-bill`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}
