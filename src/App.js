
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CookiesProvider } from 'react-cookie'
import Page from './components/page/page'

export default function App() {
  return (
    <CookiesProvider>
      <DndProvider backend={HTML5Backend}>
        <Page/>
      </DndProvider>
    </CookiesProvider>
  );
}
