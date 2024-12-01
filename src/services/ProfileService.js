import { springService } from "@src/configs/AxiosConfig";

const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;

export class ProfileService {
    // Lấy thông tin người dùng
    static async getUserProfile() {
        try {
            const response = await springService.get(
                `${USER_PREFIX_PART}/v1/info`
            );
            return response.data; // Trả về dữ liệu người dùng
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            throw error.response ? error.response.data : error; // Ném lỗi để xử lý ở component
        }
    }

    // Cập nhật thông tin người dùng
    static async updateUserProfile(formData) {
        try {
            const response = await springService.put(
                `${USER_PREFIX_PART}/v1/info`,
                formData
            );
            return response.data; // Trả về dữ liệu đã cập nhật
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            throw error.response ? error.response.data : error; // Ném lỗi để xử lý ở component
        }
    }
}
