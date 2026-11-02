import { HomePage } from './pages/HomePage';
import { StackerPage } from './Tools/Stacker/pages/StackerPage';

export default function App() {
  return window.location.pathname === '/tools/stacker' ? <StackerPage /> : <HomePage />;
}
