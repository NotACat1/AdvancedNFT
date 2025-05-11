import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { RootPage } from '@pages/RootPage';
import { HomePage } from '@pages/HomePage';
import { MintPage } from '@pages/MintPage';
import { MarketplacePage } from '@pages/MarketplacePage';
import { ProfilePage } from '@pages/ProfilePage';
import { LicensePage } from '@pages/LicensePage';
import { PrivacyPage } from '@pages/PrivacyPage';
import { TermsPage } from '@pages/TermsPage';
import { FAQPage } from '@pages/FAQPage';
import { NotFoundPage } from '@pages/NotFoundPage';

const router = createHashRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'create', element: <MintPage /> },
      { path: 'explore', element: <MarketplacePage /> },
      { path: 'my-nft', element: <ProfilePage /> },
      { path: 'license', element: <LicensePage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export const App: React.FC = () => <RouterProvider router={router} />;
