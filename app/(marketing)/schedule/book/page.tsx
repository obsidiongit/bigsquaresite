import type { Metadata } from "next";
import { SeparatorIn } from "@/components/motion/SeparatorIn";
import { BookingPanel } from "@/components/sections/schedule/BookingPanel";
import { Eyebrow } from "@/components/shared/mono";
import { Pill } from "@/components/shared/Pill";
import { Section } from "@/components/shared/Section";
import { bookingEnabled, verifyBookingToken } from "@/lib/booking-token";
import { EDGE } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Pick a Time",
  description: "Pick or change the time of your call with BigSquare.",
  robots: { index: false, follow: false },
};

/* /schedule/book/?t=<token> (lead-funnel.md section 5): the pick-a-time
   step on its own page, the link in every booking email
   ({{contact.booking_link}}, saved on the contact at submit). Personal
   to one contact through the signed token, so never indexed. A bad or
   old link, or booking switched off, sends people to /schedule/. */

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { t } = await searchParams;
  const token = typeof t === "string" ? t : "";
  const valid = bookingEnabled() && verifyBookingToken(token) !== null;

  return (
    <main>
      <Section
        theme="light"
        size="none"
        className="pt-32 pb-section-y md:pt-36"
      >
        <div className={`${EDGE} relative z-10`}>
          <SeparatorIn />
          <Eyebrow className="mt-4">Your Call</Eyebrow>
          <div className="mt-6 flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <h1 className="max-w-[12ch] font-display text-h1 text-sec-ink">
                Pick a time.
              </h1>
              <p className="mt-6 max-w-[40ch] text-body text-sec-mid">
                30 minutes. We look at your accounts together and tell you
                exactly what we would do first.
              </p>
            </div>
            <div className="w-full max-w-[560px] rounded-[24px] border border-sec-line bg-surf p-6 sm:p-8 lg:col-span-6 lg:max-w-none">
              {valid ? (
                <BookingPanel token={token} />
              ) : (
                <div className="flex flex-col items-start gap-4">
                  <p className="text-h3 font-bold text-sec-ink">
                    This link does not work anymore.
                  </p>
                  <p className="text-body text-sec-mid">
                    Book from the schedule page, or email
                    support@bigsquaremarketing.com and we will set a time with
                    you.
                  </p>
                  <Pill href="/schedule/">Schedule a Call</Pill>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
