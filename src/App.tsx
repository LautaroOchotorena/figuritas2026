import { useEffect } from 'react';
import { useUIStore } from './store/uiStore';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AlbumView from './components/album/AlbumView';
import TeamDetail from './components/album/TeamDetail';
import ManualInput from './components/input/ManualInput';
import VoiceInput from './components/input/VoiceInput';
import BulkInput from './components/input/BulkInput';
import ToastContainer from './components/ui/Toast';
import SettingsModal from './components/ui/SettingsModal';

export default function App() {
  const theme = useUIStore((s) => s.theme);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Header />
      <div className="app-layout">
        <main className="main-content">
          <ManualInput />
          <AlbumView />
        </main>
        <Sidebar />
      </div>
      <TeamDetail />
      <BulkInput />
      <SettingsModal />
      <VoiceInput />
      <ToastContainer />
    </>
  );
}
