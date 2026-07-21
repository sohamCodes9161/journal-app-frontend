// src/features/journal/hooks/useUpdateJournal.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJournal } from "../api/journalApi";
import { clearDraft } from "../draftStorage/storage";

function useUpdateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournal,

    onSuccess: (updatedJournal) => {
      // 1. Clear local draft on successful DB update
      if (updatedJournal?.id) {
        clearDraft(updatedJournal.id);
      }

      // 2. Refresh cached queries
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
