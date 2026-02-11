"use client";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Pause, Play, Plus, X } from "lucide-react";
import { Great_Vibes } from "next/font/google";
import imageCompression from "browser-image-compression";
import confetti from "canvas-confetti";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type GuestEntry = {
  id: string;
  guest_name: string;
  message: string;
  media_url: string | null;
  media_type: "image" | "video";
  tags: string[] | null;
  created_at: string;
  likes: number | null;
};

type Heart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
};

const RainingHearts = () => {
  const [mounted, setMounted] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    setMounted(true);
    const nextHearts = Array.from({ length: 24 }).map((_, index) => ({
      id: index,
      left: Math.random() * 100,
      size: 16 + Math.random() * 12,
      duration: 16 + Math.random() * 16,
      delay: Math.random() * 6,
      rotate: Math.random() * 360
    }));
    setHearts(nextHearts);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute top-[-10%] text-blue-900/60"
          style={{ left: `${heart.left}%`, width: heart.size, height: heart.size }}
          animate={{ y: "100vh", rotate: heart.rotate + 360 }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.span>
      ))}
    </div>
  );
};

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

const AnimatedLogo = () => (
  <div
    className={`flex items-center justify-center gap-4 text-5xl text-blue-900 md:text-7xl ${greatVibes.className}`}
  >
    <motion.span
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      Meor
    </motion.span>

    <div className="flex h-16 w-16 items-center justify-center md:h-24 md:w-24">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <motion.path
          d="M 50 30 C 40 20 20 30 25 50 C 30 65 50 80 50 80 C 50 80 70 65 75 50 C 80 30 60 20 50 30 Z"
          fill="transparent"
          stroke="#ef4444"
          strokeWidth="4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
    </div>

    <motion.span
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
    >
      Nurin
    </motion.span>
  </div>
);

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio("/song.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="fixed bottom-6 left-6 z-50 rounded-full bg-white/80 p-3 text-blue-900 shadow-lg backdrop-blur transition hover:scale-110"
      aria-label={isPlaying ? "Pause background music" : "Play background music"}
    >
      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
    </button>
  );
};

const SuccessToast = ({ message }: { message: string }) => (
  <motion.div
    className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-5 py-3 text-blue-950 shadow-2xl backdrop-blur-lg"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
  >
    <motion.svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-blue-900"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <path d="M20 6L9 17l-5-5" />
    </motion.svg>
    <span className="text-sm font-medium">{message}</span>
  </motion.div>
);

const SkeletonCard = () => (
  <motion.div
    className="mx-auto w-full max-w-sm rounded-sm border border-white/50 bg-white p-4 shadow-xl"
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <div className="mb-2 h-64 w-full rounded-sm bg-slate-200" />
    <div className="h-4 w-2/3 rounded-sm bg-slate-200" />
  </motion.div>
);

const formSpring = {
  type: "spring",
  stiffness: 200,
  damping: 25
} as const;

