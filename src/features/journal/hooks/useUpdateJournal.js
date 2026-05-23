import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { updateJournal } from "../api/journalApi";

function useUpdateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournal,

    onSuccess: (updatedJournal) => {
      queryClient.invalidateQueries({
        queryKey: ["journals"],
      });

      queryClient.invalidateQueries({
        queryKey: ["journal", updatedJournal.id],
      });
    },
  });
}

export default useUpdateJournal;
