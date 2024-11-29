import { springService } from "@src/configs/AxiosConfig";
const USER_PREFIX_PART = process.env.REACT_APP_SPRING_USER_PREFIX_PART;
export class DashboardService {
    static async getStatistics() {
        try {
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/statistics"
            );
            console.log(response);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API thống kê:", error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getExportBills() {
        try {
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/get-export-bill-top5"
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API phiếu xuất:", error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getImportBills() {
        try {
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/get-import-bill-top5"
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API phiếu nhập:", error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getDetailExportBill(id) {
        try {
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/exports-bill/" + id
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API xem chi tiết phiếu xuất:", error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getDetailImportBill(id) {
        try {
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/imports-bill/" + id
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API xem chi tiết phiếu nhập:", error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getInventoryChartData() {
        try {
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/goods-quantity"
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API biểu đồ kho:", error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getGoodsTrendChart(startDate, endDate) {
        try {
            console.log(startDate, endDate);
            const response = await springService.get(
                USER_PREFIX_PART + "/v1/export-import-trend",
                {
                    params: { startDate, endDate },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API biểu đồ xu hướng hàng hóa:", error);
            throw error.response ? error.response.data : error;
        }
    }
}
