import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ProtectedRoute } from './ProtectedRoute';

interface AdminLayoutProps {
  requireAdmin?: boolean;
}

export function AdminLayout({ requireAdmin = false }: AdminLayoutProps) {
  return (
    <ProtectedRoute requireAdmin={requireAdmin}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
