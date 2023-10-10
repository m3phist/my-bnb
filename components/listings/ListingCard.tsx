'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';

import useCountries from '@/hooks/use-countries';
import { SafeListing, SafeReservation, SafeUser } from '@/types';
import HeartButton from '../HeartButton';
import Button from '../Button';

import useAlertModal from '@/hooks/use-alert-modal';

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onEdit?: (id: string) => void; // Rename onAction to onEdit
  onDelete?: (id: string) => void; // Add onDelete prop
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onEdit,
  onDelete,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onEdit?.(actionId);
    },
    [onEdit, actionId, disabled]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onDelete?.(actionId);
    },
    [actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            alt="Listing"
            src={data.imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex items-center gap-1">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">night</div>}
        </div>
        {onEdit && actionLabel && (
          <Button
            disabled={disabled}
            small
            outline
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
        {onDelete && ( // Render the Delete button conditionally
          <Button
            disabled={disabled}
            small
            label="Delete property"
            onClick={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
