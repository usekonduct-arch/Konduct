import { useState, type FormEvent } from "react";
import Bus from "./art/Bus";

const ROLES = [
  ["student", "Student"],
  ["driver", "Driver or bike rider"],
  ["park", "Owner or park leader"],
] as const;

// Where pilot sign-ups are POSTed. Unset means nothing is stored yet (see README).
const ENDPOINT = import.meta.env.VITE_WAITLIST_URL as string | undefined;

type State = "idle" | "sending" | "done" | "error";

export default function Join() {
  const [role, setRole] = useState<string>("student");
  const [state, setState] = useState<State>("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = { role, name: data.get("name"), contact: data.get("contact"), source: "landing" };
    setState("sending");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        console.warn("VITE_WAITLIST_URL is not set; sign-up not stored", payload);
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="join" id="join">
      <div className="wrap join-grid">
        <div>
          <h2>Be on the first bus.</h2>
          <p className="lead">Tell us who you are and where to reach you. We'll get in touch before the UNIOSUN pilot starts.</p>
        </div>
        {state === "done" ? (
          <div className="join-done" role="status">
            <b>You're on the list.</b>
            <p>We'll reach out before the first Konduct bus leaves the park.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <fieldset className="seg">
              <legend>I am a</legend>
              {ROLES.map(([v, label]) => (
                <label key={v}>
                  <input type="radio" name="role" value={v} checked={role === v} onChange={() => setRole(v)} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <input type="text" name="name" placeholder="Your name" autoComplete="name" required aria-label="Your name" />
            <input type="text" name="contact" placeholder="Phone number or email" autoComplete="tel" required aria-label="Phone number or email" />
            <button className="btn btn-dark" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Adding you…" : "Join the pilot list"}
            </button>
            {state === "error" && <p className="join-err">That didn't go through. Check your connection and try again.</p>}
          </form>
        )}
      </div>
      <svg className="join-bus" viewBox="-20 -10 600 260" aria-hidden="true">
        <Bus id="join-bus" seats={false} route="NEXT STOP: YOU" />
      </svg>
    </section>
  );
}
