import { useState, useEffect, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import { Button, Input, PageHeader } from "@/components/ui";

import JournalEditor from "../components/editor/JournalEditor";

import useJournal from "../hooks/useJournal";

import useUpdateJournal from "../hooks/useUpdateJournal";

function JournalDetailPage() {
  const navigate = useNavigate();

  const { journalId } = useParams();

  const editorRef = useRef(null);

  const { data: journal, isLoading, isError } = useJournal(journalId);

  const updateJournalMutation = useUpdateJournal();

  const [title, setTitle] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!journal) return;

    setTitle(journal.title);
  }, [journal]);

  async function handleSave() {
    try {
      const content = editorRef.current?.getJSON();

      if (!content) {
        toast.error("Editor content missing");

        return;
      }

      await updateJournalMutation.mutateAsync({
        journalId,

        data: {
          title,
          content,
        },
      });

      toast.success("Journal saved successfully ✨");

      setIsEditing(false);

      setTimeout(() => {
        navigate("/app/journals");
      }, 1200);
    } catch (error) {
      toast.error("Failed to save journal");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400">Loading journal...</p>
      </div>
    );
  }

  if (isError || !journal) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-red-400">Journal not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Your Reflection"
        description="Revisit thoughts, emotions, and moments."
      />

      <div
        className="
          rounded-[32px]
          border
          border-white/10
          bg-gradient-to-b
          from-white/[0.06]
          to-white/[0.03]
          p-8
          shadow-[0_0_60px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
        "
      >
        <div className="flex flex-col gap-8">
          {/* Top Section */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="space-y-4">
                <div
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.05]
                    px-4
                    py-1.5
                    text-sm
                    font-medium
                    text-slate-300
                    backdrop-blur-sm
                  "
                >
                  {journal.mood}
                </div>

                {isEditing ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold"
                  />
                ) : (
                  <h1
                    className="
                      max-w-3xl
                      text-4xl
                      font-bold
                      leading-tight
                      tracking-tight
                      text-white
                    "
                  >
                    {title}
                  </h1>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Journal
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      isLoading={updateJournalMutation.isPending}
                    >
                      Save Changes
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Meta Info */}
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
              <span
                className="
                  rounded-full
                  bg-white/[0.04]
                  px-3
                  py-1
                "
              >
                {new Date(journal.createdAt).toLocaleDateString()}
              </span>

              <span
                className="
                  rounded-full
                  bg-white/[0.04]
                  px-3
                  py-1
                "
              >
                {journal.wordCount} words
              </span>

              <span
                className="
                  rounded-full
                  bg-white/[0.04]
                  px-3
                  py-1
                "
              >
                {journal.category}
              </span>
            </div>

            {/* Tags */}
            {journal.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {journal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      rounded-full
                      border
                      border-violet-500/20
                      bg-violet-500/10
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-violet-200
                    "
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <JournalEditor
            ref={editorRef}
            initialContent={journal.content}
            editable={isEditing}
          />
        </div>
      </div>
    </div>
  );
}

export default JournalDetailPage;
