import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { createJournal } from "../api/journalApi";

export const useCreateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["journals"],
      });
    },
  });
};
