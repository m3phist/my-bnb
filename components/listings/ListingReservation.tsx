'use client';

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../Button';

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  dayCount: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  dayCount,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
}) => {
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-1 p-4">
        <div>$ {price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      {dayCount !== 0 && <hr />}

      {dayCount !== 0 ? (
        <div>
          <div className="p-4 flex items-center justify-between font-semibold text-lg">
            <div>Total</div>
            <div>
              $ {totalPrice}{' '}
              <span className="inline-block align-baseline font-light text-sm text-neutral-600">
                {dayCount === 0 ? '' : `${dayCount}`}{' '}
                {dayCount === 0 ? '' : dayCount === 1 ? 'night' : 'nights'}
              </span>
            </div>
          </div>
          <div className="p-4">
            <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ListingReservation;
