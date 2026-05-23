import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Input, PageHeader } from "@/components/ui";

import JournalEditor from "../components/editor/JournalEditor";

import useJournal from "../hooks/useJournal";

import useUpdateJournal from "../hooks/useUpdateJournal";

function JournalDetailPage() {
  const navigate = useNavigate();
  const { journalId } = useParams();

  const { data: journal, isLoading, isError } = useJournal(journalId);

  const updateJournalMutation = useUpdateJournal();

  const [title, setTitle] = useState("");

  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!journal) return;

    setTitle(journal.title);

    setContent(journal.content);
  }, [journal]);

  async function handleSave() {
    try {
      await updateJournalMutation.mutateAsync({
        journalId,

        data: {
          title,
          content,
        },
      });

      toast.success("Journal saved successfully ✨");

      setTimeout(() => {
        navigate("/app/journals");
      }, 1200);
    } catch (error) {
      toast.error("Failed to save journal");
    }
  }

  if (isLoading) {
    return <p className="text-slate-400">Loading journal...</p>;
  }

  if (isError || !journal) {
    return <p className="text-red-400">Journal not found.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Your Reflection"
        description="Revisit thoughts, emotions, and moments."
      />

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-semibold"
      />

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-3
          text-sm
          text-slate-400
        "
      >
        <span>{new Date(journal.createdAt).toLocaleDateString()}</span>

        <span>{journal.wordCount} words</span>

        <span>{journal.category}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {journal.tags?.map((tag) => (
          <span
            key={tag}
            className="
              rounded-full
              bg-white/10
              px-3
              py-1
              text-xs
              text-slate-300
            "
          >
            #{tag}
          </span>
        ))}
      </div>

      {content && <JournalEditor content={content} onChange={setContent} />}

      <Button onClick={handleSave} isLoading={updateJournalMutation.isPending}>
        Save Changes
      </Button>
    </div>
  );
}

export default JournalDetailPage;
