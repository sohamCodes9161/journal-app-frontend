import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTodo } from "../api/todoApi";

export default function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
}
