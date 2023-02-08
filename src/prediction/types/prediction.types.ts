export type PredictionForecastResponse = {
  location: string | GeoCoordinates;
  weatherInfo: WeatherInfo | WeatherInfo[];
};

export type WeatherInfo = {
  day: string;
  avgTemperature: string;
  weather: string;
};

export type PredictionRouteLocationSingleDayParam = {
  day: string;
  locationType: LocationType;
  locationName: string;
};

export type PredictionRouteLocationDateRangeParams =
  | {
      locationType: LocationType.Geo;
      locationParam: GeoCoordinates;
      from: string;
      to: string;
    }
  | {
      locationType: LocationType.City | LocationType.Country;
      locationParam: string;
      from: string;
      to: string;
    };

export type GeoCoordinates = {
  lat: number;
  lon: number;
};

export enum LocationType {
  City,
  Country,
  Geo,
}

export type PredictionDataObject = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type OpenModelResponse = {
  data: {
    hourly: {
      time: string[];
      temperature_2m: number[];
      weathercode: number[];
    };
  };
};
