export type PracticeArea = {
  slug: string;
  title: string;
  summary: string;
  items: string[];
};

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    slug: "corporate-commercial-law",
    title: "Corporate and Commercial Law",
    summary:
      "Governance, compliance, and transactional advice for directors, shareholders, and corporate clients.",
    items: [
      "Company formation, MOI amendments, and CIPC compliance",
      "Shareholder and partnership agreements",
      "Directors' duties, liability, and governance advice",
      "Legal opinions and due diligence investigations",
    ],
  },
  {
    slug: "contract-law",
    title: "Contract Law",
    summary: "Drafting, review, and enforcement of commercial agreements for SMEs and corporates.",
    items: [
      "Drafting, review, and negotiation of commercial agreements",
      "Breach of contract, cancellation, and damages claims",
      "Service agreements, supply agreements, NDAs, and MOUs",
      "Contract risk assessments for SMEs and corporates",
    ],
  },
  {
    slug: "labour-law",
    title: "Labour Law",
    summary: "Representation for employers and employees through disputes, arbitrations, and Labour Court matters.",
    items: [
      "Employment contracts and workplace policies",
      "Disciplinary enquiries and CCMA arbitrations",
      "Labour Court appearances, Appeals and Reviews",
      "Retrenchments, retrenchment procedures, and unfair dismissal disputes",
      "Restraint of trade and breach of confidentiality matters",
    ],
  },
  {
    slug: "pension-law",
    title: "Pension Law",
    summary: "Advice and representation on pension fund governance, benefits, and disputes.",
    items: [
      "Advice on the Pension Funds Act, 24 of 1956 and related regulations, including the Government Employees Pension Law, 1996",
      "Pension fund governance, trustee duties, and compliance",
      "Disputes before the Pension Fund Adjudicator",
      "Benefit claims, withdrawal, and retirement benefits",
      "Rule amendments, fund mergers, and liquidations",
      "Employer and employee representation in pension disputes",
    ],
  },
  {
    slug: "family-matrimonial-law",
    title: "Family and Matrimonial Law",
    summary: "Divorce, maintenance, custody, and matrimonial property matters handled with discretion.",
    items: [
      "Divorce actions, unopposed and opposed",
      "Maintenance, custody, and parental plan applications",
      "Change of the matrimonial property system",
      "Mediation and settlement negotiations",
    ],
  },
  {
    slug: "immigration-law",
    title: "Immigration Law",
    summary: "Residence, work, and visa applications, appeals, and employer compliance.",
    items: [
      "Applications for temporary and permanent residence permits",
      "Work, study and business visa applications",
      "Appeals and reviews under the Immigration Act, 13 of 2002",
      "Citizenship and waiver applications",
      "Compliance advice for employers employing foreign nationals",
    ],
  },
  {
    slug: "insolvency-business-rescue",
    title: "Insolvency Law, Liquidation and Business Rescue",
    summary: "Liquidation, sequestration, and business rescue proceedings for companies, creditors, and individuals.",
    items: [
      "Applications for voluntary and compulsory liquidation of companies and close corporations",
      "Sequestration applications for individuals and partnerships",
      "Representation of creditors, debtors, and liquidators in liquidation proceedings",
      "Business rescue applications and supervision under Chapter 6 of the Companies Act 71 of 2008",
      "Voidable dispositions, section 417 inquiries, and director liability claims",
      "Compromise offers and schemes of arrangements in terms of section 155 of the Companies Act 71 of 2008",
    ],
  },
  {
    slug: "court-appearance-litigation",
    title: "Court Appearance & Litigation",
    summary: "Litigation and appearance across the Magistrate's Court, High Court, and specialised tribunals.",
    items: [
      "Magistrate's Court, High Court and Specialised Courts and Tribunals litigation",
      "Motion Court applications, trials, and interlocutory proceedings",
      "Debt collection and enforcement of judgments",
      "Drafting of notices, pleadings and affidavits",
      "Appearance in respect of all practice areas listed above",
    ],
  },
];

export function getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
  return PRACTICE_AREAS.find((area) => area.slug === slug);
}
