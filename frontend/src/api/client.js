import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const loginUser = (email, password) =>
  API.post("/auth/login", { email, password });

export const getItems = () => API.get("/items/");

export const getCategories = () => API.get("/items/categories");

export const registerItem = (data) => API.post("/items/", data);

export const searchItems = (keyword, category_id, location) => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (category_id) params.append("category_id", category_id);
  if (location) params.append("location", location);
  return API.get(`/items/search?${params.toString()}`);
};

export const submitClaim = (data) => API.post("/claims/", data);

export const getMyClaims = (userId) => API.get(`/claims/my/${userId}`);

export const getPendingClaims = () => API.get("/claims/pending");

export const reviewClaim = (claimId, action, reviewedBy) =>
  API.patch(
    `/claims/${claimId}/review?action=${action}&reviewed_by=${reviewedBy}`,
  );

export const getApprovedNoReceipt = () => API.get("/claims/approved");

export const createReceipt = (data) => API.post("/receipts/", data);

export const getReceipt = (claimId) => API.get(`/receipts/${claimId}`);

export const getNotifications = (userId) => API.get(`/notifications/${userId}`);

export const markNotificationRead = (notificationId) =>
  API.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = (userId) =>
  API.patch(`/notifications/read-all/${userId}`);

export default API;
