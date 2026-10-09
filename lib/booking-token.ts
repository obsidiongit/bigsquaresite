import { createHmac, timingSafeEqual } from "node:crypto";

// The booking token (lead-funnel.md section 5, the UDT pattern): the GHL
// contact id plus an HMAC-SHA256 of it under BOOKING_TOKEN_SECRET. The
// schedule submit hands it to the browser so the pick-a-time step can book
// onto that contact and nobody can book onto someone else's. No personal
// data in it, so it is safe in an email link (/schedule/book/?t=<token>).
// Server only.

const SECRET = process.env.BOOKING_TOKEN_SECRET;

function sign(contactId: string): string {
  return createHmac("sha256", SECRET!).update(contactId).digest("base64url");
}

/** Booking runs only with the flag on and every piece configured. Off in
    production until Levi and Brad connect Google Calendar (handoff
    2026-10-09): without it GHL has no conflicts and makes no Meet links. */
export function bookingEnabled(): boolean {
  return Boolean(
    process.env.BOOKING_ENABLED === "1" &&
      SECRET &&
      process.env.GHL_CALENDAR_ID &&
      process.env.GHL_API_KEY &&
      process.env.GHL_LOCATION_ID,
  );
}

export function bookingToken(contactId: string): string {
  return `${contactId}.${sign(contactId)}`;
}

/** The contact id when the token is genuine, otherwise null. */
export function verifyBookingToken(token: string): string | null {
  if (!SECRET || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const contactId = token.slice(0, dot);
  if (!/^[A-Za-z0-9]{8,64}$/.test(contactId)) return null;
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(contactId));
  return given.length === expected.length && timingSafeEqual(given, expected) ? contactId : null;
}
