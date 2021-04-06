
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { CookiesProvider } from 'react-cookie'
import Page from './components/page/page'

export default function App() {
  return (
    <CookiesProvider>
      <Page/>
    </CookiesProvider>
  );
}
