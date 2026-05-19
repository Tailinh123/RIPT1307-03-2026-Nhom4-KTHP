import { AuthProvider } from './features/auth/context/AuthContext';
import { AppRoutes } from './app/router/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
