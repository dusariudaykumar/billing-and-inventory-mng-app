/**
 * Generate WhatsApp share link with message
 * @param phoneNumber - Optional phone number (with country code, no +)
 * @param message - Message to pre-fill
 * @returns WhatsApp share URL
 */
export const generateWhatsAppLink = (
  message: string,
  phoneNumber?: string
): string => {
  const encodedMessage = encodeURIComponent(message);

  if (phoneNumber) {
    // Remove any non-digit characters and ensure it starts with country code
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  // If no phone number, open WhatsApp Web with message
  return `https://wa.me/?text=${encodedMessage}`;
};
