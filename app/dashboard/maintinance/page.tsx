'use client';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import AdminMaintenanceDashboard from '../maintenance/admin-dashboard';
import TenantMaintenanceDashboard from '../maintenance/tenant-dashboard';

export default function MaintenancePage() {
  const [role, setRole] = useState<'admin' | 'tenant'>('admin');

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center gap-4'>
        <span className='font-semibold'>Role Preview:</span>
        <Button
          variant={role === 'admin' ? 'default' : 'outline'}
          onClick={() => setRole('admin')}
        >
          Admin
        </Button>
        <Button
          variant={role === 'tenant' ? 'default' : 'outline'}
          onClick={() => setRole('tenant')}
        >
          Tenant
        </Button>
      </div>
      {role === 'admin' ? <AdminMaintenanceDashboard /> : <TenantMaintenanceDashboard />}
    </div>
  );
}
