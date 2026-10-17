/**
 * Konduct's Terms of Service, Privacy Policy and Account Deletion Policy. The website renders these
 * at /terms, /privacy and /delete-account, and both apps link there from sign-up.
 *
 * When you change a document in a way people must agree to again, bump LEGAL_VERSION here AND in
 * both apps (lib/app/app_info.dart, AppConfig.legalVersion): the backend records the version each
 * person accepted when they sign up.
 *
 * Fill in COMPANY before launch: the registered name and RC number from CAC, and a postal address.
 */
export const LEGAL_VERSION = "2026-10-17";
export const LEGAL_UPDATED = "17 October 2026";

export const COMPANY = {
  brand: "Konduct",
  /** As registered with the Corporate Affairs Commission. */
  legalName: "Konduct",
  rc: "",
  address: "Osogbo, Osun State, Nigeria",
  support: "support@konduct.com.ng",
  privacy: "privacy@konduct.com.ng",
  site: "konduct.com.ng",
};

export type Block = string | { list: string[] } | { table: { head: string[]; rows: string[][] } } | { note: string };
export type Section = { id: string; heading: string; blocks: Block[] };
export type LegalDoc = {
  slug: "terms" | "privacy" | "delete-account";
  title: string;
  /** Shown in search results and link previews. */
  description: string;
  summary: string[];
  sections: Section[];
};

