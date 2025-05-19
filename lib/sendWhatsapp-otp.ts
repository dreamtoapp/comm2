'use server';

export async function sendWhatsAppMessage(message: string): Promise<boolean> {
  const apiKey = process.env.CALLMEBOT_API_KEY as string;
  const phone = process.env.CALLMEBOT_PHONE as string;
  const encodedMessage = encodeURIComponent(message);

  if (!apiKey || !phone) {
    console.error('Missing WhatsApp API credentials.');
    return false; // Return failure instead of crashing
  }

  try {
    const response = await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`,
    );

    if (!response.ok) {
      console.error(`Failed to send WhatsApp message. Status: ${response.status}`);
      return false;
    }

    return true; // Indicate success
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false; // Prevent app crash by returning false
  }
}
