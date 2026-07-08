export const inr = (n: number | string | null | undefined): string => {
  if (n == null || n === "") return "";
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (!Number.isFinite(num)) return "";
  return "₹" + Math.round(num).toLocaleString("en-IN");
};

/** "from ₹8,000 per semester" | "Fee on request" */
export function startingFeeLabel(fee: {
  feeOnRequest?: boolean | null;
  startingFee?: string | null;
  startingFeeUnit?: string | null;
}): { amount: string; unit: string } | null {
  if (!fee || fee.feeOnRequest || !fee.startingFee) return null;
  return {
    amount: inr(fee.startingFee),
    unit: fee.startingFeeUnit ?? "",
  };
}
