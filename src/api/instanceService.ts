import api from "./axios";

export const getInstances = async () => {
  const res = await api.get("/program-instances");
  return res.data.data;
};

export const createInstance = async (data: any) => {
  const res = await api.post("/program-instances", data);
  return res.data.data;
};

export const updateInstance = async (id: string, data: any) => {
  const res = await api.put(`/program-instances/${id}`, data);
  return res.data.data;
};

export const deleteInstance = async (id: string) => {
  const res = await api.delete(`/program-instances/${id}`);
  return res.data;
};
