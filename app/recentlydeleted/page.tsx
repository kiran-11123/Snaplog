import dynamic from 'next/dynamic';

const RecentlyDeletedClient = dynamic(
  () => import('../components/RecentlyDeletedClient'),
  { ssr: false } // <-- disables server-side rendering
);

export default function RecentlyDeletedPage() {
  return <RecentlyDeletedClient />;
}
