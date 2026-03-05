import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SetupStatus {
  setupCompleted: boolean;
}

/**
 * Hook for checking setup status (no auth required).
 */
export function useSetupStatus() {
  const { data, error, isLoading, mutate } = useSWR<SetupStatus>(
    '/api/sms-automation/settings/setup',
    fetcher
  );

  return {
    setupCompleted: data?.setupCompleted ?? false,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook for reading settings (requires auth token).
 */
export function useSettings(token?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    token ? '/api/sms-automation/settings' : null,
    (url: string) =>
      fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
  );

  return {
    settings: data || null,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook for updating settings (requires auth token).
 */
export function useUpdateSettings(token?: string) {
  const updateSettings = async (
    section: string,
    data: Record<string, unknown>
  ) => {
    const response = await fetch('/api/sms-automation/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ section, data }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to update settings');
    }

    return response.json();
  };

  const testConnection = async (action: string) => {
    const response = await fetch('/api/sms-automation/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Connection test failed');
    }

    return response.json();
  };

  return { updateSettings, testConnection };
}
