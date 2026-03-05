import { db } from '../db';
import {
  leads,
  smsMessages,
  emailMessages,
  leadDripState,
  Lead,
  NewLead,
} from '../db/schema';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import { toE164 } from '../integrations/twilio';

/**
 * Create a new lead
 */
export async function createLead(data: NewLead): Promise<Lead> {
  const normalized = normalizeLead(data) as NewLead;

  const [lead] = await db
    .insert(leads)
    .values(normalized)
    .returning();

  if (!lead) {
    throw new Error('Failed to create lead');
  }

  return lead;
}

/**
 * Get all leads
 */
export async function getLeads(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Lead[]> {
  const baseQuery = filters?.status
    ? db.select().from(leads).where(eq(leads.status, filters.status as typeof leads.status.enumValues[number]))
    : db.select().from(leads);

  const ordered = baseQuery.orderBy(desc(leads.createdAt));
  const limited = filters?.limit ? ordered.limit(filters.limit) : ordered;
  const offset = filters?.offset ? limited.offset(filters.offset) : limited;

  return offset;
}

/**
 * Get a single lead by ID
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id));

  return lead || null;
}

/**
 * Get lead by email
 */
export async function getLeadByEmail(email: string): Promise<Lead | null> {
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.email, email.toLowerCase()));

  return lead || null;
}

/**
 * Get lead by phone
 */
export async function getLeadByPhone(phone: string): Promise<Lead | null> {
  const normalized = toE164(phone);
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.phone, normalized));

  return lead || null;
}

/**
 * Update a lead
 */
export async function updateLead(id: string, data: Partial<NewLead>): Promise<Lead> {
  const normalized = { ...normalizeLead(data), updatedAt: new Date() };

  const [updated] = await db
    .update(leads)
    .set(normalized)
    .where(eq(leads.id, id))
    .returning();

  if (!updated) {
    throw new Error('Lead not found');
  }

  return updated;
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  id: string,
  status: string
): Promise<Lead> {
  const validStatuses = [
    'incoming',
    'followed_up',
    'qualified',
    'proposal_sent',
    'negotiation',
    'won',
    'lost',
    'unsubscribed',
  ];

  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return updateLead(id, { status: status as any });
}

/**
 * Unsubscribe a lead from all communications
 */
export async function unsubscribeLead(id: string): Promise<Lead> {
  const [updated] = await db
    .update(leads)
    .set({
      status: 'unsubscribed',
      smsConsent: false,
      emailConsent: false,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning();

  if (!updated) {
    throw new Error('Lead not found');
  }

  return updated;
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string): Promise<boolean> {
  await db.delete(leads).where(eq(leads.id, id));
  return true;
}

/**
 * Get conversation history for a lead
 */
export async function getLeadConversationHistory(leadId: string): Promise<{
  sms: typeof smsMessages.$inferSelect[];
  email: typeof emailMessages.$inferSelect[];
}> {
  const smsConvo = await db
    .select()
    .from(smsMessages)
    .where(eq(smsMessages.leadId, leadId))
    .orderBy(desc(smsMessages.createdAt));

  const emailConvo = await db
    .select()
    .from(emailMessages)
    .where(eq(emailMessages.leadId, leadId))
    .orderBy(desc(emailMessages.createdAt));

  return { sms: smsConvo, email: emailConvo };
}

/**
 * Get leads that are unsubscribed from SMS
 */
export async function getUnsubscribedFromSMS(): Promise<Lead[]> {
  return db
    .select()
    .from(leads)
    .where(or(eq(leads.smsConsent, false), eq(leads.status, 'unsubscribed')));
}

/**
 * Get leads that are unsubscribed from email
 */
export async function getUnsubscribedFromEmail(): Promise<Lead[]> {
  return db
    .select()
    .from(leads)
    .where(or(eq(leads.emailConsent, false), eq(leads.status, 'unsubscribed')));
}

/**
 * Normalize a lead object (trim, lowercase email, normalize phone)
 */
export function normalizeLead(data: Partial<NewLead>): Partial<NewLead> {
  return {
    ...data,
    name: data.name ? data.name.trim() : undefined,
    email: data.email ? data.email.toLowerCase().trim() : undefined,
    phone: data.phone ? toE164(data.phone) : undefined,
    message: data.message ? data.message.trim() : undefined,
    projectInterest: data.projectInterest
      ? data.projectInterest.trim()
      : undefined,
    source: data.source ? data.source.trim() : undefined,
  };
}

/**
 * Get lead summary for display
 */
export interface LeadSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  unreadMessageCount: number;
  lastMessageAt: Date | null;
  createdAt: Date;
}

export async function getLeadSummary(id: string): Promise<LeadSummary | null> {
  const lead = await getLeadById(id);
  if (!lead) return null;

  const [smsData] = await db
    .select()
    .from(smsMessages)
    .where(eq(smsMessages.leadId, id))
    .orderBy(desc(smsMessages.createdAt))
    .limit(1);

  const [emailData] = await db
    .select()
    .from(emailMessages)
    .where(eq(emailMessages.leadId, id))
    .orderBy(desc(emailMessages.createdAt))
    .limit(1);

  const lastMessageAt =
    smsData?.createdAt && emailData?.createdAt
      ? smsData.createdAt > emailData.createdAt
        ? smsData.createdAt
        : emailData.createdAt
      : smsData?.createdAt || emailData?.createdAt || null;

  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    unreadMessageCount: 0, // TODO: Implement unread tracking if needed
    lastMessageAt,
    createdAt: lead.createdAt,
  };
}

/**
 * Search leads by name, email, or phone
 */
export async function searchLeads(query: string): Promise<Lead[]> {
  const searchTerm = `%${query.toLowerCase()}%`;

  return db
    .select()
    .from(leads)
    .where(
      or(
        ilike(leads.name, searchTerm),
        ilike(leads.email, searchTerm),
        eq(leads.phone, toE164(query))
      )
    )
    .orderBy(desc(leads.createdAt));
}
