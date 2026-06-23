import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

// On-demand ISR revalidation webhook.
//
// The admin panel (iode-tracker) is a SEPARATE deployment that shares this
// site's database. When an editor changes a course or university there, this
// site's pages stay cached until their hourly ISR window (`revalidate = 3600`)
// elapses — so edits appear late and inconsistently (e.g. a course page updates
// before its university page). The admin calls this endpoint right after a save
// to mark the affected paths stale so the next visit renders fresh data.
//
// Auth is a shared secret (`REVALIDATE_SECRET`) set in both apps.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { revalidated: false, message: "Revalidation is not configured" },
      { status: 500 }
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret");
  if (provided !== secret) {
    return Response.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { revalidated: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const paths = (body as { paths?: unknown })?.paths;
  if (!Array.isArray(paths) || paths.some((p) => typeof p !== "string")) {
    return Response.json(
      { revalidated: false, message: "`paths` must be an array of strings" },
      { status: 400 }
    );
  }

  // Dedupe and drop empties. These are literal, already-resolved paths
  // (e.g. /universities/amrita-university), so no `type` argument is needed.
  const unique = [...new Set((paths as string[]).map((p) => p.trim()).filter(Boolean))];
  for (const path of unique) {
    revalidatePath(path);
  }

  return Response.json({ revalidated: unique, now: Date.now() });
}
