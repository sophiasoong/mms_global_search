import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  Package, 
  Ticket, 
  FileText, 
  ChevronRight,
  ExternalLink,
  Eye,
  Menu,
  ListFilter,
  Store,
  User,
  CreditCard,
  Settings,
  ShoppingCart,
  Calendar,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addMonths, isAfter, isBefore, startOfDay, endOfDay, subMonths, differenceInMonths } from 'date-fns';

import { products, promotions, pageLinks } from '../data/mockData';
import { SearchResult, SearchResultType } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit: (query: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSearchSubmit }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({
    start: null,
    end: null
  });
  const [searchHistory, setSearchHistory] = useState<{keyword: string, category: string}[]>([
    { keyword: 'Coffee', category: 'Product' },
    { keyword: 'Promotion 2026', category: 'Promotion' },
    { keyword: 'Inventory', category: 'All' }
  ]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.testId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPromotions = promotions.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPageLinks = pageLinks.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateRelevance = (text: string, query: string): number => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    if (lowerText === lowerQuery) return 100;
    if (lowerText.startsWith(lowerQuery)) return 80;
    
    const words = lowerText.split(/[\s/]+/);
    if (words.some(w => w === lowerQuery)) return 75;
    if (words.some(w => w.startsWith(lowerQuery))) return 65;
    
    if (lowerText.includes(lowerQuery)) return 50;
    return 0;
  };

  const combinedResults = React.useMemo(() => {
    if (!searchQuery.trim() || activeTab !== 'All') return [];

    const results: SearchResult[] = [];

    filteredProducts.forEach(p => {
      const score = Math.max(
        calculateRelevance(p.name, searchQuery),
        calculateRelevance(p.code, searchQuery),
        calculateRelevance(p.testId, searchQuery)
      );
      results.push({
        id: `product-${p.id}`,
        type: 'Product',
        title: p.name,
        subtitle: p.code,
        metadata: [p.testId],
        relevance: score,
        originalData: p
      });
    });

    filteredPromotions.forEach(p => {
      const score = Math.max(
        calculateRelevance(p.name, searchQuery),
        calculateRelevance(p.code, searchQuery),
        calculateRelevance(p.date, searchQuery)
      );
      results.push({
        id: `promo-${p.id}`,
        type: 'Promotion',
        title: p.name,
        subtitle: p.code,
        metadata: [p.status, p.date],
        relevance: score,
        originalData: p
      });
    });

    filteredPageLinks.forEach(p => {
      const score = calculateRelevance(p.title, searchQuery);
      results.push({
        id: `page-${p.id}`,
        type: 'Page Link',
        title: p.title,
        relevance: score,
        originalData: p
      });
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }, [searchQuery, activeTab, filteredProducts, filteredPromotions, filteredPageLinks]);

  const hasAnyResults = filteredProducts.length > 0 || filteredPromotions.length > 0 || filteredPageLinks.length > 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { 
      label: searchQuery ? `Product ${filteredProducts.length}` : 'Product', 
      value: 'Product',
      icon: <Package size={14} />
    },
    { 
      label: searchQuery ? `Promotion ${filteredPromotions.length}` : 'Promotion', 
      value: 'Promotion',
      icon: <Ticket size={14} />
    },
    { 
      label: searchQuery ? `Page Link ${filteredPageLinks.length}` : 'Page Link', 
      value: 'Page Link',
      icon: <FileText size={14} />
    },
  ];

  const dateLabel = dateRange.start && dateRange.end 
    ? `${format(dateRange.start, 'yyyy/MM/dd')} - ${format(dateRange.end, 'yyyy/MM/dd')}`
    : 'Last Update Time';

  const expandedFilters = [
    { label: 'Store', value: 'Store', icon: <Store size={14} /> },
    { label: 'Account', value: 'Account', icon: <User size={14} /> },
    { label: 'Payment', value: 'Payment', icon: <CreditCard size={14} /> },
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveTab('All');
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const exists = searchHistory.some(h => h.keyword === searchQuery.trim() && h.category === activeTab);
      if (!exists) {
        setSearchHistory([{ keyword: searchQuery.trim(), category: activeTab }, ...searchHistory.slice(0, 4)]);
      }
      onSearchSubmit(searchQuery.trim());
    }
  };

  const handleHistoryClick = (item: {keyword: string, category: string}) => {
    setSearchQuery(item.keyword);
    setActiveTab(item.category);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 text-inherit p-0 rounded-sm">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center pt-2"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="w-full max-w-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col mt-2 h-fit min-h-[300px]"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#5244EE] transition-all">
                <Search size={18} className="text-gray-400 shrink-0" />
                
                <div className="flex items-center gap-2 ml-3 flex-1">
                  {activeTab !== 'All' && (
                    <div className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-sm font-medium animate-in fade-in zoom-in duration-200 whitespace-nowrap shrink-0">
                      {activeTab === 'Product' && <Package size={14} className="text-gray-500" />}
                      {activeTab === 'Promotion' && <Ticket size={14} className="text-gray-500" />}
                      {activeTab === 'Page Link' && <FileText size={14} className="text-gray-500" />}
                      {activeTab === 'Store' && <Store size={14} className="text-gray-500" />}
                      {activeTab === 'Account' && <User size={14} className="text-gray-500" />}
                      {activeTab === 'Payment' && <CreditCard size={14} className="text-gray-500" />}
                      {activeTab}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('All')}
                        className="hover:bg-gray-300 rounded-full p-0.5 transition-colors ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <input 
                    autoFocus
                    type="text"
                    placeholder={
                      activeTab === 'Product' ? '搜尋 SKU ID / SKU 名稱 / 產品 ID' :
                      activeTab === 'Promotion' ? '搜尋活動名稱 / 活動編碼 / SKU ID' :
                      activeTab === 'Page Link' ? '搜尋分頁關鍵字' :
                      '搜尋'
                    }
                    className="bg-transparent border-none w-full text-base outline-none py-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {(searchQuery !== '' || activeTab !== 'All') && (
                    <button 
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"
                    >
                      <X size={18} className="bg-[#5244EE] text-white rounded-full p-0.5" />
                    </button>
                  )}
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <button 
                    type="button"
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className={`p-1 rounded-lg transition-colors ${isFilterExpanded ? 'bg-[#5244EE]/10 text-[#5244EE]' : 'text-gray-400 hover:bg-gray-100'}`}
                  >
                    <ListFilter size={18} />
                  </button>
                </div>
              </form>

            {/* Filters / Tags */}
            <div className="mt-4 flex flex-col gap-3">
              {(activeTab === 'All' || searchQuery !== '') && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
                  {tabs
                    .filter(tab => {
                      if (searchQuery === '') return true;
                      
                      // Hide if result count is 0
                      const count = tab.value === 'Product' ? filteredProducts.length :
                                   tab.value === 'Promotion' ? filteredPromotions.length :
                                   tab.value === 'Page Link' ? filteredPageLinks.length : 0;
                      
                      if (count === 0 && activeTab !== tab.value) return false;
                      
                      return activeTab === 'All' || tab.value === activeTab;
                    })
                    .map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                          activeTab === tab.value 
                          ? 'bg-[#5244EE] text-white' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  
                  {searchQuery !== '' && (
                    <button
                      onClick={() => setIsDatePickerOpen(true)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                        dateRange.start 
                        ? 'bg-[#5244EE] text-white' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <Calendar size={14} />
                      {dateLabel}
                      {dateRange.start && (
                        <X 
                          size={14} 
                          className="ml-1 hover:bg-white/20 rounded-full" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange({ start: null, end: null });
                          }}
                        />
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Inline Date Picker */}
              <AnimatePresence>
                {isDatePickerOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50 rounded-2xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">選擇更新時間</h3>
                      <button onClick={() => setIsDatePickerOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">開始日期</label>
                        <input 
                          type="date" 
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5244EE]"
                          value={dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setDateRange(prev => ({ ...prev, start: date }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">結束日期</label>
                        <input 
                          type="date" 
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#5244EE]"
                          value={dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setDateRange(prev => ({ ...prev, end: date }));
                          }}
                        />
                      </div>
                    </div>
                    
                    {dateRange.start && dateRange.end && differenceInMonths(dateRange.end, dateRange.start) > 3 && (
                      <div className="mt-3 text-[11px] text-red-500 bg-red-50 p-2 rounded-lg flex items-center gap-2 border border-red-100">
                        <X size={12} className="shrink-0" />
                        <span>日期範圍不能超過 3 個月</span>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => {
                          setDateRange({ start: null, end: null });
                          setIsDatePickerOpen(false);
                        }}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-gray-500 bg-gray-200 hover:bg-gray-300 transition-all"
                      >
                        重設
                      </button>
                      <button 
                        disabled={!dateRange.start || !dateRange.end || (dateRange.start && dateRange.end && isAfter(dateRange.start, dateRange.end)) || differenceInMonths(dateRange.end, dateRange.start) > 3}
                        onClick={() => setIsDatePickerOpen(false)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-white bg-[#5244EE] hover:bg-[#4336D7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        確認
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(isFilterExpanded && searchQuery === '') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="flex flex-col gap-2 overflow-hidden"
                >
                  <div className="w-full text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">更多篩選</div>
                  <div className="flex flex-wrap gap-2">
                    {expandedFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setActiveTab(filter.value);
                          setIsFilterExpanded(false);
                        }}
                        className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                          activeTab === filter.value 
                          ? 'bg-[#5244EE] text-white' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {filter.icon}
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              {searchQuery === '' ? (
                activeTab === 'All' ? (
                  <div className="p-4 space-y-8">
                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4 px-2">
                          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">搜尋紀錄</div>
                          <button 
                            onClick={handleClearHistory}
                            className="text-sm font-medium text-[#5244EE] hover:underline"
                          >
                            清除紀錄
                          </button>
                        </div>
                        <div className="flex flex-col gap-1">
                          {searchHistory.map((item, i) => (
                            <button
                              key={i}
                              onClick={() => handleHistoryClick(item)}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                            >
                              <div className="text-gray-400 group-hover:text-[#5244EE] transition-colors shrink-0">
                                <Clock size={18} />
                              </div>
                              {item.category !== 'All' && (
                                <div className="flex items-center gap-2">
                                  <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-gray-100 text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                                    {item.category === 'Product' && <Package size={12} />}
                                    {item.category === 'Promotion' && <Ticket size={12} />}
                                    {item.category === 'Page Link' && <FileText size={12} />}
                                    {item.category}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-700 truncate">{item.keyword}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">常用功能</div>
                      <div className="space-y-1">
                        {[
                          { icon: <ShoppingCart size={18} />, label: 'Order Management' },
                          { icon: <Package size={18} />, label: 'Product and Inventory' },
                          { icon: <Ticket size={18} />, label: 'Promotion Management' },
                        ].map((item, i) => (
                          <button key={i} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                            <div className="text-gray-400 group-hover:text-[#5244EE] transition-colors">
                              {item.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">請輸入關鍵字進行搜尋</p>
                  </div>
                )
              ) : (
                <div className="px-4 py-2">
                  {!hasAnyResults ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <Search size={40} className="text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">找不到與「{searchQuery}」相關的結果</h3>
                      <p className="text-sm text-gray-500 max-w-[320px] mb-8">
                        請檢查關鍵字拼寫是否有誤，或嘗試使用更通用的詞彙進行搜尋。
                      </p>
                      
                      <div className="w-full max-w-[400px] bg-[#5244EE]/5 rounded-2xl p-6 border border-[#5244EE]/10">
                        <p className="text-sm text-[#5244EE] font-medium mb-4">
                          仍找不到您要的內容？
                        </p>
                        <button 
                          onClick={() => {
                            onSearchSubmit(searchQuery);
                          }}
                          className="w-full py-3 px-4 bg-[#5244EE] text-white rounded-xl text-sm font-bold hover:bg-[#4336D7] transition-all flex items-center justify-center gap-2"
                        >
                          前往詳細管理頁面繼續搜尋
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Mixed Results for "All" tab */}
                      {activeTab === 'All' && combinedResults.length > 0 && (
                        <div className="bg-white overflow-hidden">
                          {combinedResults.map((result, i) => (
                            <div 
                              key={result.id} 
                              className={`py-4 px-2 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${i !== combinedResults.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                              <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#5244EE]/5 rounded-xl">
                                {result.type === 'Product' && <Package size={20} className="text-[#5244EE]" />}
                                {result.type === 'Promotion' && <Ticket size={20} className="text-[#5244EE]" />}
                                {result.type === 'Page Link' && <FileText size={20} className="text-[#5244EE]" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="text-sm font-bold text-gray-900 truncate">
                                    {highlightText(result.title, searchQuery)}
                                  </div>
                                </div>
                                {(result.subtitle || (result.metadata && result.metadata.length > 0)) && (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {result.subtitle && (
                                      <span className="text-[12px] h-[24px] flex items-center text-gray-500 px-2 rounded border border-gray-200 bg-gray-50">
                                        {highlightText(result.subtitle, searchQuery)}
                                      </span>
                                    )}
                                    {result.metadata?.map((meta, idx) => (
                                      <span key={idx} className="text-[12px] text-gray-600">
                                        {highlightText(meta, searchQuery)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="shrink-0 text-gray-300">
                                <ChevronRight size={16} />
                              </div>
                            </div>
                          ))}
                          
                          {/* Go to detailed search button at the bottom of the list */}
                          <button 
                            onClick={() => onSearchSubmit(searchQuery)}
                            className="w-full py-4 px-2 flex items-center justify-center gap-2 text-sm font-bold text-[#5244EE] hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2"
                          >
                            <Search size={16} />
                            前往詳細搜尋頁面查看更多結果
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}

                      {/* Products - List Layout (Specific Tab) */}
                      {activeTab === 'Product' && filteredProducts.length > 0 && (
                        <section className="mb-8">
                          <div className="bg-white overflow-hidden">
                            {filteredProducts.map((product, i) => {
                              const buStyles = i % 2 === 0 
                                ? 'bg-[#F6FFF0] text-[#70D33B] border-[#D4F2C4]' 
                                : 'bg-[#F5F5FF] text-[#7B7BFF] border-[#DEDEFF]';
                              const buName = i % 2 === 0 ? 'HKTVmall' : 'ThePlace';

                              return (
                                <div key={product.id} className={`py-4 px-2 flex items-center gap-4 hover:bg-gray-50 transition-colors ${i !== filteredProducts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                  <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#5244EE]/5 rounded-xl">
                                    <Package size={20} className="text-[#5244EE]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-900 mb-1.5">
                                      {highlightText(product.name, searchQuery)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[12px] h-[28px] flex items-center font-medium px-2 rounded border ${buStyles}`}>
                                        {buName}
                                      </span>
                                      <span className={`text-[12px] h-[28px] flex items-center text-gray-500 px-2 rounded border border-gray-200 bg-gray-50`}>
                                        {highlightText(product.code, searchQuery)}
                                      </span>
                                      <span className="text-[12px] text-gray-600">
                                        {highlightText(product.testId, searchQuery)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {/* Promotions - List Layout (Specific Tab) */}
                      {activeTab === 'Promotion' && filteredPromotions.length > 0 && (
                        <section className="mb-8">
                          <div className="bg-white overflow-hidden">
                            {filteredPromotions.map((promo, i) => {
                              const statusColor = promo.status === 'On-going' ? 'bg-green-500' : 'bg-orange-500';
                              const statusText = promo.status === 'On-going' ? 'Active' : 'Pending';
                              const typeLabel = i === 0 ? 'Product' : i === 1 ? 'Free Gift' : 'Redemption';

                              return (
                                <div key={promo.id} className={`py-4 px-2 flex items-center gap-4 hover:bg-gray-50 transition-colors ${i !== filteredPromotions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                  <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#5244EE]/5 rounded-xl">
                                    <Ticket size={20} className="text-[#5244EE]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <span className="text-sm font-bold text-gray-900">{highlightText(promo.name, searchQuery)}</span>
                                      <div className="flex items-center gap-1.5 ml-2">
                                        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                                        <span className="text-xs text-gray-600">{statusText}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[12px] h-[28px] flex items-center font-medium px-2 rounded border bg-[#F6FFF0] text-[#70D33B] border-[#D4F2C4]`}>
                                        HKTVmall
                                      </span>
                                      <span className="text-[12px] h-[28px] flex items-center text-gray-500 px-2 rounded border border-gray-200 bg-gray-50">
                                        {highlightText(promo.code, searchQuery)}
                                      </span>
                                      <span className="text-[12px] h-[28px] flex items-center text-gray-500 px-2 rounded border border-gray-200 bg-gray-50">
                                        {typeLabel}
                                      </span>
                                      <span className="text-[12px] text-gray-600">
                                        {highlightText(promo.date, searchQuery)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {/* Page Links - List Layout (Specific Tab) */}
                      {activeTab === 'Page Link' && filteredPageLinks.length > 0 && (
                        <section className="mb-8">
                          <div className="bg-white overflow-hidden">
                            {filteredPageLinks.map((page, i) => (
                              <div key={page.id} className={`py-4 px-2 flex items-center gap-4 hover:bg-gray-50 transition-colors ${i !== filteredPageLinks.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#5244EE]/5 rounded-xl">
                                  <FileText size={20} className="text-[#5244EE]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-gray-900">
                                    {highlightText(page.title, searchQuery)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Category-specific No Results */}
                      {activeTab !== 'All' && (
                        (activeTab === 'Product' && filteredProducts.length === 0) ||
                        (activeTab === 'Promotion' && filteredPromotions.length === 0) ||
                        (activeTab === 'Page Link' && filteredPageLinks.length === 0)
                      ) && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} className="text-gray-300" />
                          </div>
                          <p className="text-sm text-gray-500">此分類下沒有與「{searchQuery}」相關的結果</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-white border-t border-gray-100 text-center text-xs text-gray-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-600 font-mono">Esc</kbd> to close • Use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-600 font-mono">/</kbd> to search anywhere
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
