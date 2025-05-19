import React from 'react';

import LoginPe from './component/login-from';

async function pe({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const redirect = resolvedSearchParams.redirect;

  return <LoginPe redirect={redirect || '/'} />;
}

export default pe;
