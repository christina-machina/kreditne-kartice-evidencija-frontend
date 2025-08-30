import { RouteObject } from 'react-router-dom';
import Pregled from './Features/evidencije/kreditnekartice/klijenti/pregled/Pregled';
import Pretraga from './Features/evidencije/kreditnekartice/klijenti/pretraga/Pretraga';

export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Pretraga />,
  },
  {
    path: 'pregled/:id',
    element: <Pregled />,
  },
];

export default AppRoutes;