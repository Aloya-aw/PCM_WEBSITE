import { useState, useEffect } from 'react'
import SubscriptionModal from './components/SubscriptionModal'
import './App.css'

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setModalOpen(true), 2000); //Show pop-up after 2 seconds
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to My Website</h1>
      <SubscriptionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default App
