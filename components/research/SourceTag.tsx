interface SourceTagProps {
  title: string;
  url: string;
}

export function SourceTag({ title, url }: SourceTagProps) {
  return (
    <sup>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-0.5 inline-flex items-center rounded bg-primary/10 px-1 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
        title={title}
      >
        {title}
      </a>
    </sup>
  );
}
