import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';

export class GetCountryParam {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  countryName: string;
}
