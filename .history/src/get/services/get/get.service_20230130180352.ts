import { Injectable } from '@nestjs/common';
import { FetchDataApiService } from 'src/utils/fetch-data-api/fetch-data-api.service';

@Injectable()
export class GetService {
  constructor(private fetchDataApi: FetchDataApiService) {}
}
