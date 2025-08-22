// import type { AxiosError } from "axios";
// import { config } from "../../env";
// import { API_ENDPOINTS } from "../constants";
// import axiosInstance from "./axiosInstance";
// import { handleApiError } from "./errorApi";

// export const api = async (payload: InterviewCreateRequest) => {
//     try {
//         const response = await axiosInstance.post(`${config.Domain}${API_ENDPOINTS.CREATE_INTERVIEW}`, {
//             token: token,
//         });

//         return { success: true, data: response.data };
//     }
//     catch (error) {
//         return handleApiError(error as AxiosError);
//     }
// };