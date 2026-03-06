import type { Metadata } from "next";
import BillingClientView from "./BillingClientView";

interface Props {
  readonly params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thelevelteam.com";
    const res = await fetch(`${baseUrl}/api/billing/share?token=${token}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return {
        title: `Invoice — ${data.customer.company_name} | ${data.settings.company_name}`,
        description: `Invoice for ${data.customer.company_name}. Amount: $${data.customer.amount}`,
      };
    }
  } catch {
    // Fall through to defaults
  }

  return {
    title: "Invoice | TheLevelTeam",
    description: "View and pay your invoice",
  };
}

export default async function BillingSharePage({ params }: Props) {
  const { token } = await params;
  return <BillingClientView token={token} />;
}
