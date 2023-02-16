import { GeoCoordinates } from 'src/types/app.types';

export type ForecastResponse = {
  location: string | GeoCoordinates;
  weatherInfo: WeatherInfo | WeatherInfo[];
};

export type WeatherInfo = {
  day: string;
  avgTemperature: string;
  weather: string;
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

export type ApiResponsePredictRoute = {
  timeArr: string[];
  temperatureArr: number[];
  weatherCodeArr: number[];
};