export default function HomePage() {
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GuestEntry | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const { data, error } = await supabase
          .from("guest_entries")
          .select("*")
          .order("created_at", { ascending: false });

        console.log("SUPABASE RAW DATA:", data);
        if (error) {
          console.error("SUPABASE ERROR:", error);
          setFeedError(error.message);
          return;
        }

        const normalized = ((data as GuestEntry[]) || []).map((entry) => ({
          ...entry,
          likes: entry.likes ?? 0
        }));
        setEntries(normalized);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel("guest_entries_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "guest_entries" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const nextEntry = payload.new as GuestEntry;
              setEntries((prev) => [{ ...nextEntry, likes: nextEntry.likes ?? 0 }, ...prev]);
              return;
            }

            if (payload.eventType === "UPDATE") {
              const updatedEntry = payload.new as GuestEntry;
              setEntries((prev) =>
                prev.map((entry) =>
                  entry.id === updatedEntry.id
                    ? { ...entry, ...updatedEntry, likes: updatedEntry.likes ?? entry.likes ?? 0 }
                    : entry
                )
              );
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.error("SUPABASE REALTIME ERROR:", err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShowToast(false), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1e3a8a", "#fbbf24"]
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem("liked_entries");
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as string[];
      setLikedIds(parsed);
    } catch (error) {
      console.error("Failed to parse liked entries:", error);
    }
  }, []);

  const handleLike = async (id: string, currentLikes: number) => {
    if (likedIds.includes(id)) {
      return;
    }

    const nextLikes = currentLikes + 1;
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, likes: nextLikes } : entry
      )
    );

    const { error } = await supabase
      .from("guest_entries")
      .update({ likes: nextLikes })
      .eq("id", id);

    if (error) {
      console.error("Failed to update likes:", error);
    }

    setLikedIds((prev) => {
      const next = [...prev, id];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("liked_entries", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleAdminTap = () => {
    setAdminClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        if (typeof window !== "undefined") {
          const pin = window.prompt("Enter Admin PIN:");
          if (pin === "2026") {
            setIsAdmin(true);
            window.alert("Admin Mode Activated");
          }
        }
        return 0;
      }
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Are you sure you want to delete this memory?");
      if (!confirmed) {
        return;
      }
    }

    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    const { error } = await supabase.from("guest_entries").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete entry:", error);
      window.alert("Delete failed. Please try again.");
      return;
    }

    window.alert("Entry deleted");
  };

  const handleDownloadAll = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      let greetingsContent = "--- UCAPAN KENANGAN MEOR & NURIN ---\n\n";
      const items = entries.filter((entry) => Boolean(entry.media_url));

      await Promise.all(
        items.map(async (entry, index) => {
          const fileName = `memory_${index + 1}.jpg`;
          greetingsContent += `[Gambar: ${fileName}]\n`;
          greetingsContent += `Dari: ${entry.guest_name || "Anonymous"}\n`;
          greetingsContent += `Ucapan: ${entry.message || ""}\n`;
          greetingsContent += "-------------------------\n";

          const response = await fetch(entry.media_url as string);
          if (!response.ok) {
            throw new Error(`Failed to fetch media for entry ${entry.id}`);
          }
          const blob = await response.blob();
          zip.file(fileName, blob);
        })
      );

      zip.file("Senarai_Ucapan.txt", greetingsContent);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Kenangan_Meor_Nurin.zip");
    } catch (error) {
      console.error("Failed to download memories:", error);
      window.alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError("Please write a message for the couple.");
      return;
    }

    if (!file) {
      setError("Please upload a photo or video.");
      return;
    }

    setLoading(true);
    try {
      const compressionOptions = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1280,
        useWebWorker: true
      };

      const uploadFile = file.type.startsWith("image/")
        ? await imageCompression(file, compressionOptions)
        : file;
      const fileExt = file.name.split(".").pop() || "bin";
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filePath = `${fileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("wedding_memories")
        .upload(filePath, uploadFile, { upsert: false });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicData } = supabase.storage
        .from("wedding_memories")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("guest_entries").insert({
        guest_name: guestName.trim() || "Anonymous",
        message: message.trim(),
        media_url: publicData.publicUrl,
        media_type: file.type.startsWith("video/") ? "video" : "image",
        tags: []
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      triggerConfetti();
      setShowToast(true);
      setSubmitted(true);
      setGuestName("");
      setMessage("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen bg-gradient-to-b from-[#F0F8FF] via-[#D6E4FF] to-[#AFCBFF] px-4 py-10 md:px-12"
      style={{
        fontFamily:
          "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
      }}
    >
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160' fill='none'><g stroke='%23ffffff' stroke-opacity='0.4' stroke-width='1.2'><path d='M26 34c10 0 18 8 18 18'/><path d='M44 52c0-10 8-18 18-18'/><path d='M62 34c10 0 18 8 18 18'/><path d='M80 52c0-10 8-18 18-18'/><circle cx='44' cy='52' r='6'/><circle cx='80' cy='52' r='6'/></g></svg>\")",
            backgroundRepeat: "repeat",
            backgroundSize: "160px 160px"
          }}
        />
      </div>
      <RainingHearts />

      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-16">
        <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div
            className="relative mb-6 flex w-full justify-center cursor-pointer"
            onClick={handleAdminTap}
          >
            <AnimatedLogo />
          </div>
          {/* MODERN TYPOGRAPHY ALTERNATIVE (Uncomment to use instead of image)
          <div className="mb-8 text-center">
            <h1 className="font-serif text-5xl md:text-7xl text-blue-900 drop-shadow-sm leading-tight">
              Meor <span className="text-4xl md:text-6xl italic text-blue-700/80">&</span> Nurin
            </h1>
            <p className="mt-3 text-sm md:text-base tracking-[0.2em] uppercase text-slate-500 font-medium">
              14 . 02 . 2026
            </p>
          </div>
          */}
          <motion.p
            className="max-w-2xl text-sm text-slate-600 md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Capture a wish, a photo, or a moment. Each memory becomes a cherished Polaroid
            in their forever story.
          </motion.p>

          <motion.button
            type="button"
            layoutId="form"
            onClick={() => {
              setSubmitted(false);
              setIsFormOpen(true);
            }}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#7aa6ff] shadow-[0_10px_30px_rgba(31,42,58,0.25)]"
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={18} />
            Make a Wish
          </motion.button>
        </section>

        <section className="mx-auto w-full max-w-6xl pb-24">
          <div className="mb-8 text-center">
            <h2 className="text-2xl text-slate-800 md:text-3xl">Live Polaroid Feed</h2>
            <p className="mt-2 text-sm text-slate-600">
              Scroll down to reveal the memories arriving in real time.
            </p>
          </div>

          {isAdmin && (
            <div className="mb-8 flex justify-center">
              <button
                type="button"
                onClick={handleDownloadAll}
                className="mx-auto inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-white shadow-xl transition hover:bg-green-700"
                disabled={isDownloading}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M12 3v10.17l3.59-3.58L17 11l-5 5-5-5 1.41-1.41L11 13.17V3h1z" />
                  <path d="M5 19h14v2H5z" />
                </svg>
                {isDownloading ? "Menyiapkan Fail ZIP..." : "Download All Memories"}
              </button>
            </div>
          )}

          {feedError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedError}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-12 p-6 pb-32 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-2xl bg-white/80 p-6 text-center text-sm text-slate-700">
              No memories yet, be the first!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 p-6 pb-32 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry, index) => (
                <div key={entry.id} className="mx-auto w-full max-w-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100, delay: index * 0.1 }}
                    className="relative cursor-pointer rounded-sm border border-white/50 bg-white p-4 shadow-xl"
                    style={{ rotate: index % 2 === 0 ? "2deg" : "-2deg" }}
                    onClick={() => setSelectedImage(entry)}
                  >
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        className="absolute right-2 top-2 z-50 rounded-full bg-red-600 p-2 text-white shadow-lg transition hover:bg-red-700"
                        aria-label="Delete memory"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v8h-2v-8zm4 0h2v8h-2v-8zM7 10h2v8H7v-8z" />
                        </svg>
                      </button>
                    )}
                    <div className="relative mb-2 h-64 w-full overflow-hidden bg-gray-200">
                      {entry.media_url ? (
                        <img
                          src={`${entry.media_url}?width=800&quality=75&resize=contain`}
                          alt="Memory"
                          className="absolute inset-0 h-full w-full object-cover"
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={index < 2 ? "high" : "auto"}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="border-b-[40px] border-white">
                      <div className="flex items-center justify-between gap-3 text-sm text-slate-800">
                        <p>{entry.guest_name || "Anonymous"}</p>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 1.2 }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleLike(entry.id, entry.likes ?? 0);
                          }}
                          className={`inline-flex items-center gap-1 text-xs transition ${
                            likedIds.includes(entry.id) ? "text-red-500" : "text-rose-400"
                          }`}
                          disabled={likedIds.includes(entry.id)}
                          aria-label="Like memory"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill={likedIds.includes(entry.id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span>{entry.likes ?? 0}</span>
                        </motion.button>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{entry.message}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl bg-black/90 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative mx-4 w-full max-w-2xl rounded-sm bg-white p-4 pb-20 shadow-2xl md:p-6"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 rounded-full border border-slate-200 p-3 text-slate-500 transition hover:text-slate-800"
                aria-label="Close preview"
              >
                <X size={22} />
              </button>
              <div className="relative w-full overflow-hidden bg-slate-100 aspect-[4/5]">
                {selectedImage.media_url ? (
                  <img
                    src={selectedImage.media_url}
                    alt="Memory"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-base font-semibold text-slate-800">
                  {selectedImage.guest_name || "Anonymous"}
                </p>
                <p className="mt-2 text-sm text-slate-800">{selectedImage.message}</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isFormOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId="form"
              className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-[0_30px_80px_rgba(31,42,58,0.25)]"
              transition={formSpring}
              style={{
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="absolute right-4 top-4 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:text-slate-800"
                aria-label="Close form"
              >
                <X size={18} />
              </button>

              {submitted ? (
                <div className="rounded-2xl border border-babyBlue-200 bg-babyBlue-50 px-6 py-8 text-center">
                  <h2 className="text-2xl text-slate-800">Thank you</h2>
                  <p className="mt-3 text-sm text-slate-600">
                    Your wish has been delivered with love. Enjoy the celebration.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <label className="grid gap-2 text-sm text-slate-700">
                    Name
                    <input
                      className="rounded-xl border border-babyBlue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-babyBlue-300"
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      placeholder="Your name"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-700">
                    Message
                    <textarea
                      className="min-h-[120px] rounded-2xl border border-babyBlue-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-babyBlue-300"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Write your wish"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-700">
                    Camera Upload
                    <div className="flex items-center gap-3 rounded-xl border border-babyBlue-200 bg-white px-4 py-3">
                      <Camera size={18} className="text-slate-500" />
                      <input
                        type="file"
                        accept="image/*,video/*"
                        capture="environment"
                        className="w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#AFCBFF] file:px-4 file:py-2 file:text-white"
                        onChange={(event) => setFile(event.target.files?.[0] || null)}
                      />
                    </div>
                  </label>

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#AFCBFF] px-6 py-3 text-sm text-white shadow-[0_6px_20px_rgba(175,203,255,0.6)] transition hover:bg-[#9fbef0] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    )}
                    {loading ? "Sending..." : "Share"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showToast && (
          <SuccessToast message="Memori anda telah berjaya disimpan. Terima kasih! ❤️" />
        )}
      </AnimatePresence>
      <MusicPlayer />
    </main>
  );
}
