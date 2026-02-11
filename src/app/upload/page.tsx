"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PROMPTS = [
  "Best memory with the couple?",
  "Advice for a happy marriage?",
  "A funny moment you shared?",
  "Your favorite thing about them?"
];

const TAGS = ["memory", "advice", "funny", "blessing"];

export default function UploadPage() {
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  const prompt = useMemo(() => PROMPTS[promptIndex % PROMPTS.length], [promptIndex]);

  const onPickFile = (selected: File | null) => {
    setError(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.type.startsWith("image/") && !selected.type.startsWith("video/")) {
      setError("Only image and video files are allowed.");
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      setError("File must be 50MB or smaller.");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onPickFile(event.dataTransfer.files?.[0] || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!message.trim()) {
      setError("Please add a message for the couple.");
      return;
    }
    if (!file) {
      setError("Please attach a photo or video.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("guest_name", guestName || "Anonymous");
      formData.append("message", message);
      formData.append("tags", JSON.stringify(tags));
      formData.append("file", file);

      const response = await fetch("/api/guest-entries", {
        method: "POST",
        body: formData
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      setSuccess(true);
      setGuestName("");
      setMessage("");
      setTags([]);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <Link href="/" className="text-sm text-babyBlue-600">
          Back to home
        </Link>

        <header className="glass-card rounded-xl px-8 py-8 shadow-soft">
          <h1 className="font-display text-3xl md:text-4xl">Share your memory</h1>
          <p className="mt-3 text-sm text-slate-600">
            Upload a photo or video and leave a short message. Thank you for celebrating
            with us.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 shadow-soft">
          <div className="grid gap-6">
            <label className="grid gap-2 text-sm">
              Your name (optional)
              <input
                className="rounded-xl border border-silver bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-babyBlue-300"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Your name"
              />
            </label>

            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Message</span>
                <button
                  type="button"
                  className="text-xs text-babyBlue-600"
                  onClick={() => setPromptIndex((prev) => prev + 1)}
                >
                  New prompt
                </button>
              </div>
              <p className="text-xs text-slate-500">Prompt: {prompt}</p>
              <textarea
                className="min-h-[120px] rounded-xl border border-silver bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-babyBlue-300"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={500}
                placeholder="Write your message"
              />
              <div className="text-right text-xs text-slate-400">{message.length}/500</div>
            </div>

            <div className="grid gap-2 text-sm">
              Tags
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs transition ${
                      tags.includes(tag)
                        ? "border-babyBlue-400 bg-babyBlue-100 text-babyBlue-700"
                        : "border-silver bg-white text-slate-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-babyBlue-300 bg-white/70 px-6 py-10 text-center"
            >
              <p className="text-sm text-slate-600">Drag and drop a photo or video</p>
              <label className="cursor-pointer rounded-full bg-babyBlue-500 px-5 py-2 text-xs text-white shadow-glow">
                Choose file
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(event) => onPickFile(event.target.files?.[0] || null)}
                />
              </label>
              {file && (
                <div className="text-xs text-slate-500">Selected: {file.name}</div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-babyBlue-200 bg-babyBlue-50 px-4 py-3 text-sm text-babyBlue-700">
                Thank you. Your memory has been saved.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-babyBlue-500 px-6 py-3 text-sm text-white shadow-glow transition hover:bg-babyBlue-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Uploading..." : "Submit memory"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
