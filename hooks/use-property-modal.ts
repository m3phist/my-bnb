import { SafeListing } from '@/types';
import { create } from 'zustand';

interface usePropertyModalStore {
  isOpen: boolean;
  listingData: SafeListing | null;
  onOpen: (listingData: SafeListing) => void;
  onClose: () => void;
}

const usePropertyModal = create<usePropertyModalStore>((set) => ({
  isOpen: false,
  listingData: null,
  onOpen: (listingData) => set({ isOpen: true, listingData }),
  onClose: () => set({ isOpen: false, listingData: null }),
}));

export default usePropertyModal;
