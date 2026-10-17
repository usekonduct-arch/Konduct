import { useEffect, useState } from "react";

/**
 * Bachs sends riders back here after the hosted checkout (TOPUP_RETURN_URL on the backend), with
 * ?topup=<id>&outcome=success|cancel. Show what happened and a way back into the app. The wallet is
 * credited from Bachs's signed webhook, not from this page.
 */
const APP_LINK = "intent://wallet#Intent;scheme=konduct;package=com.konduct.rider;end";

export default function TopUpReturn() {
  // Read after the first render: the page is pre-rendered without the query string.
  const [outcome, setOutcome] = useState<"success" | "cancel" | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("topup")) setOutcome(q.get("outcome") === "success" ? "success" : "cancel");
  }, []);
  if (!outcome) return null;

  const close = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    setOutcome(null);
  };
  const ok = outcome === "success";

  return (
    <div className="topup-return" role="dialog" aria-modal="true" aria-labelledby="topup-return-title">
      <div className="topup-card">
        <span className={`topup-icon ${ok ? "is-ok" : ""}`} aria-hidden="true">
          {ok ? "✓" : "!"}
        </span>
        <h2 id="topup-return-title">{ok ? "Payment received" : "Payment not finished"}</h2>
        <p>
          {ok
            ? "Your wallet updates in the Konduct app within a minute, as soon as the bank confirms."
            : "Nothing was charged. Go back to the app and try again when you're ready."}
        </p>
        <a className="btn btn-yellow" href={APP_LINK}>
          Back to the Konduct app
        </a>
        <button className="topup-close" type="button" onClick={close}>
          Stay on the website
        </button>
      </div>
    </div>
  );
}
