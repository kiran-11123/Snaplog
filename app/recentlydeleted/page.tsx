// page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the client component so it's never rendered on the server
const RecentlyDeletedClient = dynamic(
  () => import('../components/RecentlyDeletedClient'),
  { ssr: false } // <-- important, disables server-side rendering
);

export default function RecentlyDeletedPage() {
  return (
    <Suspense fallback={<p>Loading recently deleted...</p>}>
      <RecentlyDeletedClient />
    </Suspense>
  );
}
