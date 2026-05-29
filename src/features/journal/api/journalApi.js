import API from "@/services/api";

export async function getJournals(params = {}) {
  const response = await API.get("/journals", {
    params,
  });

  return response.data.data;
}

export async function getJournalById(journalId) {
  const response = await API.get(`/journals/${journalId}`);

  return response.data.data;
}

export async function createJournal(data) {
  const response = await API.post("/journals", data);

  return response.data.data;
}

export async function updateJournal({ journalId, data }) {
  console.log("Updating journal with ID:", journalId);
  console.log("Data being sent:", data);
  const response = await API.patch(`/journals/${journalId}`, data);

  return response.data.data;
}

export async function deleteJournal(journalId) {
  const response = await API.delete(`/journals/${journalId}`);

  return response.data.data;
}
