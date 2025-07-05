import { redirect } from '@remix-run/cloudflare';

export async function loader() {
  // Create a new chat session ID and redirect to it
  const chatId = Math.random().toString(36).substring(2, 15);
  return redirect(`/chat/${chatId}`);
}
