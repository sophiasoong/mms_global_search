import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SearchModal from './components/SearchModal';
import SearchResults from './components/SearchResults';

type View = 'dashboard' | 'search-results';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search-results');
    setIsSearchOpen(false);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header 
          onSearchClick={() => setIsSearchOpen(true)} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' ? (
            <Dashboard />
          ) : (
            <SearchResults query={searchQuery} onBack={handleBackToDashboard} />
          )}
        </main>
      </div>

      {/* Full-page Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSearchSubmit={handleSearchSubmit}
      />
    </div>
  );
}
