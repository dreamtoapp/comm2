'use server';

export interface SendMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface WhatsAppApiError {
  error: {
    message: string;
    type?: string;
    code?: number;
    error_data?: unknown;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

interface WhatsAppApiSuccess {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

type WhatsAppApiResponse = WhatsAppApiError | WhatsAppApiSuccess;

function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
  return phoneNumberRegex.test(phoneNumber);
}

function isWhatsAppApiResponse(data: unknown): data is WhatsAppApiResponse {
  if (typeof data !== 'object' || data === null) return false;

  // Check for error structure
  if ('error' in data) {
    const errorData = (data as WhatsAppApiError).error;
    return typeof errorData.message === 'string';
  }

  // Check for success structure
  if ('messaging_product' in data) {
    const successData = data as WhatsAppApiSuccess;
    return (
      typeof successData.messaging_product === 'string' &&
      Array.isArray(successData.contacts) &&
      Array.isArray(successData.messages)
    );
  }

  return false;
}

export async function sendMessage(
  phoneNumber: string,
  messageText: string,
): Promise<SendMessageResponse> {
  try {
    const accessToken = process.env.WHATSAPP_PERMANENT_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      console.error('Missing environment variables');
      return { success: false, error: 'Server configuration error' };
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return {
        success: false,
        error: 'Invalid phone number format. Use international format (e.g., +1234567890)',
      };
    }

    const endpoint = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const requestBody = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: messageText },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data: unknown = await response.json();

    if (!isWhatsAppApiResponse(data)) {
      console.error('Unexpected API response structure:', data);
      return { success: false, error: 'Unexpected API response format' };
    }

    if ('error' in data) {
      console.error('WhatsApp API Error:', data.error.message);
      return { success: false, error: data.error.message };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unexpected error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}