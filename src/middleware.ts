import { supabase } from './lib/supabase';

/**
 * Middleware for protecting /admin routes
 * Redirects unauthenticated users to /admin/login
 */
export async function checkAuth(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export function isAdminRoute(path: string): boolean {
  return path.startsWith('/admin') && !path.startsWith('/admin/login');
}
