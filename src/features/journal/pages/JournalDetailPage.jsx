import { useParams } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";

import useJournal from "../hooks/useJournal";

import extractTextFromContent from "../utils/extractTextFromContent";

function JournalDetailPage() {
  const { journalId } = useParams();

  const { data: journal, isLoading, isError } = useJournal(journalId);

  if (isLoading) {
    return <p className="text-slate-400">Loading journal...</p>;
  }

  if (isError || !journal) {
    return <p className="text-red-400">Journal not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title={journal.title}
        description={`Feeling ${journal.mood}`}
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

      <article
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
          leading-8
          text-slate-200
          backdrop-blur-sm
        "
      >
        <p className="whitespace-pre-wrap">
          {extractTextFromContent(journal.content)}
        </p>
      </article>
    </div>
  );
}

export default JournalDetailPage;