const who = COMPANY.legalName + (COMPANY.rc ? ` (RC ${COMPANY.rc})` : "");

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  description: "The agreement between you and Konduct when you use the Konduct student or driver app to pay or receive campus transport fares.",
  summary: [
    "Konduct lets students pay campus bus and bike fares from a wallet by scanning the sticker on the vehicle, and lets drivers receive those fares.",
    "Your wallet money is held by our licensed payment partner, not by Konduct, and is never a deposit that earns interest.",
    "Check the plate and the fare before you pay. A fare paid to the wrong vehicle can be disputed in the app for 30 days.",
    "Keep your PIN and phone safe. Tell us at once if your phone is lost so we can lock your wallet.",
    "You can close your account at any time. See the Account Deletion Policy.",
  ],
  sections: [
    {
      id: "about",
      heading: "1. About these terms",
      blocks: [
        `These Terms of Service ("Terms") are an agreement between you and ${who} ("Konduct", "we", "us"). They cover the Konduct app for students and riders, the Konduct Driver app, the website at ${COMPANY.site} and every service we offer through them (together, the "Service").`,
        "By creating an account you confirm that you have read these Terms, our Privacy Policy and our Account Deletion Policy, and that you agree to them. If you do not agree, do not create an account or use the Service.",
        "We may update these Terms. If a change affects your rights, we will tell you in the app or by email before it takes effect, and where the law requires it we will ask you to agree again. The date at the top shows when they last changed.",
      ],
    },
    {
      id: "eligibility",
      heading: "2. Who can use Konduct",
      blocks: [
        {
          list: [
            "Riders must be students or staff of a campus where Konduct operates (the pilot campus is Osun State University) and must give their real name and their own student ID.",
            "Drivers must be onboarded in person by a Konduct agent, who checks their identity, their vehicle papers and their union membership before the account is created.",
            "You must be at least 16 years old. If you are under 18, you confirm that a parent or guardian knows you are using a payment service.",
            "One person, one account. You may not create an account for someone else, share your account, or use someone else's student ID.",
          ],
        },
      ],
    },
    {
      id: "account",
      heading: "3. Your account and security",
      blocks: [
        "You sign in with an email address and a password, and you set a transaction PIN. You are responsible for keeping your password, PIN and phone secure. Konduct staff will never ask for your password or PIN.",
        "Payments at or above a set amount (currently ₦500) need your PIN or your phone's fingerprint or face unlock. Smaller fares may be paid with a scan and a tap on a trusted device.",
        "If your phone is lost or stolen, or you think someone else knows your PIN, lock your account in the app or contact support straight away. We are not responsible for payments made with your correct credentials before you told us, except where the law says otherwise.",
        "We may pause or close an account to protect you, other users or the Service: for example after repeated wrong PINs, unusual payment patterns, a duplicate student ID, a report of fraud, or a breach of these Terms. We will tell you why unless the law or a fraud investigation prevents it.",
      ],
    },
    {
      id: "wallet",
      heading: "4. Your wallet",
      blocks: [
        "Your Konduct wallet shows money you have added for fares. The money is collected and held by our licensed payment partner in Nigeria on your behalf. Konduct does not hold it in its own bank account, does not lend it, and pays no interest on it.",
        "You can add money by bank transfer to the account number shown in your app, or by card or bank checkout. Your wallet is credited when our payment partner confirms the money has arrived, which is usually within a minute but can take longer if a bank is slow.",
        {
          list: [
            "Wallet limits apply and depend on your verification level. At the basic level the maximum balance is ₦50,000, you can add up to ₦20,000 a day and spend up to ₦10,000 a day. Your app shows your current limits.",
            "You can withdraw your balance to a Nigerian bank account in your own name. The first withdrawal to a newly added account waits 24 hours as a security check. Withdrawals have a minimum of ₦500.",
            "We do not charge riders a fee to add money, pay a fare or withdraw during the pilot. If that changes we will tell you in advance and show any fee before you confirm.",
          ],
        },
        "If money is credited to your wallet by mistake (for example a duplicate bank notification or a refund paid twice), we may reverse it. We will show the correction in your activity.",
      ],
    },
    {
      id: "paying",
      heading: "5. Paying a fare",
      blocks: [
        "To pay, scan the Konduct sticker on the vehicle in the app, or type the 6-character code printed on it. The app shows the driver, the plate, the fare and the total before you pay. Check that the plate matches the vehicle you are boarding.",
        "You can pay for friends travelling with you on the same scan (up to 6 people in total). Each scan is one payment from your wallet.",
        "When you confirm, the fare moves from your wallet to the driver's Konduct account straight away and both of you get a receipt. Every receipt carries a code anyone can check at our website.",
        "Fares are set by Konduct with the transport union and the campus for each route. The fare shown in the app at the moment you confirm is the fare you pay.",
        "If you have no network, the app can give you an offline code to show the driver, which the driver enters to confirm your fare. It expires after 2 hours.",
        "Paying through Konduct is the payment for your ride only. The transport itself is provided by the independent driver, not by Konduct (see section 8).",
      ],
    },
    {
      id: "disputes",
      heading: "6. Mistakes, refunds and disputes",
      blocks: [
        "If you paid the wrong vehicle, were charged twice, or did not get the ride you paid for, open a dispute from the receipt in your app within 30 days. After that, contact support. We aim to resolve disputes within 72 hours.",
        "We look at the payment records, the vehicle's trip and what the driver says. If we find in your favour, we refund the fare to your wallet. Refunds above ₦5,000 need a second staff approval.",
        "Card or bank checkout payments that fail or are cancelled are not charged. If your bank shows a debit but your wallet was not credited, contact support with the reference and we will trace it with our payment partner.",
        "You agree not to raise a chargeback with your bank for a payment you authorised without first giving us a chance to resolve it.",
      ],
    },
    {
      id: "drivers",
      heading: "7. Extra terms for drivers",
      blocks: [
        {
          list: [
            "Your Konduct account receives the fares riders pay to your vehicle. You can see every payment as it arrives.",
            "Earnings are paid out to a Nigerian bank account in your own name, either automatically each day or when you request a payout. The first payout to a new bank account waits 24 hours. Konduct currently covers the payout transfer fee.",
            "Keep the Konduct sticker on your vehicle clean and visible by the door. Do not move it to another vehicle or copy it. If it is damaged or lost, ask an agent for a new one. Printing a new sticker cancels the old one.",
            "Do not ask riders to pay you in cash after they have paid in the app, and do not refuse a rider who has paid. Riders can rate trips, and repeated complaints can lead to your account being suspended.",
            "You remain responsible for your licence, vehicle papers, insurance, union dues, roadworthiness and the safety of your passengers.",
            "We may hold back a payout while a dispute about a fare you received is open, or reverse a fare we refund to a rider after investigation.",
          ],
        },
      ],
    },
    {
      id: "role",
      heading: "8. What Konduct does and does not do",
      blocks: [
        "Konduct provides the payment app, the wallet records, the seat and bus information and support. Drivers are independent operators, not Konduct employees or agents. Konduct does not drive, own or maintain the vehicles.",
        "Bus locations, seat counts and arrival estimates are estimates from what drivers and staff report. Do not rely on them for anything time-critical.",
        "Konduct is not a bank. Wallet services are provided with our licensed payment partner and are subject to the rules of the Central Bank of Nigeria.",
      ],
    },
    {
      id: "rules",
      heading: "9. Things you must not do",
      blocks: [
        {
          list: [
            "Use the Service for anything unlawful, including fraud or money laundering, or to move money that is not for transport.",
            "Copy, alter or fake a sticker, receipt or QR code, or try to pay with someone else's account.",
            "Interfere with the apps, the website or our servers, reverse-engineer them, or use automated tools to access them.",
            "Harass, threaten or abuse drivers, riders or Konduct staff, including in support chats and ratings.",
            "Give false information when you sign up or open a dispute.",
          ],
        },
        "We may suspend or close your account if you break these rules and, where the law requires, report it to the authorities.",
      ],
    },
    {
      id: "ip",
      heading: "10. Our content and your licence to use the apps",
      blocks: [
        "The apps, the website, the Konduct name and logo, the illustrations and the stickers belong to Konduct. We give you a personal, non-transferable licence to use the apps on your own devices for as long as you have an account.",
        "If you send us feedback or ideas, we may use them without owing you anything.",
      ],
    },
    {
      id: "availability",
      heading: "11. Availability and changes to the Service",
      blocks: [
        "We work to keep Konduct running at all hours, but it may be unavailable at times, for example during maintenance, network outages or when our payment partner or a bank is down. When payments are paused the app tells you, and you can pay the driver another way.",
        "We may change, add or remove features. If we stop the Service on a campus, we will give you at least 30 days' notice and let you withdraw your balance.",
      ],
    },
    {
      id: "liability",
      heading: "12. Our responsibility to you",
      blocks: [
        "Nothing in these Terms limits any right you have under Nigerian consumer protection law, including the Federal Competition and Consumer Protection Act 2018, or any liability that cannot be limited by law.",
        "Subject to that, Konduct is not responsible for: the conduct of drivers or other riders; accidents, delays or loss of property during a ride; losses caused by a bank, network or payment partner outage outside our control; or losses caused by your sharing your password or PIN.",
        "Where we are responsible for a loss, our total liability to you for any claim is limited to the amount of the payment in question, or ₦50,000, whichever is higher, except for money in your wallet, which we will always help you recover in full.",
      ],
    },
    {
      id: "closing",
      heading: "13. Closing your account",
      blocks: [
        "You can ask us to close and delete your account at any time. We will help you withdraw your balance first. Our Account Deletion Policy explains what we delete and what the law requires us to keep.",
      ],
    },
    {
      id: "law",
      heading: "14. Law and complaints",
      blocks: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria.",
        `If you have a complaint, contact support in the app or email ${COMPANY.support}. We will reply within 72 hours. If we cannot resolve it, you may contact the Federal Competition and Consumer Protection Commission or, for payment matters, the Consumer Protection Department of the Central Bank of Nigeria.`,
        "Any dispute we cannot settle together will be decided by the courts of Osun State, Nigeria, unless the law gives you the right to go to another court.",
      ],
    },
    {
      id: "contact",
      heading: "15. Contact",
      blocks: [`${who}, ${COMPANY.address}. Email ${COMPANY.support}.`],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  description: "What personal data Konduct collects when you ride or drive, why, who we share it with, how long we keep it and your rights under the Nigeria Data Protection Act 2023.",
  summary: [
    "We collect what we need to run a payment service: your name, email, student ID, your payments and, if you withdraw, your bank account.",
    "We never sell your data and we do not use it for third-party advertising.",
    "We do not track your location. The camera is only used to scan the sticker, and nothing it sees leaves your phone.",
    "We keep payment records for as long as Nigerian law requires, even after you delete your account.",
    `You can see, correct, download or delete your data. Email ${COMPANY.privacy}.`,
  ],
  sections: [
    {
      id: "who",
      heading: "1. Who we are",
      blocks: [
        `${who} ("Konduct", "we") is the data controller for the personal data described here. We follow the Nigeria Data Protection Act 2023 (NDPA) and the rules of the Nigeria Data Protection Commission (NDPC).`,
        `Questions or requests about your data: ${COMPANY.privacy}. Post: ${COMPANY.address}.`,
        "This policy covers the Konduct app, the Konduct Driver app and the website. It does not cover the websites of our payment partner or of banks you are sent to for a checkout; they have their own policies.",
      ],
    },
    {
      id: "collect",
      heading: "2. What we collect",
      blocks: [
        {
          table: {
            head: ["What", "From whom", "Details"],
            rows: [
              ["Account details", "Everyone", "Email address, password (stored only as a secure hash by Google Firebase), full name, language preference"],
              ["Student details", "Riders", "Student ID and campus, so one person has one account"],
              ["Driver details", "Drivers", "Name, email, phone number (optional), vehicle plate and type, route, the agent who onboarded you, and a record that your ID, vehicle papers and union membership were checked. We do not keep copies of the documents."],
              ["Transaction PIN", "Everyone", "Stored only as a one-way hash. Nobody at Konduct can see it."],
              ["Wallet and payments", "Everyone", "Top-ups, fares paid or received, who you paid for, refunds, withdrawals, payouts, balances and receipts"],
              ["Bank account for withdrawals", "Riders and drivers who withdraw", "Bank name, account number and the account name the bank returns"],
              ["Trips and seats", "Everyone", "Which vehicle you paid, when, how many seats, and the trip route the driver set"],
              ["Ratings and disputes", "Riders, drivers", "Ratings you give, what you write in a dispute, and the outcome"],
              ["Support chats", "Everyone", "Messages you send to and receive from our support team"],
              ["Device information", "Everyone", "Device model, app version, a device identifier for trusted-device checks, push notification token, and crash reports"],
              ["Referrals", "Riders", "Your invite code and who signed up with it"],
              ["Website sign-ups and job applications", "Visitors", "Name and contact you give in the pilot sign-up form, and what you send when you apply for a job"],
            ],
          },
        },
        "We do not collect your location, contacts, photos or messages. The camera is used only to read the sticker QR code; images are processed on your phone and never uploaded. Fingerprint and face unlock are handled by your phone; we never receive biometric data.",
      ],
    },
    {
      id: "why",
      heading: "3. Why we use it, and our lawful basis",
      blocks: [
        {
          table: {
            head: ["Purpose", "Lawful basis under the NDPA"],
            rows: [
              ["Create and secure your account, and keep one account per student", "Performance of our contract with you"],
              ["Process fares, top-ups, refunds, withdrawals and payouts", "Performance of contract"],
              ["Prevent fraud, check unusual payments, lock lost phones", "Legitimate interests (keeping your money safe) and legal obligation"],
              ["Keep financial records and answer lawful requests from regulators", "Legal obligation (anti-money laundering, tax and CBN rules)"],
              ["Resolve disputes and answer support chats", "Performance of contract"],
              ["Send receipts, security alerts and service messages", "Performance of contract"],
              ["Send news and offers about Konduct", "Consent. We send these only if you agree, and you can ask us to stop at any time."],
              ["Fix crashes and improve the apps using aggregated statistics", "Legitimate interests"],
              ["Show drivers their ratings without saying who gave them", "Legitimate interests"],
            ],
          },
        },
        "We do not make decisions about you based only on automated processing that have legal or similarly significant effects. Automatic fraud checks can pause a payment, but a person reviews any account hold.",
      ],
    },
    {
      id: "share",
      heading: "4. Who we share it with",
      blocks: [
        "We never sell your personal data. We share it only with:",
        {
          list: [
            "Our licensed payment partner, which holds wallet money, gives you a personal account number for top-ups, runs card and bank checkouts, and sends withdrawals and payouts to your bank.",
            "Google (Firebase Authentication, Cloud Firestore, Cloud Messaging, Crashlytics and Play Integrity), which stores our data and sends notifications.",
            "Render, which runs our server, and Vercel, which hosts our website.",
            "The driver you pay, who sees the amount, the number of seats and a payment reference, but never your name, email, student ID or balance. Riders see the driver's name, plate and rating.",
            "Your campus or the transport union, only as aggregated statistics, never your individual payments.",
            "Regulators, the police or a court, when the law requires it, and only what is required.",
            "A buyer of our business, if Konduct is ever sold, who must keep this policy's promises.",
          ],
        },
        "Each provider may use your data only to provide its service to us, under a written agreement that protects it.",
      ],
    },
    {
      id: "transfers",
      heading: "5. Data stored outside Nigeria",
      blocks: [
        "Our database (Google Cloud) and server (Render, Frankfurt) are in data centres outside Nigeria, mainly in the European Union, whose data protection law gives an adequate level of protection. We rely on the safeguards in the NDPA for these transfers, including our providers' contractual commitments.",
      ],
    },
    {
      id: "retention",
      heading: "6. How long we keep it",
      blocks: [
        {
          table: {
            head: ["Data", "Kept for"],
            rows: [
              ["Account profile, student ID link, device records", "While your account is open; deleted or anonymised within 30 days after you delete it"],
              ["Payment, wallet and payout records, receipts", "At least 5 years after the transaction, as Nigerian anti-money laundering law requires"],
              ["Support chats and disputes", "2 years after they close, unless needed for a legal claim"],
              ["Crash reports", "90 days"],
              ["Pilot sign-ups from the website", "Until the pilot opens on your campus, or until you ask us to remove you"],
              ["Job applications", "12 months after the role closes, unless you agree to a longer time"],
            ],
          },
        },
      ],
    },
    {
      id: "security",
      heading: "7. How we protect it",
      blocks: [
        "All traffic is encrypted in transit. Passwords and PINs are stored only as hashes. Only the server can change balances, and every change is written to a ledger that cannot be edited. Staff use two-step sign-in, see only what their role needs, and every action they take is logged. Stickers carry a signed code so copies can be cancelled.",
        "No system is perfectly secure. If a breach puts your rights at risk, we will tell the NDPC within 72 hours and tell you without delay.",
      ],
    },
    {
      id: "rights",
      heading: "8. Your rights",
      blocks: [
        "Under the NDPA you have the right to:",
        {
          list: [
            "be told how your data is used (this policy);",
            "get a copy of your data, and receive it in a common, machine-readable format;",
            "have wrong data corrected;",
            "have your data deleted, subject to what the law requires us to keep (see our Account Deletion Policy);",
            "object to, or ask us to restrict, how we use your data;",
            "withdraw consent you have given, at any time, without affecting what was done before;",
            "complain to the Nigeria Data Protection Commission (ndpc.gov.ng).",
          ],
        },
        `Send requests to ${COMPANY.privacy} from the email on your account, or through support in the app. We will reply within 30 days. We may ask you to confirm your identity first.`,
      ],
    },
    {
      id: "children",
      heading: "9. Children",
      blocks: ["Konduct is for students aged 16 and over. We do not knowingly collect data from younger children. If you believe a child under 16 has an account, tell us and we will delete it."],
    },
    {
      id: "website",
      heading: "10. Cookies and the website",
      blocks: [
        "Our website does not use advertising or tracking cookies. Your browser may store small settings (such as a closed banner) on your device. Our hosting provider keeps standard server logs, including IP addresses, for security, for a short period.",
      ],
    },
    {
      id: "changes",
      heading: "11. Changes to this policy",
      blocks: ["If we change this policy in a way that matters, we will tell you in the app or by email before the change takes effect. The date at the top shows the latest version."],
    },
  ],
};

