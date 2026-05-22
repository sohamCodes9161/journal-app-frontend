import { useQuery } from "@tanstack/react-query";

import { getJournalById } from "../api/journalApi";

function useJournal(journalId) {
  return useQuery({
    queryKey: ["journal", journalId],

    queryFn: () => getJournalById(journalId),

    enabled: !!journalId,
  });
}

export default useJournal;
