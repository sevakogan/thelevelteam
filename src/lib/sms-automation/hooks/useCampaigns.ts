import useSWR from 'swr';
import { DripCampaign } from '../db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Hook for managing drip campaigns
 */
export function useCampaigns() {
  const { data, error, isLoading, mutate } = useSWR<DripCampaign[]>(
    '/api/sms-automation/campaigns',
    fetcher
  );

  const createCampaign = async (campaignData: Partial<DripCampaign>) => {
    const response = await fetch('/api/sms-automation/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      throw new Error('Failed to create campaign');
    }

    const created = await response.json();
    await mutate();
    return created;
  };

  const updateCampaign = async (id: string, updates: Partial<DripCampaign>) => {
    const response = await fetch(`/api/sms-automation/campaigns?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update campaign');
    }

    const updated = await response.json();
    await mutate();
    return updated;
  };

  const toggleCampaignActive = async (id: string) => {
    const response = await fetch(`/api/sms-automation/campaigns?id=${id}`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle campaign');
    }

    await mutate();
  };

  const deleteCampaign = async (id: string) => {
    const response = await fetch(`/api/sms-automation/campaigns?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete campaign');
    }

    await mutate();
  };

  return {
    campaigns: data || [],
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    toggleCampaignActive,
    deleteCampaign,
    mutate,
  };
}

/**
 * Hook for managing a single campaign
 */
export function useCampaign(id: string) {
  const { data, error, isLoading, mutate } = useSWR<DripCampaign>(
    id ? `/api/sms-automation/campaigns?id=${id}` : null,
    fetcher
  );

  const updateCampaign = async (updates: Partial<DripCampaign>) => {
    const response = await fetch(`/api/sms-automation/campaigns?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update campaign');
    }

    const updated = await response.json();
    mutate(updated);
    return updated;
  };

  return {
    campaign: data || null,
    isLoading,
    error,
    updateCampaign,
    mutate,
  };
}
