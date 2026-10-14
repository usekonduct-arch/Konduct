/**
 * Pilot sign-ups go straight into Firestore (`waitlist` collection) over its REST API: no SDK, no
 * server to wake up. Firestore rules (konduct-backend/firestore.rules) allow only creating a
 * well-formed entry; nobody can read, change or delete entries from the browser.
 *
 * The API key is Firebase's public client identifier (it's in the apps too), not a secret.
 */
const PROJECT = (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined) || "konduct-10ffb";
const API_KEY = (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined) || "AIzaSyAg4HZS4Q5-cB4LC4nimKzzilf9m5Iv0u4";

export type SignUp = { role: "student" | "driver" | "park"; name: string; contact: string };

export async function joinWaitlist(entry: SignUp): Promise<void> {
  const db = `projects/${PROJECT}/databases/(default)`;
  const str = (v: string) => ({ stringValue: v });
  const res = await fetch(`https://firestore.googleapis.com/v1/${db}/documents:commit?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `${db}/documents/waitlist/${crypto.randomUUID()}`,
            fields: { role: str(entry.role), name: str(entry.name), contact: str(entry.contact), source: str("landing") },
          },
          updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }],
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`waitlist ${res.status}`);
}
