import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { dohvatiStatuse, unesi } from '../KlijentiService';
import StatusKarticeResponse from '../response/StatusKarticeResponse';
import { DropdownStatus } from '../common/DropdownStatus';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { InferType } from 'yup';
import KlijentRequest from '../request/KlijentRequest';
import { AxiosError } from 'axios';
import OsnovniResponse from '../response/OsnovniResponse';
import KlijentResponse from '../response/KlijentResponse';
import { Toast } from 'primereact/toast';
import TipPoruke from '../model/TipPoruke';


const schema = Yup.object().shape({
  ime: Yup.string().nullable(),
  prezime: Yup.string().nullable(),
  oib: Yup.string().nullable(),
  statusKarticeSifra: Yup.string().nullable(),
});
export type FormType = InferType<typeof schema>;

const Unos = () => {
  const [statusi, setStatusi] = useState<StatusKarticeResponse>();
  const [response, setResponse] = useState<KlijentResponse>();

  const {
    reset,
    control,
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormType>();
  const toast = useRef<Toast>(null);

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
      setResponse(res);
      res?.poruke.forEach((poruka) => {
        if (poruka.tip === TipPoruke.USPJEH) {
          toast.current?.show({
            severity: 'success',
            detail: poruka.opis,
            life: 3000,
          });
          reset();
        }
      });

      res?.poruke?.forEach((poruka) => {
        if (poruka.tip === TipPoruke.GRESKA && poruka.sifra) {
          console.log(poruka);
          setError(poruka.sifra as keyof FormType, {
            type: 'server',
            message: poruka.opis,
          });
        }
      });
    } catch (e) {
      const error = e as AxiosError<OsnovniResponse>;
      console.log(error);
    }
  };

  const onFormError = (error: any) => {
    console.log(error);
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)} onError={onFormError}>
        <div className="flex flex-column align-items-center card gap-2">
          <div className={'flex flex-column gap-1'}>
            <FloatLabel>
              <InputText id="ime" {...register('ime')} />
              <label htmlFor="ime">Ime</label>
            </FloatLabel>
            {errors.ime && <small className="p-error">{errors.ime.message}</small>}
          </div>
          <div className={'flex flex-column gap-1'}>
            <FloatLabel>
              <InputText id="prezime" {...register('prezime')} />
              <label htmlFor="preziime">Prezime</label>
            </FloatLabel>
            {errors.prezime && <small className="p-error">{errors.prezime.message}</small>}
          </div>
          <div className={'flex flex-column gap-1'}>
            <FloatLabel>
              <InputText id="oib" {...register('oib')} />
              <label htmlFor="oib">OIB</label>
            </FloatLabel>
            {errors.oib && <small className="p-error">{errors.oib.message}</small>}
          </div>
          <div className={'flex flex-column gap-1 w-15rem'}>
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
          <div className={'flex flex-column gap-1'}>
            <Button label="Unesi" type={'submit'}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Unos;