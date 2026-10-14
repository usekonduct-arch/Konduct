const QA = [
  {
    q: "What is Konduct, in one line?",
    a: "A cashless way to pay for campus shuttles and bikes. You keep a wallet in the app, scan the code on the vehicle, and the fare reaches the driver in seconds.",
  },
  {
    q: "Do I still need cash?",
    a: "No, but you can still use it. Cash stays accepted on every vehicle during the pilot. Konduct is there for the days you don't have change.",
  },
  {
    q: "How do I add money?",
    a: "Every rider gets their own account number. Transfer to it from any bank app, or pay by card inside the app. It lands in your wallet automatically.",
  },
  {
    q: "What if I scan the wrong bus or get charged twice?",
    a: "You always see the driver, plate, route and fare before you pay, and a second scan of the same bus asks before charging. If something still goes wrong, report it from the receipt and we'll sort it out.",
  },
  {
    q: "Is my money safe?",
    a: "Wallet money is held by a licensed payment partner, not by Konduct. Bigger payments need your PIN or fingerprint, and you can lock your wallet at any time.",
  },
  {
    q: "What if the driver has no network?",
    a: "Your payment still goes through on your side. Your app shows a short code, the driver types it in, and their app catches up once it's back online.",
  },
  {
    q: "Can I get unused money back?",
    a: "Yes. We'll publish a clear refund policy for unused balances before the pilot opens to riders.",
  },
  {
    q: "I drive a shuttle or a bike. How do I join?",
    a: "A Konduct agent signs you up at the park after checking your ID, vehicle and payout details. Add yourself to the pilot list below and we'll come and find you.",
  },
];

export default function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <div className="sec-head" data-reveal>
          <p className="kicker">Questions</p>
          <h2>Before you ask.</h2>
        </div>
        <div className="faq-list">
          {QA.map((x, i) => (
            <details key={x.q} open={i === 0} data-reveal>
              <summary>
                {x.q}
                <i aria-hidden="true" />
              </summary>
              <p>{x.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
