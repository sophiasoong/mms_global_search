import React, { useMemo } from 'react';
import { 
  Package, 
  Ticket, 
  FileText, 
  ChevronRight,
  Search,
  ArrowLeft
} from 'lucide-react';
import { products, promotions, pageLinks } from '../data/mockData';
import { SearchResult, SearchResultType } from '../types';

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

function calculateRelevance(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  if (lowerText === lowerQuery) return 100;
  if (lowerText.startsWith(lowerQuery)) return 80;
  
  const words = lowerText.split(/[\s/]+/); // Split by space or slash
  if (words.some(w => w === lowerQuery)) return 75;
  if (words.some(w => w.startsWith(lowerQuery))) return 65;
  
  if (lowerText.includes(lowerQuery)) return 50;
  return 0;
}

export default function SearchResults({ query, onBack }: SearchResultsProps) {
  const allResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];

    // Process Products
    products.forEach(p => {
      const nameScore = calculateRelevance(p.name, query);
      const codeScore = calculateRelevance(p.code, query);
      const testIdScore = calculateRelevance(p.testId, query);
      const maxScore = Math.max(nameScore, codeScore, testIdScore);

      if (maxScore > 0) {
        results.push({
          id: `product-${p.id}`,
          type: 'Product',
          title: p.name,
          subtitle: p.code,
          metadata: [p.testId],
          relevance: maxScore,
          originalData: p
        });
      }
    });

    // Process Promotions
    promotions.forEach(p => {
      const nameScore = calculateRelevance(p.name, query);
      const codeScore = calculateRelevance(p.code, query);
      const dateScore = calculateRelevance(p.date, query);
      const maxScore = Math.max(nameScore, codeScore, dateScore);

      if (maxScore > 0) {
        results.push({
          id: `promo-${p.id}`,
          type: 'Promotion',
          title: p.name,
          subtitle: p.code,
          metadata: [p.status, p.date],
          relevance: maxScore,
          originalData: p
        });
      }
    });

    // Process Page Links
    pageLinks.forEach(p => {
      const score = calculateRelevance(p.title, query);
      if (score > 0) {
        results.push({
          id: `page-${p.id}`,
          type: 'Page Link',
          title: p.title,
          relevance: score,
          originalData: p
        });
      }
    });

    // Sort by relevance descending
    return results.sort((a, b) => b.relevance - a.relevance);
  }, [query]);

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

  const getIcon = (type: SearchResultType) => {
    switch (type) {
      case 'Product': return <Package size={20} className="text-[#5244EE]" />;
      case 'Promotion': return <Ticket size={20} className="text-[#5244EE]" />;
      case 'Page Link': return <FileText size={20} className="text-[#5244EE]" />;
      default: return <Search size={20} className="text-[#5244EE]" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">搜尋結果</h1>
            <p className="text-sm text-gray-500 mt-1">
              找到 {allResults.length} 個與「{query}」相關的結果
            </p>
          </div>
        </div>

        {allResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">找不到與「{query}」相關的結果</h3>
            <p className="text-sm text-gray-500 max-w-[320px]">
              請檢查關鍵字拼寫是否有誤，或嘗試使用更通用的詞彙進行搜尋。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allResults.map((result) => (
              <div 
                key={result.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-[#5244EE]/5 rounded-xl group-hover:bg-[#5244EE]/10 transition-colors">
                  {getIcon(result.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {result.relevance >= 80 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-green-100 text-green-600 rounded">
                        High Match
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {highlightText(result.title, query)}
                  </h3>
                  {result.subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {highlightText(result.subtitle, query)}
                    </p>
                  )}
                  {result.metadata && result.metadata.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.metadata.map((meta, i) => (
                        <span key={i} className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {highlightText(meta, query)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-gray-300 group-hover:text-[#5244EE] transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
