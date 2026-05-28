import API from "../../../services/api";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await API.post("/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};
