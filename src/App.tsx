import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <HomePage searchQuery={searchQuery} />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;