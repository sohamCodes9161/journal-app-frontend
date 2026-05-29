import API from "../../../services/api";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // ✅ This now correctly appends the raw file!

  const response = await API.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};
