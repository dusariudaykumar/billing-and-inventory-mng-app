export const generateCustomerId = async (
  name: string,
  phone: string,
  company = ''
): Promise<string> => {
  const data = `${name}${phone}${company}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return parseInt(hashHex, 16).toString(36).toUpperCase().substring(0, 6);
};
