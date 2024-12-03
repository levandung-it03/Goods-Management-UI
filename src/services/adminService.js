import { UtilAxios } from '@reusable/Utils';
import { springService } from '@src/configs/AxiosConfig';
import { formatArrayToTime, formatArrayToDate } from '@src/utils/formatters';

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

    static async getClientPage({ page, filterFields, sortedField, sortedMode }) {
        try {
            const response = await springService.get(`${ADMIN_PREFIX_PART}/v1/get-full-users-as-page`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: UtilAxios.paramsSerializerToGetWithSortAndFilter,
            });
            response.data.data.data.forEach((d) => {
                d.createdAt = formatArrayToTime(d.createdTime);
                d.status = d.active ? "Active" : "Inactive";
                d.dateOfBirth = formatArrayToDate(d.dob);
                // console.log("debug: ", formatArrayToDate(d.dob));
            })
            
            console.log("🚀 ~ AdminService ~ getClientPage ~ response.data:", response.data)
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async createClient(formData) {
        console.log("🚀 ~ AdminService ~ createClient ~ formData:", formData)
        try {
            const response = await springService.post(`${ADMIN_PREFIX_PART}/v1/create-new-client`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}