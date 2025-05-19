import React from 'react';
import { getDashboardSummary } from '@/lib/dashboardSummary';
import DashboardHomePage from './DashboardHomePage';

export default async function DashboardHome() {
  const summary = await getDashboardSummary();
  return <DashboardHomePage summary={summary} />;
}
