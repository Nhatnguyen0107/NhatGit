import { Provider } from 'react-redux';
import { store } from '@/features/store';
import { AppRouter } from '@/routes';
import { AvatarProvider } from '@/contexts/AvatarContext';
import '@/index.css';

function App() {
  return (
    <Provider store={store}>
      <AvatarProvider>
        <AppRouter />
      </AvatarProvider>
    </Provider>
  );
}

export default App;
