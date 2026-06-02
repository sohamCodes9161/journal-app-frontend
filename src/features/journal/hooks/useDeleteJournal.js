import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJournal } from "../api/journalApi";
import toast from "react-hot-toast";

function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. The actual API function that hits your backend DELETE route
    mutationFn: (journalId) => deleteJournal(journalId),

    // 2. This runs automatically the split second the server responds with success
    onSuccess: () => {
      toast.success("Journal entry deleted successfully!");

      // 3. This tells TanStack Query to instantly refetch your list of journals
      // Replace "journals" with whatever queryKey you use in your list component (e.g., useGetJournals)
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },

    onError: (error) => {
      console.error("Error deleting journal entry:", error);
      toast.error("Failed to delete journal entry.");
    },
  });
}

export default useDeleteJournal;
