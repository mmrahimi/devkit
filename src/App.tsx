import { HomePage } from './pages/HomePage';
import { MarkpadPage } from './Tools/Markpad/pages/MarkpadPage';
import { StackerPage } from './Tools/Stacker/pages/StackerPage';

export default function App() {
  if (window.location.pathname === '/tools/markpad') return <MarkpadPage />;
  return window.location.pathname === '/tools/stacker' ? <StackerPage /> : <HomePage />;
}
