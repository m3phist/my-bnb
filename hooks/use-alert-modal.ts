import { SafeProperty } from '@/types';
import { create } from 'zustand';

interface useAlertModalStore {
  isOpen: boolean;
  listingData: SafeProperty | null;
  onOpen: (listingData: SafeProperty) => void;
  onClose: () => void;
}

const useAlertModal = create<useAlertModalStore>((set) => ({
  isOpen: false,
  listingData: null,
  onOpen: (listingData) => set({ isOpen: true, listingData }),
  onClose: () => set({ isOpen: false, listingData: null }),
}));

export default useAlertModal;
