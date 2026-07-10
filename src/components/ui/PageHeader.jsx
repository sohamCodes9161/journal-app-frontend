import Typography from "@/components/ui/Typography";

function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <Typography variant="h1">{title}</Typography>
      {description && (
        <Typography variant="muted" className="mt-2 max-w-2xl">
          {description}
        </Typography>
      )}
    </div>
  );
}

export default PageHeader;
