"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QueryInputProps {
  onSubmit: (question: string) => void;
  loading: boolean;
}

export function QueryInput({ onSubmit, loading }: QueryInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || loading) return;
    onSubmit(q);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask a research question..."
        disabled={loading}
        className="flex-1"
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Researching..." : "Research"}
      </Button>
    </form>
  );
}
