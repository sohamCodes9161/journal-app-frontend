import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTodo } from "../api/todoApi";

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
}
