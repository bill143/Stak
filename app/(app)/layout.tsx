// Minimal authenticated app shell. Agent B will replace this with the full
// app chrome (sidebar, command palette, etc.) per SPEC.md Section 7.

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: proxy.ts already gates this, but a server-side check
  // avoids any flash of protected content if the proxy is ever misconfigured.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/signin");
  }

  return <div className="min-h-svh bg-background">{children}</div>;
}
