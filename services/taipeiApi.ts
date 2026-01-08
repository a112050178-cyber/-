
import { ApiResponse } from '../types';

/**
 * Using corsproxy.io for transparency with headers.
 * The Taipei Travel API REQUIREs 'accept: application/json' or it will return a 406 or raw HTML.
 */
export const fetchAttractions = async (page: number, lang: string = 'zh-tw', keyword: string = ''): Promise<ApiResponse> => {
  let targetUrl = `https://www.travel.taipei/open-api/${lang}/Attractions/All?page=${page}`;
  
  // If a keyword is provided, append it to the API call for global search
  if (keyword && keyword !== '全部景點') {
    targetUrl += `&keyword=${encodeURIComponent(keyword)}`;
  }
  
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 406) {
        throw new Error('API 拒絕請求 (406)，這通常與 Accept Header 有關。');
      }
      throw new Error(`連線異常 (HTTP ${response.status})`);
    }

    const data = await response.json();
    
    // Check if the API returned an error structure
    if (data.status === 'error' || !data.data) {
      throw new Error(data.message || 'API 資料格式不符合預期');
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('無法連線至 API 伺服器，請檢查網路狀態或嘗試更換瀏覽器。');
      }
      throw error;
    }
    throw new Error('發生未知錯誤，無法取得景點資料。');
  }
};
