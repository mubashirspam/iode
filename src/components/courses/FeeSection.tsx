"use client";

import { useEffect, useState } from "react";
import LeadModal from "@/components/leads/LeadModal";
import { requestFeeAccess } from "@/lib/actions/leads";
import { FEE_UNLOCK_COOKIE } from "@/lib/utm";

export type FeePayload = {
  feeOnRequest: boolean;
  startingFee: number | null;
  startingFeeUnit: string | null;
  totalFee: number | null;
  offerFee: number | null;
  paymentCycle: string | null;
  feeNote: string | null;
  emiAvailable: boolean;
  components: { label: string; amount: number; suffix?: string }[];
  otherFees: {
    label: string;
    amount: number;
    recurrence: string;
    included: boolean;
  }[];
  installments: { label: string; amount: number; note: string | null }[];
};

interface Props {
  fee: FeePayload;
  courseId: string;
  universityId: string;
  courseName: string;
  universityName: string;
  universityFeeNote?: string | null;
}

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

const RECURRENCE_LABEL: Record<string, string> = {
  one_time: "one-time",
  per_year: "per year",
  per_semester: "per semester",
};

export default function FeeSection({
  fee,
  courseId,
  universityId,
  courseName,
  universityName,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (document.cookie.includes(`${FEE_UNLOCK_COOKIE}=1`)) setUnlocked(true);
  }, []);

  const submit = (values: { name: string; phone: string; email?: string }) =>
    requestFeeAccess({
      ...values,
      courseId,
      universityId,
      courseName: `${courseName} — ${universityName}`,
    });

  // ---- Fee shared only via counsellor ----
  if (fee.feeOnRequest) {
    return (
      <section id="fees" className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
        <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">Fee Structure</h2>
        <div className="bg-[#FEF3E2] border border-[#F5DCB8] rounded-xl px-4 py-3 text-sm text-[#b45309] font-medium mb-5">
          This university shares its fee structure personally — request it and
          our counsellor will send you the latest official fees.
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#007AFF] text-white font-semibold hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 btn-press"
        >
          Request Fee Structure — Free
        </button>
        <LeadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Get the full fee structure"
          subtitle={`${courseName} · ${universityName}`}
          submitLabel="Send Me the Fees"
          successTitle="Request received!"
          successMessage="Our counsellor will WhatsApp you the complete fee structure shortly."
          withEmail
          onSubmit={submit}
        />
      </section>
    );
  }

  // ---- Locked teaser ----
  if (!unlocked) {
    return (
      <section id="fees" className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
        <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">Fee Structure</h2>
        {fee.startingFee != null && (
          <div className="mb-5">
            <div className="text-sm text-[#6E6E73]">You start with just</div>
            <div className="text-3xl font-bold text-[#0450c9]">
              {inr(fee.startingFee)}
              <span className="text-sm font-semibold text-[#6E6E73] ml-2">
                {fee.startingFeeUnit}
              </span>
            </div>
          </div>
        )}
        <div className="relative rounded-xl border border-[#E5E5EA] overflow-hidden mb-5">
          <div className="blur-[6px] select-none pointer-events-none" aria-hidden>
            {(fee.installments.length
              ? fee.installments.slice(0, 3)
              : [
                  { label: "Year 1", amount: 0, note: null },
                  { label: "Year 2", amount: 0, note: null },
                  { label: "Year 3", amount: 0, note: null },
                ]
            ).map((r, i) => (
              <div
                key={i}
                className="flex justify-between px-5 py-3.5 border-b border-[#F5F5F7] text-sm"
              >
                <span className="font-medium text-[#1D1D1F]">{r.label}</span>
                <span className="font-bold text-[#0450c9]">₹••,•••</span>
              </div>
            ))}
            <div className="flex justify-between px-5 py-3.5 bg-[#F5F9FF] text-sm">
              <span className="font-bold text-[#1D1D1F]">Total Fee</span>
              <span className="font-bold text-[#0450c9]">₹•,••,•••</span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white/80 via-white/40 to-transparent">
            <button
              onClick={() => setModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-all shadow-lg shadow-[#007AFF]/30 btn-press flex items-center gap-2"
            >
              🔓 See Full Fee Structure — Free
            </button>
          </div>
        </div>
        <p className="text-xs text-[#AEAEB2] text-center">
          Instant access · year-wise &amp; semester-wise breakdown · no hidden
          charges
        </p>
        <LeadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Unlock the complete fee structure"
          subtitle={`${courseName} · ${universityName} — see it instantly after this step`}
          submitLabel="Show Me the Full Fees"
          successTitle="Unlocked!"
          successMessage="The complete fee structure is now visible below."
          withEmail
          onSubmit={submit}
          onSuccess={() => setUnlocked(true)}
        />
      </section>
    );
  }

  // ---- Full fee table ----
  const showOffer =
    fee.offerFee != null && fee.totalFee != null && fee.offerFee < fee.totalFee;
  return (
    <section id="fees" className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-xl font-bold text-[#1D1D1F]">
          Complete Fee Structure
        </h2>
        {fee.emiAvailable && (
          <span className="px-3 py-1 bg-[#E8F9EF] text-[#0d9455] text-xs font-bold rounded-full">
            EMI Available
          </span>
        )}
      </div>

      {fee.installments.length > 0 && (
        <div className="rounded-xl border border-[#E5E5EA] overflow-hidden mb-5">
          {fee.installments.map((r, i) => (
            <div
              key={i}
              className={`flex justify-between items-center px-5 py-3.5 text-sm ${
                i % 2 ? "bg-[#FAFBFF]" : "bg-white"
              } border-b border-[#F5F5F7]`}
            >
              <div>
                <span className="font-medium text-[#1D1D1F]">{r.label}</span>
                {r.note && (
                  <span className="block text-xs text-[#6E6E73] mt-0.5">
                    {r.note}
                  </span>
                )}
              </div>
              <span className="font-bold text-[#0450c9] whitespace-nowrap">
                {inr(r.amount)}
              </span>
            </div>
          ))}
          {fee.totalFee != null && (
            <div className="flex justify-between items-center px-5 py-4 bg-[#E8F2FF]">
              <span className="font-bold text-[#1D1D1F]">Total Program Fee</span>
              <span className="text-right">
                {showOffer ? (
                  <>
                    <span className="line-through text-[#AEAEB2] text-sm mr-2">
                      {inr(fee.totalFee)}
                    </span>
                    <span className="font-bold text-[#0d9455] text-lg">
                      {inr(fee.offerFee!)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-[#0450c9] text-lg">
                    {inr(fee.totalFee)}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {fee.installments.length === 0 && fee.totalFee != null && (
        <div className="rounded-xl border border-[#E5E5EA] overflow-hidden mb-5">
          <div className="flex justify-between items-center px-5 py-4 bg-[#E8F2FF]">
            <span className="font-bold text-[#1D1D1F]">
              Total Program Fee (one-time)
            </span>
            <span className="font-bold text-[#0450c9] text-lg">
              {inr(fee.totalFee)}
            </span>
          </div>
        </div>
      )}

      {(fee.components.length > 0 || fee.otherFees.length > 0) && (
        <div className="mb-5">
          <h3 className="text-sm font-bold text-[#1D1D1F] mb-2">
            Included Charges &amp; Components
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fee.components.map((cmp, i) => (
              <div
                key={`c${i}`}
                className="flex justify-between px-4 py-2.5 bg-[#F5F9FF] border border-[#E3EDFF] rounded-xl text-sm"
              >
                <span className="text-[#6E6E73]">
                  {cmp.label}
                  {cmp.suffix && (
                    <span className="text-xs text-[#AEAEB2]"> {cmp.suffix}</span>
                  )}
                </span>
                <span className="font-semibold text-[#1D1D1F]">
                  {inr(cmp.amount)}
                </span>
              </div>
            ))}
            {fee.otherFees.map((o, i) => (
              <div
                key={`o${i}`}
                className="flex justify-between px-4 py-2.5 bg-[#F5F9FF] border border-[#E3EDFF] rounded-xl text-sm"
              >
                <span className="text-[#6E6E73]">
                  {o.label}
                  <span className="text-xs text-[#AEAEB2]">
                    {" "}
                    {RECURRENCE_LABEL[o.recurrence] ?? ""}
                    {o.included ? "" : " · extra"}
                  </span>
                </span>
                <span className="font-semibold text-[#1D1D1F]">
                  {inr(o.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {fee.feeNote && (
        <p className="text-xs text-[#6E6E73] bg-[#F5F5F7] rounded-xl px-4 py-3 leading-relaxed">
          <span className="font-semibold">Note:</span> {fee.feeNote}
        </p>
      )}
    </section>
  );
}
