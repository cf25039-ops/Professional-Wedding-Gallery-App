import { supabaseAdmin } from "@/lib/supabaseAdmin";

const parseAllowlist = () => {
  const raw = process.env.ADMIN_EMAIL_ALLOWLIST || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const requireAdmin = async (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return { ok: false, error: "Missing auth token.", status: 401 } as const;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, error: "Unauthorized.", status: 401 } as const;
  }

  const allowlist = parseAllowlist();
  if (allowlist.length > 0) {
    const email = data.user.email?.toLowerCase() || "";
    if (!allowlist.includes(email)) {
      return { ok: false, error: "Forbidden.", status: 403 } as const;
    }
  }

  return { ok: true, user: data.user } as const;
};
