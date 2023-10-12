'use client';

import { Modal } from '@/components/ui/modal';
import Button from '../Button';

import useAlertModal from '@/hooks/use-alert-modal';
import { SafeProperty } from '@/types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  listingData: SafeProperty;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  onClose,
  onConfirm,
  loading,
  listingData,
}) => {
  const alertModal = useAlertModal();
  console.log('alertModal', listingData);

  let bodyContent = (
    <div className="flex flex-col gap-4 px-2">
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button label="Cancel" disabled={loading} onClick={onClose} outline />
        <Button label="Continue" disabled={loading} onClick={onConfirm} />
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <>
          Delete{' '}
          <span className="italic text-slate-800">{listingData.title}</span>{' '}
        </>
      }
      description="This action cannot be undone please proceed carefully"
      isOpen={alertModal.isOpen}
      onClose={alertModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">{bodyContent}</div>
      </div>
    </Modal>
  );
};
