'use client';

import Container from '@/components/Container';
import Logo from '@/components/navbar/Logo';
import Search from '@/components/navbar/Search';
import UserMenu from '@/components/navbar/UserMenu';

import { User } from '@prisma/client';
import Categories from '@/components/navbar/Categories';
import { SafeUser } from '@/types';

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
