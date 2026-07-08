export const UTM_COOKIE = "iode_utm";
export const FEE_UNLOCK_COOKIE = "iode_fees_unlocked";

export type UtmParams = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const clamp = (v: string | null | undefined) =>
  v ? v.slice(0, 120) : undefined;

export function utmFromSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): UtmParams {
  const get = (k: string) => {
    if (params instanceof URLSearchParams) return params.get(k);
    const v = params[k];
    return Array.isArray(v) ? v[0] : v ?? null;
  };
  const utm: UtmParams = {
    utmSource: clamp(get("utm_source")),
    utmMedium: clamp(get("utm_medium")),
    utmCampaign: clamp(get("utm_campaign")),
    utmContent: clamp(get("utm_content")),
    utmTerm: clamp(get("utm_term")),
  };
  return utm;
}

export const hasUtm = (u: UtmParams) =>
  Boolean(u.utmSource || u.utmMedium || u.utmCampaign || u.utmContent || u.utmTerm);

export function parseUtmCookie(raw: string | undefined): UtmParams {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as UtmParams;
    return {
      utmSource: clamp(parsed.utmSource),
      utmMedium: clamp(parsed.utmMedium),
      utmCampaign: clamp(parsed.utmCampaign),
      utmContent: clamp(parsed.utmContent),
      utmTerm: clamp(parsed.utmTerm),
    };
  } catch {
    return {};
  }
}
