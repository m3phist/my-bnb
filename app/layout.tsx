import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import { RegisterModal } from '@/components/modals/register-modal';
import ToasterProvider from '@/providers/ToasterProvider';
import { ModalProvider } from '@/providers/modal-provider';
import { LoginModal } from '@/components/modals/login-modal';
import getCurrentUser from '@/actions/getCurrentUser';
import { RentModal } from '@/components/modals/rent-modal';
import SearchModal from '@/components/modals/search-modal';

export const metadata: Metadata = {
  title: 'Airbnb',
  description:
    'Airbnb: Vacation Rentals, Cabins, Beach Houses, Unique Homes & Experiences',
};

const font = Nunito({
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <RentModal />
        <SearchModal />

        <ModalProvider />
        <Navbar currentUser={currentUser} />
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
