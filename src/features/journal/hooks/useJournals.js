import { useQuery } from "@tanstack/react-query";

import { getJournals } from "../api/journalApi";

function useJournals() {
  return useQuery({
    queryKey: ["journals"],

    queryFn: getJournals,
  });
}

export default useJournals;
