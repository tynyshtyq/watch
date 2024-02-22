import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const MainPageWithSuspense = dynamic(() => import('@/page/Main'), {
  ssr: false,
});

function HomePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MainPageWithSuspense />
      </Suspense>
    </div>
  );
}

export default HomePage;
