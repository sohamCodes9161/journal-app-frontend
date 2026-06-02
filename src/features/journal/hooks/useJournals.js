import { useQuery } from "@tanstack/react-query";
import { getJournals } from "../api/journalApi";

// 🌟 Accept the params object (page, limit, search, mood, etc.)
function useJournals(params = {}) {
  return useQuery({
    // 🌟 Include params inside the queryKey so React Query updates whenever they change!
    queryKey: ["journals", params],

    // 🌟 Pass the params directly into your API fetching function
    queryFn: () => getJournals(params),
  });
}

export default useJournals;
