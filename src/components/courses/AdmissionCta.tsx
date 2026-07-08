"use client";

import { useState } from "react";
import LeadModal from "@/components/leads/LeadModal";
import { requestAdmission } from "@/lib/actions/leads";

interface Props {
  courseId: string;
  universityId: string;
  courseName: string;
  universityName: string;
  variant: "band" | "sticky";
}

export default function AdmissionCta({
  courseId,
  universityId,
  courseName,
  universityName,
  variant,
}: Props) {
  const [open, setOpen] = useState(false);

  const modal = (
    <LeadModal
      open={open}
      onClose={() => setOpen(false)}
      title="Start your admission"
      subtitle={`${courseName} · ${universityName} — our counsellor will guide you through every step, free of cost.`}
      submitLabel="Request Admission Help"
      successTitle="You're on the list!"
      successMessage="Our admission counsellor will call you shortly to guide you through the process."
      withEmail
      onSubmit={(values) =>
        requestAdmission({
          ...values,
          courseId,
          universityId,
          courseName: `${courseName} — ${universityName}`,
        })
      }
    />
  );

  if (variant === "sticky") {
    return (
      <>
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-[#E5E5EA] px-4 py-3 flex gap-3">
          <a
            href="#fees"
            className="flex-1 text-center px-4 py-3 rounded-full border-2 border-[#007AFF] text-[#007AFF] font-semibold text-sm btn-press"
          >
            See Fees
          </a>
          <button
            onClick={() => setOpen(true)}
            className="flex-1 px-4 py-3 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-colors btn-press"
          >
            Apply Now
          </button>
        </div>
        {modal}
      </>
    );
  }

  return (
    <>
      <section className="rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0055CC] text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">
              Ready to join {universityName}?
            </h3>
            <p className="text-blue-100 text-sm">
              Free counselling · document help · direct university admission —
              zero extra charges.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 px-7 py-3.5 rounded-full bg-white text-[#0055CC] font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg btn-press"
          >
            Request Admission →
          </button>
        </div>
      </section>
      {modal}
    </>
  );
}
