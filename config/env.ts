if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
} as const; 