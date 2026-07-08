import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand ISR revalidation, called by the admin panel (iode-tracker) after
 * content edits so changes appear immediately instead of waiting for the
 * hourly ISR window. Payload: { paths: string[] } with the shared secret in
 * the x-revalidate-secret header (see the admin's src/lib/revalidate.ts).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 }
    );
  }
  if (request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let paths: unknown;
  try {
    ({ paths } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (
    !Array.isArray(paths) ||
    paths.some((p) => typeof p !== "string" || !p.startsWith("/"))
  ) {
    return NextResponse.json(
      { error: "paths must be an array of absolute paths" },
      { status: 400 }
    );
  }

  const revalidated: string[] = [];
  for (const path of paths.slice(0, 50) as string[]) {
    revalidatePath(path);
    revalidated.push(path);
  }
  return NextResponse.json({ revalidated, now: Date.now() });
}
