import { useMutation } from "@tanstack/react-query";

import { uploadImage } from "../api/uploadApi";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};