export const DELETION: LegalDoc = {
  slug: "delete-account",
  title: "Account Deletion Policy",
  description: "How to delete your Konduct account and data, what happens to your wallet balance, what we delete and what Nigerian law requires us to keep.",
  summary: [
    "You can ask to delete your Konduct account at any time, from the app or by email, without reinstalling anything.",
    "Withdraw your balance first, or tell us where to send it. We never keep your money.",
    "We delete your profile, student ID link, devices and chats within 30 days.",
    "Payment records stay for 5 years because the law requires it, but they are no longer linked to a usable account.",
  ],
  sections: [
    {
      id: "how",
      heading: "1. How to ask",
      blocks: [
        "Choose whichever is easiest for you:",
        {
          list: [
            "In the Konduct app or Konduct Driver app: open Help, start a chat, choose Account, and write \"Delete my account\".",
            `By email: write to ${COMPANY.privacy} from the email address you signed up with, with the subject "Delete my account". Include your full name, and your student ID or vehicle plate.`,
            "In person: talk to a Konduct agent at the park, who will raise the request for you.",
          ],
        },
        "If you no longer have the app or your phone, use email. You do not need to reinstall the app.",
        "We will confirm we have received your request within 72 hours. For your safety we may ask you to confirm it from the email on the account, or to answer a question about your account, so nobody else can delete it.",
      ],
    },
    {
      id: "before",
      heading: "2. Before we delete",
      blocks: [
        {
          list: [
            "Your balance: withdraw it to your bank account in the app first. If you cannot, tell us a Nigerian bank account in your own name and we will send it there, at no cost to you.",
            "Open disputes or payouts: we finish them first, so no money is lost. We will tell you if this delays the deletion.",
            "Drivers: we cancel the sticker on your vehicle and remove the vehicle from the bus board. Any earnings not yet paid out are sent to your bank account first.",
          ],
        },
        "If the law, a court order or an active fraud investigation requires us to keep the account open, we will tell you, unless we are not allowed to.",
      ],
    },
    {
      id: "what",
      heading: "3. What we delete",
      blocks: [
        "Within 30 days of confirming your request, we permanently delete:",
        {
          list: [
            "your sign-in account (email and password);",
            "your profile: name, phone number and language;",
            "the link between your student ID and your account, so you or someone else can sign up with it later;",
            "your PIN hash, trusted devices and push notification tokens;",
            "your bank account details held by Konduct;",
            "your support chats, ratings you wrote and your invite code;",
            "any pilot sign-up or job application you sent through the website, if you ask.",
          ],
        },
        "Backups are overwritten on a rolling basis, so deleted data disappears from them within a further 35 days.",
      ],
    },
    {
      id: "keep",
      heading: "4. What we must keep",
      blocks: [
        "Nigerian anti-money laundering law and Central Bank of Nigeria rules require payment businesses to keep transaction records for at least 5 years. So we keep:",
        {
          list: [
            "the ledger of fares, top-ups, refunds, withdrawals and payouts, with their amounts, dates and references;",
            "the name and identifiers needed to show who each payment came from and went to;",
            "records of disputes about those payments.",
          ],
        },
        "These records are locked: they cannot be used to sign in, to market to you or for anything other than meeting the law, preventing fraud and answering legal claims. They are deleted when the retention period ends. Our payment partner keeps its own records under the same laws.",
        "Statistics that cannot identify you, such as the number of rides on a route, are not affected.",
      ],
    },
    {
      id: "partial",
      heading: "5. Deleting some data without closing your account",
      blocks: [
        "You can also ask us to delete specific data and keep your account open, for example old support chats or your bank account details. Use the same channels and tell us what you want removed. We will do it within 30 days unless we must keep it for the reasons in section 4.",
      ],
    },
    {
      id: "after",
      heading: "6. After deletion",
      blocks: [
        "Deletion cannot be undone. If you want to use Konduct again, create a new account. Your old balance, history and invite rewards will not carry over.",
        `Questions: ${COMPANY.privacy}. If you are not happy with how we handled your request, you can complain to the Nigeria Data Protection Commission.`,
      ],
    },
  ],
};

export const LEGAL_DOCS = [TERMS, PRIVACY, DELETION];
