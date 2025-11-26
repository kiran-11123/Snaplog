// /app/recentlydeleted/page.tsx
'use client';

import RecentlyDeletedClient from '../components/RecentlyDeletedClient';
import { useSearchParams } from 'next/navigation';

export default function RecentlyDeletedPage() {
  const searchParams = useSearchParams(); // hook works because it's now client-side
  const title = searchParams.get('title') ?? "Default";

  return <RecentlyDeletedClient title={title} />;
}
