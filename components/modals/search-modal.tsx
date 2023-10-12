'use client';

import { Modal } from '@/components/ui/modal';
import useSearchModal from '@/hooks/use-search-modal';

import Button from '../Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import dynamic from 'next/dynamic';
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect';
import qs from 'query-string';
import { formatISO, differenceInCalendarDays } from 'date-fns';
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [dayCount, setDayCount] = useState(0);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      setDayCount(dayCount);
    }
  }, [dateRange]);

  const Map = useMemo(
    () =>
      dynamic(() => import('../Map'), {
        ssr: false,
      }),
    []
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.LOCATION ? undefined : 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-4 px-2">
      <Heading
        title="Where do you want to go?"
        subtitle="Find the perfect destination"
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />

      <hr />
      <Map center={location?.latlng} />

      {secondaryActionLabel && (
        <Button label={secondaryActionLabel} onClick={onBack} outline />
      )}
      <Button label={actionLabel} disabled={!location} onClick={onNext} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Select your travel date"
        />

        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />

        <div className="mt-10 flex gap-2">
          {secondaryActionLabel && (
            <Button
              label={secondaryActionLabel}
              onClick={onBack}
              outline // Add outline style to the Back button
            />
          )}

          <Button
            label={actionLabel}
            disabled={dayCount === 0}
            onClick={onNext}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Let us find you the right place"
        />

        <Counter
          title="Guests"
          subtitle="How many guests are there?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />

        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />

        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you prefer?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />

        <div className="mt-10 flex gap-2">
          {secondaryActionLabel && (
            <Button
              label={secondaryActionLabel}
              onClick={onBack}
              outline // Add outline style to the Back button
            />
          )}

          <Button label={actionLabel} onClick={onSubmit} />
        </div>
      </div>
    );
  }

  return (
    <Modal
      title="Search"
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
    >
      <hr />
      <div>
        <div className="space-y-4 py-2 pb-4">{bodyContent}</div>
      </div>
    </Modal>
  );
};

export default SearchModal;
