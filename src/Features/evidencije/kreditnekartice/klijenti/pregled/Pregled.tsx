import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { obrisi } from '../KlijentiService';
import { useForm } from 'react-hook-form';

const Pregled = () => {
  const location = useLocation();
  const klijent = location.state.klijent;
  const navigate = useNavigate();

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    const res = await obrisi(klijent.oib);
    navigate('/', {
      state: { poruke: res.poruke },
    });
  };

  return (
    <div className="p-4 flex flex-column align-items-center gap-4">
      <h2>Pregled klijenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-2 w-25rem card p-3">
        <label>Ime: <b>{klijent.ime}</b></label>
        <label>Prezime: <b>{klijent.prezime}</b></label>
        <label>OIB: <b>{klijent.oib}</b></label>
        <label>Status kartice: <b>{klijent.statusKartice.opis}</b></label>

        <Button label="Obriši klijenta" severity="danger"
                className="w-10rem mt-3" />
      </form>
    </div>
  );
};

export default Pregled;