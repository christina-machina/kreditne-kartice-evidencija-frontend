import OsnovniResponse from './OsnovniResponse';
import SifraOpis from '../model/SifraOpis';

interface KlijentResponse extends OsnovniResponse {
  id: number;
  oib: string;
  ime: string;
  prezime: string;
  statusKartice: SifraOpis;
}

export default KlijentResponse;