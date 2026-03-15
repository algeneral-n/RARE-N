import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Verify from './pages/Verify.jsx';
import Home from './pages/Home';
import RareCodec from './pages/RareCodec';
import RareHub from './pages/RareHub';
import MyRare from './pages/MyRare';
import RareVault from './pages/RareVault';
import RareConnect from './pages/RareConnect';
import RareMap from './pages/RareMap';
import Settings from './pages/Settings';
import AppLayout from './components/AppLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    else if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Verify" replace />} />
      <Route path="/Verify" element={<Verify />} />

      {/* App with global layout */}
      <Route element={<AppLayout />}>
        <Route path="/Home" element={<Home />} />
        <Route path="/RareCodec" element={<RareCodec />} />
        <Route path="/RareHub" element={<RareHub />} />
        <Route path="/MyRare" element={<MyRare />} />
        <Route path="/RareVault" element={<RareVault />} />
        <Route path="/RareConnect" element={<RareConnect />} />
        <Route path="/RareMap" element={<RareMap />} />
        <Route path="/Settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App