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

export async function pretrazi(oib: string | undefined) {
  const res = await axios.get<KlijentResponse>(
    API_BASE_URL + `/api/klijenti/${oib}`,
  );
  return res.data;
}

export async function obrisi(oib: string | undefined) {
  const res = await axios.delete<KlijentResponse>(
    API_BASE_URL + `/api/klijenti/${oib}`,
  );
  return res.data;
}
