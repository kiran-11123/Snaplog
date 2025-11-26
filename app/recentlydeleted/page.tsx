'use client'; // top of page.tsx
export const dynamic = 'force-dynamic';

import RecentlyDeletedClient from '../components/RecentlyDeletedClient';

export default function RecentlyDeletedPage() {
  return <RecentlyDeletedClient />;
}
