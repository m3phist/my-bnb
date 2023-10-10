'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import Container from '@/components/Container';
import Heading from '@/components/Heading';
import ListingCard from '@/components/listings/ListingCard';
import { SafeListing, SafeUser } from '@/types';
import usePropertyModal from '@/hooks/use-property-modal';
import { PropertyModal } from '@/components/modals/edit-property-modal';
import { AlertModal } from '@/components/modals/a-m';
import useAlertModal from '@/hooks/use-alert-modal';

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();

  const [editingId, setEditingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [itemToDeleteId, setItemToDeleteId] = useState('');

  const propertyModal = usePropertyModal();
  const alertModal = useAlertModal();

  const onDelete = useCallback(
    (id: string) => {
      // Set the itemToDeleteId when onDelete is called
      setItemToDeleteId(id);

      // Find the listing data by ID
      const listingToDelete = listings.find((listing) => listing.id === id);

      if (listingToDelete) {
        const {
          id,
          title,
          description,
          imageSrc,
          category,
          roomCount,
          bathroomCount,
          guestCount,
          locationValue,
          userId,
          price,
          createdAt,
        } = listingToDelete;

        const listingData = {
          id,
          title,
          description,
          imageSrc,
          category,
          roomCount,
          bathroomCount,
          guestCount,
          locationValue,
          userId,
          price,
          createdAt,
        };
        console.log('propertiesclient', listingData);
        // Pass the listingData as an argument to alertModal.onOpen()
        alertModal.onOpen(listingData);
      }
    },
    [alertModal, listings]
  );

  // New function to handle property deletion
  const handlePropertyDeletion = (id: string) => {
    axios
      .delete(`/api/listings/${id}`)
      .then(() => {
        toast.success('Listing deleted');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        setDeletingId('');
      });
  };

  const onEdit = useCallback(
    (id: string) => {
      setEditingId(id);

      // Find the listing data by ID
      const listingToEdit = listings.find((listing) => listing.id === id);

      if (listingToEdit) {
        const {
          id,
          title,
          description,
          imageSrc,
          category,
          roomCount,
          bathroomCount,
          guestCount,
          locationValue,
          userId,
          price,
          createdAt,
        } = listingToEdit;
        const listingData = {
          id,
          title,
          description,
          imageSrc,
          category,
          roomCount,
          bathroomCount,
          guestCount,
          locationValue,
          userId,
          price,
          createdAt,
        }; // Extract only the properties that match SafeListing

        console.log('Found listing data:', listingData);

        // Use propertyModal.onOpen() to open the modal and pass the listing data
        propertyModal.onOpen(listingData);
      }
    },
    [listings, propertyModal]
  );

  return (
    <Container>
      <Heading title="Properties" subtitle="Edit your property info" />
      <div className="mt-10 gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onEdit={onEdit}
            onDelete={onDelete}
            disabled={deletingId === listing.id}
            actionLabel="Edit property"
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Render PropertyModal only if listingData is not null */}
      {propertyModal.listingData && (
        <PropertyModal
          listingData={propertyModal.listingData}
          isOpen={propertyModal.isOpen}
          onClose={propertyModal.onClose}
        />
      )}
      {/* Delete Confirmation Modal */}

      {alertModal.listingData && (
        <AlertModal
          listingData={alertModal.listingData}
          isOpen={alertModal.isOpen}
          onClose={alertModal.onClose}
          onConfirm={() => {
            // onDelete && onDelete(itemToDeleteId);
            handlePropertyDeletion(itemToDeleteId);
            alertModal.onClose();
          }}
          loading={false} // Set loading state as needed
        />
      )}
    </Container>
  );
};

export default PropertiesClient;
