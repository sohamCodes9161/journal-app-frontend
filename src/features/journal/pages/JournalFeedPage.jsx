import PageHeader from "@/components/ui/PageHeader";

import JournalCard from "../components/JournalCard";

import useJournals from "../hooks/useJournals";

function JournalFeedPage() {
  const { data, isLoading, isError } = useJournals();

  if (isLoading) {
    return <p className="text-slate-400">Loading journals...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load journals.</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Journals"
        description="Moments, reflections, and thoughts captured over time."
      />
      <div className="grid gap-5">
        {data?.journals?.map((journal) => (
          <JournalCard key={journal._id} journal={journal} />
        ))}
      </div>
    </div>
  );
}

export default JournalFeedPage;
