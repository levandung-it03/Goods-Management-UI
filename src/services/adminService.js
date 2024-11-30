import { springService } from "@src/configs/AxiosConfig";

const ADMIN_PREFIX_PART = process.env.REACT_APP_SPRING_ADMIN_PREFIX_PART;

export class AdminService {
    static async getAdminInformation() {
        try {
            const response = await springService.get(
                `${ADMIN_PREFIX_PART}/v1/get-information`
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            throw error.response ? error.response.data : error;
        }
    }
}