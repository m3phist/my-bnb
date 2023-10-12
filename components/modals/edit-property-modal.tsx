'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { Modal } from '@/components/ui/modal';
import Button from '../Button';
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import { useRouter } from 'next/navigation';
import usePropertyModal from '@/hooks/use-property-modal';
import useCountries from '@/hooks/use-countries';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingData: {
    id: string;
    category: string;
    location?: string;
    locationValue: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    imageSrc: string;
    price: number;
    title: string;
    description: string;
  };
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  listingData,
}) => {
  console.log('Listing Data:', listingData);

  const router = useRouter();
  const propertyModal = usePropertyModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const { getByValue } = useCountries();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: listingData ? listingData.category : '',
      location: listingData ? listingData.locationValue : '',
      guestCount: listingData ? listingData.guestCount : 0,
      roomCount: listingData ? listingData.roomCount : 0,
      bathroomCount: listingData ? listingData.bathroomCount : 0,
      imageSrc: listingData ? listingData.imageSrc : '',
      price: listingData ? listingData.price : 0,
      title: listingData ? listingData.title : '',
      description: listingData ? listingData.description : '',
    },
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');
  const title = watch('title');
  const description = watch('description');
  const price = watch('price');

  console.log('Default Values:', {
    category: watch('category'),
    location: watch('location'),
    guestCount: watch('guestCount'),
    roomCount: watch('roomCount'),
    bathroomCount: watch('bathroomCount'),
    imageSrc: watch('imageSrc'),
    price: watch('price'),
    title: watch('title'),
    description: watch('description'),
  });

  const Map = useMemo(
    () =>
      dynamic(() => import('../Map'), {
        ssr: false,
      }),
    []
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    // Update the onBack function to handle going back to the previous step.
    if (step === STEPS.CATEGORY) {
      // Close the modal or perform any other action you want.
      propertyModal.onClose();
    } else {
      setStep((value) => value - 1);
    }
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Check if listingData exists before making the API call
    if (listingData) {
      axios
        .patch(`/api/listings/${listingData.id}`, data)
        .then(() => {
          toast.success('Property Details Updated!');
          router.refresh();
          reset();
          setStep(STEPS.CATEGORY);
          propertyModal.onClose();
        })
        .catch(() => {
          toast.error('Something went wrong');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Handle the case where listingData is undefined (optional)
      toast.error('Listing data is missing. Cannot update property details.');
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    switch (step) {
      case STEPS.CATEGORY:
        return 'Next'; // 'Next' for the first step
      case STEPS.LOCATION:
        return 'Next'; // 'Next' for the 'Location' step
      case STEPS.INFO:
        return 'Next'; // 'Next' for the 'Info' step
      case STEPS.IMAGES:
        return 'Next'; // 'Next' for the 'Images' step
      case STEPS.DESCRIPTION:
        return 'Next'; // 'Next' for the 'Description' step
      case STEPS.PRICE:
        return 'Update'; // 'Update' for the final step
      default:
        return 'Next';
    }
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    // Define secondaryActionLabel for each step.
    switch (step) {
      case STEPS.CATEGORY:
        return undefined;
      case STEPS.LOCATION:
        return 'Back to Category';
      case STEPS.INFO:
        return 'Back to Location';
      case STEPS.IMAGES:
        return 'Back to Info';
      case STEPS.DESCRIPTION:
        return 'Back to Images';
      case STEPS.PRICE:
        return 'Back to Description';
      default:
        return undefined;
    }
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-4 px-2">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
      {secondaryActionLabel && (
        <Button
          label={secondaryActionLabel}
          disabled={isLoading}
          onClick={onBack}
          outline // Add outline style to the Back button
        />
      )}
      <Button label={actionLabel} disabled={!category} onClick={onNext} />
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guest find your property!"
        />
        <CountrySelect
          value={getByValue(location)}
          onChange={(value) => setCustomValue('location', value)}
        />
        <Map center={location?.latlng} />
        <div className="mt-10 flex gap-2">
          <Button
            label={secondaryActionLabel || 'Back'} // Use secondaryActionLabel for 'Back'
            disabled={isLoading}
            onClick={onBack}
            outline // Add outline style to the Back button
          />
          <Button
            label={actionLabel} // Add 'Next' button on the 'Location' step
            onClick={onNext}
            disabled={!location}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          title="Guests"
          subtitle="How many guests are allowed?"
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount', value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms are available?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms are there?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
        />
        <div className="mt-10 flex gap-2">
          <Button
            label={secondaryActionLabel || 'Back'} // Use secondaryActionLabel for 'Back'
            disabled={isLoading}
            onClick={onBack}
            outline // Add outline style to the Back button
          />
          <Button
            label={actionLabel} // Add 'Next' button on the 'Location' step
            disabled={isLoading}
            onClick={onNext}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photo of your place"
          subtitle="Show guest what your place looks like!"
        />

        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc}
        />

        <div className="mt-10 flex gap-2">
          <Button
            label={secondaryActionLabel || 'Back'} // Use secondaryActionLabel for 'Back'
            disabled={isLoading}
            onClick={onBack}
            outline // Add outline style to the Back button
          />
          <Button
            label={actionLabel} // Add 'Next' button on the 'Location' step
            disabled={!imageSrc}
            onClick={onNext}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place"
          subtitle="Short and minimal works the best"
        />

        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <div className="mt-10 flex gap-2">
          <Button
            label={secondaryActionLabel || 'Back'} // Use secondaryActionLabel for 'Back'
            disabled={isLoading}
            onClick={onBack}
            outline // Add outline style to the Back button
          />
          <Button
            label={actionLabel} // Add 'Next' button on the 'Location' step
            disabled={!title || !description}
            onClick={onNext}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set the price"
          subtitle="How much do you charge per night?"
        />

        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <div className="mt-10 flex gap-2">
          <Button
            label={secondaryActionLabel || 'Back'} // Use secondaryActionLabel for 'Back'
            disabled={isLoading}
            onClick={onBack}
            outline // Add outline style to the Back button
          />
          <Button
            label={actionLabel} // Add 'Next' button on the 'Location' step
            disabled={isLoading || !price}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      title={
        <>
          Edit{' '}
          <span className="italic text-slate-800">{listingData.title}</span>{' '}
          property details
        </>
      }
      isOpen={propertyModal.isOpen}
      onClose={propertyModal.onClose}
    >
      <div>
        <hr />
        <div className="space-y-4 py-2 pb-4">{bodyContent}</div>
      </div>
    </Modal>
  );
};
