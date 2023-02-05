export type PredictionForecastResponse = {
  location?: string;
  day: string;
  avgTemperature: string;
  weather: string;
};

export type PredictionRouteCountryDayParams = {
  day: string;
  country: string;
};
