import { Dropdown } from 'primereact/dropdown';
import SifraOpis from '../model/SifraOpis';

interface DropdownStatusProps {
  value: SifraOpis | null;
  onChange: (value: SifraOpis | null) => void;
  statusi: SifraOpis[] | undefined;
}

export const DropdownStatus = ({
                                 value,
                                 onChange,
                                 statusi,
                               }: DropdownStatusProps) => {
  return (
    <Dropdown
      value={value?.sifra ?? null}
      options={statusi}
      optionLabel="opis"
      optionValue="sifra"
      placeholder={'Odaberite status'}
      onChange={(e) => onChange(statusi?.find((s) => s.sifra === e.value) || null)}
    />
  );
};
