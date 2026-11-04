import { HomePage } from './pages/HomePage';
import { MarkpadPage } from './Tools/Markpad/pages/MarkpadPage';
import { ComposeLabPage } from './Tools/ComposeLab/pages/ComposeLabPage';
import { StackerPage } from './Tools/Stacker/pages/StackerPage';

export default function App() {
  if (window.location.pathname === '/tools/markpad') return <MarkpadPage />;
  if (window.location.pathname === '/tools/composelab') return <ComposeLabPage />;
  return window.location.pathname === '/tools/stacker' ? <StackerPage /> : <HomePage />;
}
