'use client';

import React, { Suspense } from 'react';
import ResetPasswordPageContent from './ResetPasswordPageContent';

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
};

export default Page;
