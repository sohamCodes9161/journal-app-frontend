import { useQuery } from "@tanstack/react-query";

import { getTodos } from "../api/todoApi";

export default function useTodos(params = {}) {
  return useQuery({
    queryKey: ["todos", params],

    queryFn: () => getTodos(params),
  });
}
