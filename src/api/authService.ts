import api from "./axios";

export const loginAPI = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", data);

  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);

  return response.data;
};
 

export const logoutAPI = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  await api.post("/auth/logout", {
    refreshToken,
  });

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
