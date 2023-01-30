export class FetchDataApi {
  private static url = 'https://api.weatherstack.com/current';
  private static weatherApi = 'd203f24abc57cfb788c3f51154affdc2';

  public static getDataFromApi(query: any): any {
    const params = {
      access_ley: this.weatherApi,
      query,
    };

  }
}
