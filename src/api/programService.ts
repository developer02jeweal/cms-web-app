import api from "./axios";

export const getPrograms = async () => {
  const res = await api.get("/programs");
  return res.data.data;
};

export const createProgram = async (data: any) => {
  const res = await api.post("/programs", data);
  return res.data.data;
};

export const updateProgram = async (id: string, data: any) => {
  const res = await api.put(`/programs/${id}`, data);
  return res.data.data;
};

export const deleteProgram = async (id: string) => {
  const res = await api.delete(`/programs/${id}`);
  return res.data;
};
