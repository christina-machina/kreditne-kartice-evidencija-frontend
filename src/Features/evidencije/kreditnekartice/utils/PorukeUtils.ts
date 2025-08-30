import Poruka from '../klijenti/model/Poruka';
import { Toast } from 'primereact/toast';
import TipPoruke from '../klijenti/model/TipPoruke';

export function handlePoruke<TFieldValues>(
  poruke: Poruka[] | undefined,
  setError: (name: keyof TFieldValues, error: { type: string; message: string }) => void,
  toast: React.RefObject<Toast | null>,
) {
  if (!poruke) return;

  const greskePoSifri: Record<string, string[]> = {};

  poruke.forEach((poruka) => {
    if (!poruka.sifra) {
      toast.current?.show({
        severity: poruka.tip === TipPoruke.USPJEH ? 'success' : 'error',
        detail: poruka.opis,
        life: 3000,
      });
    } else {
      if (!greskePoSifri[poruka.sifra]) {
        greskePoSifri[poruka.sifra] = [];
      }
      greskePoSifri[poruka.sifra].push(poruka.opis);
    }
  });


  Object.entries(greskePoSifri).forEach(([sifra, opis]) => {
    setError(sifra as keyof TFieldValues, {
      type: 'server',
      message: opis.join('. '),
    });
  });
}

