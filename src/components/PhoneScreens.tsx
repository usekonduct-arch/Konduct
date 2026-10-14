/*
 * The three rider-app screens used in "How it works". Each animates with CSS on mount,
 * so the parent remounts a screen (new key) whenever it should replay.
 */

function Status() {
  return (
    <div className="ph-status">
      <span>12:04</span>
      <span className="ph-notch" />
      <span>● ● ▮</span>
    </div>
  );
}

export function FundScreen() {
  return (
    <div className="ph-screen fund">
      <Status />
      <p className="ph-hi">Good morning, Ada</p>
      <div className="ph-wallet">
        <small>Transport wallet</small>
        <div className="ph-bal">
          <span className="roll">
            <span>₦450</span>
            <span>₦2,450</span>
          </span>
        </div>
        <div className="ph-wallet-foot">
          <span>≈ 12 rides</span>
          <span className="ph-pill">+ Add money</span>
        </div>
      </div>
      <div className="ph-acct">
        <small>Your Konduct account number</small>
        <b className="mono">9012 345 678</b>
        <span>Partner Bank · Ada Okafor</span>
      </div>
      <div className="ph-toast ok">
        <span className="ph-dot" />
        <div>
          <b>+₦2,000 added</b>
          <small>Bank transfer · just now</small>
        </div>
      </div>
    </div>
  );
}

export function ScanScreen() {
  return (
    <div className="ph-screen scan">
      <Status />
      <div className="viewfinder">
        <div className="vf-bus">
          <div className="vf-sticker">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <rect width="44" height="44" rx="6" fill="#fff" />
              <path d="M6 6h10v10H6zM28 6h10v10H28zM6 28h10v10H6zM20 6h4v4h-4zM20 14h4v8h-4zM28 22h4v4h-4zM34 20h4v8h-4zM20 28h6v4h-6zM28 32h10v6H28zM20 36h4v2h-4z" fill="#0e1115" />
            </svg>
            <span>OS·452</span>
          </div>
        </div>
        <i className="vf-c tl" />
        <i className="vf-c tr" />
        <i className="vf-c bl" />
        <i className="vf-c br" />
        <i className="laser" />
        <p className="vf-hint">Point at the code by the door</p>
      </div>
      <div className="sheet">
        <div className="sheet-driver">
          <span className="avatar">TA</span>
          <div>
            <b>Tunde A.</b>
            <small>Plate OS 452 KJA · Verified</small>
          </div>
        </div>
        <div className="sheet-route">
          <span>Main Gate → Faculty</span>
          <b>₦200</b>
        </div>
        <span className="ph-btn">Pay ₦200</span>
      </div>
    </div>
  );
}

export function PaidScreen() {
  return (
    <div className="ph-screen paid">
      <Status />
      <div className="drv-toast">
        <span className="ph-dot" />
        <div>
          <small>On Tunde's phone</small>
          <b>“₦200 received” 🔊</b>
        </div>
      </div>
      <svg className="tick" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" />
        <path d="M38 62l15 15l30-33" />
      </svg>
      <p className="paid-amt">₦200 paid</p>
      <p className="paid-route">Main Gate → Faculty · OS 452 KJA</p>
      <div className="paid-ref">
        <small>Reference</small>
        <b className="mono">KD-7F3Q2</b>
        <small>Same on the driver's screen</small>
      </div>
      <div className="paid-meta">
        <span>✓ Receipt saved</span>
        <span>✓ Driver alerted 12:04</span>
      </div>
      <div className="paid-actions">
        <span>+ Pay for others</span>
        <span>Report a problem</span>
      </div>
    </div>
  );
}

export const SCREENS = [FundScreen, ScanScreen, PaidScreen];

export function Phone({ screen, replay = 0 }: { screen: number; replay?: number }) {
  const S = SCREENS[screen];
  return (
    <div className="phone">
      <S key={`${screen}-${replay}`} />
    </div>
  );
}
