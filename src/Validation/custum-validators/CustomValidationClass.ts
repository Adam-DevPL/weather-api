import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customDate', async: false })
export class CustomDateRange implements ValidatorConstraintInterface {
  validate(date: string) {
    const dateParam = new Date(date);
    const now = new Date();
    const day: number = 60 * 60 * 24 * 1000;
    const minRangeDate = new Date(new Date(now.getTime() + day).toDateString());
    const maxDateRange = new Date(
      new Date(now.getTime() + 7 * day).toDateString(),
    );

    return dateParam > minRangeDate && dateParam <= maxDateRange;
  }

  defaultMessage() {
    return `Date is out of range: min +1 day and max +7 days`;
  }
}

@ValidatorConstraint({ name: 'customCoordinates', async: false })
export class CustomCoordinatesRange implements ValidatorConstraintInterface {
  validate(value: number) {
    return value >= -180 && value <= 180;
  }

  defaultMessage() {
    return `Latitude and longitude must be in range -180 < x < 180`;
  }
}
