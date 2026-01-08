
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AttractionCard from './components/AttractionCard';
import Pagination from './components/Pagination';
import { fetchAttractions } from './services/taipeiApi';
import { Attraction } from './types';

const CATEGORIES = [
  '全部景點',
  '歷史藝文',
  '商圈夜市',
  '戶外踏青',
  '單車遊蹤'
];

const App: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState('zh-tw');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部景點');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAttractions(page, lang, searchQuery);
      setAttractions(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  }, [page, lang, searchQuery]);

  // Fetch data whenever page, lang, or searchQuery changes
  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
    setActiveCategory('全部景點'); // Clear active category visual if searching manually
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery(cat === '全部景點' ? '' : cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-['Noto_Sans_TC']">
      <Header 
        onSearch={handleSearch} 
        lang={lang} 
        setLang={(l) => {
          setLang(l);
          setPage(1);
        }} 
      />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 py-12">
        
        {/* Category Selector */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-white border border-gray-100 rounded-full p-1.5 flex flex-wrap justify-center gap-2 shadow-sm mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-[#4db6ac] text-white shadow-lg scale-105' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-gray-400 text-xs font-medium">
              {loading ? '景點探索中...' : `「${searchQuery || '全部'}」搜尋結果：共 ${total} 筆資料`}
            </p>
            {searchQuery && !loading && (
               <button 
                 onClick={() => handleSearch('')}
                 className="text-[10px] text-[#4db6ac] hover:underline"
               >
                 清除搜尋條件
               </button>
            )}
          </div>
        </div>

        {error ? (
          <div className="max-w-2xl mx-auto mb-12 p-10 bg-white border border-red-100 rounded-3xl shadow-xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">抱歉，暫時無法取得資料</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md mx-auto">
              {error}<br/>請確認您的網路連線，或稍後再重新嘗試。
            </p>
            <button 
              onClick={() => loadData()} 
              className="px-10 py-3.5 bg-[#4db6ac] text-white rounded-full font-bold hover:bg-[#3d9189] transition-all shadow-lg active:scale-95"
            >
              重新整理
            </button>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 animate-pulse">
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                      <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-2 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : attractions.length > 0 ? (
                attractions.map(attr => (
                  <AttractionCard key={attr.id} attraction={attr} />
                ))
              ) : (
                <div className="col-span-full py-40 flex flex-col items-center">
                  <div className="text-6xl mb-6 opacity-20">🏝️</div>
                  <p className="text-2xl font-bold text-gray-300 mb-2">查無相關景點</p>
                  <p className="text-gray-400 text-sm mb-8">請嘗試調整搜尋關鍵字或選擇其他分類</p>
                </div>
              )}
            </div>

            {!loading && attractions.length > 0 && (
              <div className="mt-16 flex flex-col items-center">
                 <Pagination 
                    currentPage={page} 
                    totalItems={total} 
                    itemsPerPage={30} 
                    onPageChange={setPage} 
                  />
                  <p className="text-gray-300 text-[10px] font-bold tracking-widest uppercase mt-6">
                    Page {page} of {Math.ceil(total / 30)}
                  </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
             <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black italic text-xl">T</div>
             <span className="font-black text-3xl tracking-tighter uppercase text-gray-900">Taipei</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">
            Taipei Travel Open Data Service<br/>
            Handcrafted for explorers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
