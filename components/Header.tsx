
import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (keyword: string) => void;
  lang: string;
  setLang: (l: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, lang, setLang }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const languages = [
    { code: 'zh-tw', label: '繁體中文' },
    { code: 'zh-cn', label: '简体中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국語' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#e0f7fa] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: Hamburger & Title */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-black hover:bg-black/5 rounded">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">台北市景點搜索</h1>
            <p className="text-sm font-medium text-gray-700 italic">Taipei Attractions Viewer</p>
          </div>
        </div>

        {/* Right: Language & Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="border border-gray-400 bg-white px-4 py-1 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              language
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-xl rounded-md overflow-hidden z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${lang === l.code ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-gray-700'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative hidden sm:block">
            <input 
              type="text"
              className="w-64 border border-gray-400 px-3 py-1 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
