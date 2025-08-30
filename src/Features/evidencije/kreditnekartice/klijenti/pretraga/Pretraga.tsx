import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import * as Yup from 'yup';
import { InferType } from 'yup';
import { pretrazi } from '../KlijentiService';
import { handlePoruke } from '../../utils/PorukeUtils';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import TipPoruke from '../model/TipPoruke';
import { Dialog } from 'primereact/dialog';
import Unos from '../unos/Unos';
import Poruka from '../model/Poruka';


const schema = Yup.object().shape({
  oib: Yup.string(),
});
export type FormType = InferType<typeof schema>;

const Pretraga = () => {
  const [visible, setVisible] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormType>();

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (location.state?.poruke) {
      handlePoruke(location.state.poruke, () => {
      }, toast);
    }
  }, [location.state]);

  const onSubmit = async (data: FormType) => {
    const res = await pretrazi(data.oib);
    handlePoruke<FormType>(res?.poruke, setError, toast);
    if (res.poruke?.some(p => p.tip === TipPoruke.GRESKA)) {
      return;
    }
    navigate(`/pregled/${res.id}`, {
      state: { klijent: res },
    });
  };

  function prikaziPoruke<TFieldValues>(poruke: Poruka[], setError: (name: keyof TFieldValues, error: {
    type: string;
    message: string
  }) => void) {
    handlePoruke<TFieldValues>(poruke, setError, toast);
  }

  return (
    <div className="p-4 flex flex-column align-items-center gap-4">
      <Toast ref={toast} />

      <div className="w-full flex justify-content-end mb-4">
        <Button
          label="Unesi novog klijenta"
          icon="pi pi-plus"
          severity="success"
          onClick={() => setVisible(true)}
        />
      </div>

      <h2 className="text-center w-full mb-2">Pretraga klijenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3 w-25rem mt-4">
        <div className="flex flex-column gap-1">
          <FloatLabel>
            <InputText id="oib" {...register('oib')} className={'w-full'} />
            <label htmlFor="oib">OIB</label>
          </FloatLabel>
          {errors.oib && <small className="p-error">{errors.oib.message}</small>}
        </div>
        <Button label="Pretraži" type="submit" className="w-full" />
      </form>

      <Dialog header="Unos klijenta" visible={visible} style={{ width: '35vw' }}
              onHide={() => setVisible(false)}>
        <Unos setVisible={setVisible} prikaziPoruke={prikaziPoruke} />
      </Dialog>
    </div>

  );
};

export default Pretraga;