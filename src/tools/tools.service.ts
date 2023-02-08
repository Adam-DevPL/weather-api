import { Injectable } from '@nestjs/common';

@Injectable()
export class ToolsService {
  public getAverage = (arr: number[]): number => {
    return arr.reduce((acc, item) => acc + item, 0) / arr.length;
  };

  public mostFrequent = (arr: number[]): string =>
    Object.entries(
      arr.reduce((a, v) => {
        a[v] = a[v] ? a[v] + 1 : 1;
        return a;
      }, {}),
    ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];

  public getWeatherCode = (code: number): string => {
    switch (code) {
      case 0:
        return 'Clear sky';
      case 1:
      case 2:
      case 3:
        return 'Mainly clear, partly cloudy, and overcast';
      case 45:
      case 48:
        return 'Fog and depositing rime fog';
      case 51:
      case 53:
      case 55:
        return 'Drizzle: Light, moderate, and dense intensity';
      case 56:
      case 57:
        return 'Freezing Drizzle: Light and dense intensity';
      case 61:
      case 63:
      case 65:
        return 'Rain: Slight, moderate and heavy intensity';
      case 66:
      case 67:
        return 'Freezing Rain: Light and heavy intensity';
      case 71:
      case 73:
      case 75:
        return 'Snow fall: Slight, moderate, and heavy intensity';
      case 77:
        return 'Snow grains';
      case 80:
      case 81:
      case 82:
        return 'Rain showers: Slight, moderate, and violent';
      case 85:
      case 86:
        return 'Snow showers slight and heavy';
      case 95:
        return 'Thunderstorm: Slight or moderate';
      case 96:
      case 99:
        return 'Thunderstorm with slight and heavy hail';
      default:
        return 'No more weather details';
    }
  };
}
