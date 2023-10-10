'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import { useCallback, useEffect, useState } from 'react';

import Avatar from '@/components/Avatar';
import MenuItem from '@/components/navbar/MenuItem';
// import useRegisterModal from '@/hooks/useRegisterModal';
import useRegisterModal from '@/hooks/use-register-modal';
import useLoginModal from '@/hooks/use-login-modal';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import useRentModal from '@/hooks/use-rent-modal';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/types';

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // Add a function to close the UserMenu drawer
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Add event listener to close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuElement = document.querySelector('.user-menu');
      if (menuElement && !menuElement.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    // open rent modal
    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  return (
    <div>
      <div className="user-menu relative">
        <div className="flex items-center gap-3">
          <div
            onClick={onRent}
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full 
            hover:bg-neutral-100 transition cursor-pointer"
          >
            Airbnb your home
          </div>
          <div
            onClick={toggleOpen}
            className="flex items-center gap-3 rounded-full cursor-pointer p-4 md:py-1 md:px-2 border-[1px]
             border-neutral-200 hover:shadow-md transition"
          >
            <AiOutlineMenu />
            <div className="hidden md:block">
              <Avatar src={currentUser?.image} />
            </div>
          </div>
        </div>
        {isOpen && (
          <div
            className="absolute rounded-xl shadow-md w-[40vw]
          md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm"
          >
            <div className="flex flex-col cursor-pointer">
              {currentUser ? (
                <>
                  <MenuItem
                    onClick={() => {
                      router.push('/trips');
                      closeMenu();
                    }}
                    label="My trips"
                  />
                  <MenuItem
                    onClick={() => {
                      router.push('/reservations');
                      closeMenu();
                    }}
                    label="My reservations"
                  />
                  <MenuItem
                    onClick={() => {
                      router.push('/favorites');
                      closeMenu();
                    }}
                    label="My favorites"
                  />
                  <MenuItem
                    onClick={() => {
                      router.push('/properties');
                      closeMenu();
                    }}
                    label="My properties"
                  />
                  <MenuItem
                    onClick={() => {
                      rentModal.onOpen();
                      closeMenu();
                    }}
                    label="Airbnb my home"
                  />
                  <hr />
                  <MenuItem
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    label="Logout"
                  />
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      loginModal.onOpen();
                    }}
                    label="Login"
                  />
                  <MenuItem
                    onClick={() => {
                      registerModal.onOpen();
                    }}
                    label="Sign Up"
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
