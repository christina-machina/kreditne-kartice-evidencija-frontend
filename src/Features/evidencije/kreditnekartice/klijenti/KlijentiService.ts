import StatusKarticeResponse from './response/StatusKarticeResponse';
import axios from 'axios';
import { API_BASE_URL } from './common/Konstante';
import KlijentResponse from './response/KlijentResponse';
import KlijentRequest from './request/KlijentRequest';

export async function dohvatiStatuse() {
  const res = await axios.get<StatusKarticeResponse>(
    API_BASE_URL + '/api/statusi-kartice/izbornik/statusi',
  );
  return res.data;
}

export async function unesi(request: KlijentRequest) {
  const res = await axios.post<KlijentResponse>(
    API_BASE_URL + '/api/klijenti',
    request,
  );
  return res.data;
}
