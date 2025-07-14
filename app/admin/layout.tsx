import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - RetroFuture Fashion',
  description: 'Admin panel for managing RetroFuture Fashion store',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}