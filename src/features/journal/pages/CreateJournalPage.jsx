import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, PageHeader } from "@/components/ui";

import FormField from "@/components/forms/FormField";

import useCreateJournal from "../hooks/useCreateJournal";

import JournalEditor from "../components/editor/JournalEditor";

import emptyEditorContent from "../utils/emptyEditorContent";

import { createJournalSchema } from "../validation/createJournalSchema";

function CreateJournalPage() {
  const navigate = useNavigate();

  const [content, setContent] = useState(emptyEditorContent);

  const createJournalMutation = useCreateJournal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createJournalSchema),

    defaultValues: {
      title: "",
      mood: "",
      category: "",
    },
  });

  async function onSubmit(values) {
    const payload = {
      ...values,

      content,

      tags: [],

      isDraft: false,
    };

    const journal = await createJournalMutation.mutateAsync(payload);

    navigate(`/app/journals/${journal.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="New Journal"
        description="Capture your thoughts gently and honestly."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <FormField label="Title" htmlFor="title" error={errors.title?.message}>
          <Input
            id="title"
            placeholder="Today's reflection..."
            {...register("title")}
          />
        </FormField>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Mood" htmlFor="mood" error={errors.mood?.message}>
            <Input id="mood" placeholder="peaceful" {...register("mood")} />
          </FormField>

          <FormField
            label="Category"
            htmlFor="category"
            error={errors.category?.message}
          >
            <Input
              id="category"
              placeholder="personal"
              {...register("category")}
            />
          </FormField>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">
            Journal Entry
          </label>

          <JournalEditor content={content} onChange={setContent} />
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={createJournalMutation.isPending}
        >
          Save Journal
        </Button>
      </form>
    </div>
  );
}

export default CreateJournalPage;
