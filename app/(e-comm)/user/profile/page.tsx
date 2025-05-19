import React from 'react';
import { userProfile } from './action/action';
import EmptyState from '../../../../components/warinig-msg';
import UserProfileForm from './component/update-profile';
import { redirect } from 'next/navigation';
import getSession from '../../../../lib/getSession';

async function ProfilePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const userId = resolvedSearchParams.id;

  // const session = await auth();
  const session = await getSession();
  const user = session?.user;
  if (!user) return redirect('/auth/login');

  if (!userId) return <EmptyState message='معرّف المستخدم غير صالح' />;

  const userData = await userProfile(userId);
  if (!userData) return <EmptyState message='المستخدم غير موجود' />;

  return <UserProfileForm userData={userData} />;
}

export default ProfilePage;
