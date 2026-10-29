import { RequireAuth } from '@/components/layout/require-auth';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
