import useSWR from 'swr';
import { Lead } from '../db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseLeadsOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Hook for managing leads with SWR
 */
export function useLeads(options?: UseLeadsOptions) {
  const params = new URLSearchParams();
  if (options?.status) params.append('status', options.status);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());

  const queryString = params.toString();
  const url = `/api/sms-automation/leads${queryString ? '?' + queryString : ''}`;

  const { data, error, isLoading, mutate } = useSWR<Lead[]>(url, fetcher);

  return {
    leads: data || [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook for managing a single lead
 */
export function useLead(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Lead>(
    id ? `/api/sms-automation/leads?id=${id}` : null,
    fetcher
  );

  const updateLead = async (updates: Partial<Lead>) => {
    if (!data) return;

    const response = await fetch(`/api/sms-automation/leads?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const updated = await response.json();
      mutate(updated);
      return updated;
    }

    throw new Error('Failed to update lead');
  };

  const deleteLead = async () => {
    const response = await fetch(`/api/sms-automation/leads?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete lead');
    }

    mutate(undefined);
  };

  return {
    lead: data || null,
    isLoading,
    error,
    updateLead,
    deleteLead,
    mutate,
  };
}

/**
 * Hook for creating a lead
 */
export function useCreateLead() {
  const { mutate: mutateLeads } = useSWR('/api/sms-automation/leads', fetcher);

  const createLead = async (leadData: Partial<Lead>) => {
    const response = await fetch('/api/sms-automation/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create lead');
    }

    const created = await response.json();
    await mutateLeads();
    return created;
  };

  return { createLead };
}
