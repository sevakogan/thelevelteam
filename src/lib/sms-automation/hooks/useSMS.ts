import useSWR from 'swr';
import { SmsMessage } from '../db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseConversationOptions {
  leadId?: string;
  phone?: string;
}

interface ConversationResponse {
  messages: SmsMessage[];
  leadId?: string;
  phone: string;
}

/**
 * Hook for SMS conversation management
 */
export function useSMSConversation(options: UseConversationOptions) {
  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(options).filter(([, value]) => value !== undefined)
    )
  ).toString();

  const url = `/api/sms-automation/sms${queryString ? '?' + queryString : ''}`;

  const { data, error, isLoading, mutate } = useSWR<ConversationResponse>(
    url,
    fetcher
  );

  const sendSMS = async (body: string) => {
    const response = await fetch('/api/sms-automation/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...options,
        body,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    const result = await response.json();
    await mutate();
    return result;
  };

  return {
    messages: data?.messages || [],
    phone: data?.phone,
    leadId: data?.leadId,
    isLoading,
    error,
    sendSMS,
    mutate,
  };
}

/**
 * Hook for sending SMS
 */
export function useSendSMS() {
  const sendSMS = async (phone: string, body: string, leadId?: string) => {
    const response = await fetch('/api/sms-automation/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, body, leadId }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }

    return await response.json();
  };

  return { sendSMS };
}
