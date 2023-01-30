import { IsAlpha, IsNotEmpty } from 'class-validator';

export class GetCountryParam {
  @IsNotEmpty()
  @IsAlpha()
  countryName: string;
}
