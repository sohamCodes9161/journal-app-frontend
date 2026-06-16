import API from "@/services/api";

export const fetchWorkspaceAnalytics = async (range = "week") => {
  // Matches the GET /api/analysis?range=week endpoint structure
  const response = await API.get(`/analytics`, {
    params: { range },
    withCredentials: true, // Ensures session tokens are passed if using cookies
  });
  return response.data.data;
};
