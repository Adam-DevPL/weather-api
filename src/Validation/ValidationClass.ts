import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import {
  CustomCoordinatesRange,
  CustomDateRange,
} from './CustomValidationClass';

export class CountryParam {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  country: string;
}

export class CityParam {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  city: string;
}

export class GeoCoordinatesParam {
  @IsNumber()
  @Type(() => Number)
  @Validate(CustomCoordinatesRange)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  @Validate(CustomCoordinatesRange)
  lon: number;
}

export class CountryDayParam extends CountryParam {
  @IsDateString()
  @Validate(CustomDateRange)
  day: string;
}

export class CityDayParam extends CityParam {
  @IsDateString()
  @Validate(CustomDateRange)
  day: string;
}

export class CountryDatesRangeParam extends CountryParam {
  @IsDateString()
  @Validate(CustomDateRange)
  from: string;

  @IsDateString()
  @Validate(CustomDateRange)
  to: string;
}

export class CityDatesRangeParam extends CityParam {
  @IsDateString()
  @Validate(CustomDateRange)
  from: string;

  @IsDateString()
  @Validate(CustomDateRange)
  to: string;
}

export class GeoCoordinatesDatesRangeParam extends GeoCoordinatesParam {
  @IsDateString()
  @Validate(CustomDateRange)
  from: string;

  @IsDateString()
  @Validate(CustomDateRange)
  to: string;
}
