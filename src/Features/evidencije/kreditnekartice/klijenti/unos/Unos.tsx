import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { dohvatiStatuse, unesi } from '../KlijentiService';
import StatusKarticeResponse from '../response/StatusKarticeResponse';
import { DropdownStatus } from '../common/DropdownStatus';
import { Controller, FieldValues, useForm, UseFormSetError } from 'react-hook-form';
import * as Yup from 'yup';
import { InferType } from 'yup';
import KlijentRequest from '../request/KlijentRequest';
import { AxiosError } from 'axios';
import OsnovniResponse from '../response/OsnovniResponse';
import TipPoruke from '../model/TipPoruke';
import Poruka from '../model/Poruka';

const schema = Yup.object().shape({
  ime: Yup.string().nullable(),
  prezime: Yup.string().nullable(),
  oib: Yup.string().nullable(),
  statusKarticeSifra: Yup.string().nullable(),
});
export type FormType = InferType<typeof schema>;

interface UnosProps {
  setVisible: (value: boolean) => void,
  prikaziPoruke: <TFieldValues extends FieldValues>(
    poruke: Poruka[],
    setError: UseFormSetError<TFieldValues>,
  ) => void;
}

const Unos = ({ setVisible, prikaziPoruke }: UnosProps) => {
  const [statusi, setStatusi] = useState<StatusKarticeResponse>();

  const {
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormType>();

  useEffect(() => {
    dohvatiStatuse().then(setStatusi);
  }, []);

  const onSubmit = async (data: FormType) => {
    const request = {
      oib: data.oib,
      ime: data.ime,
      prezime: data.prezime,
      statusKarticeSifra: data.statusKarticeSifra,
    } as KlijentRequest;

    try {
      const res = await unesi(request);
      prikaziPoruke<FormType>(res?.poruke, setError);
      if (res.poruke?.some(p => p.tip === TipPoruke.GRESKA)) {
        return;
      }
      setVisible(false);
    } catch (e) {
      const error = e as AxiosError<OsnovniResponse>;
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}
          className="flex flex-column card gap-3 p-3 align-items-center">
      <h3 className="text-center">Unos novog klijenta</h3>

      <div className="flex flex-column gap-1">
        <FloatLabel>
          <InputText id="ime" {...register('ime')}  />
          <label htmlFor="ime">Ime</label>
        </FloatLabel>
        {errors.ime && <small className="p-error">{errors.ime.message}</small>}
      </div>

      <div className="flex flex-column gap-1">
        <FloatLabel>
          <InputText id="prezime" {...register('prezime')}/>
          <label htmlFor="prezime">Prezime</label>
        </FloatLabel>
        {errors.prezime && <small className="p-error">{errors.prezime.message}</small>}
      </div>

      <div className="flex flex-column gap-1">
        <FloatLabel>
          <InputText id="oib" {...register('oib')} />
          <label htmlFor="oib">OIB</label>
        </FloatLabel>
        {errors.oib && <small className="p-error">{errors.oib.message}</small>}
      </div>

      <div className="flex flex-column gap-1 w-16rem">
        <Controller
          name="statusKarticeSifra"
          control={control}
          render={({ field }) => (
            <DropdownStatus
              value={statusi?.statusi.find(s => s.sifra === field.value) || null}
              onChange={(v) => field.onChange(v?.sifra)}
              statusi={statusi?.statusi}
            />
          )}
        />
        {errors.statusKarticeSifra &&
          <small className="p-error">{errors.statusKarticeSifra.message}</small>}
      </div>

      <Button label="Unesi" type="submit" className="mt-2" />
    </form>
  );
};

export default Unos;