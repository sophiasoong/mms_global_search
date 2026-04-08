import React from 'react';
import { 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Package, 
  DollarSign,
  Info,
  ExternalLink,
  MessageSquare,
  Phone
} from 'lucide-react';

const summaryCards = [
  { title: '新單單', value: '0', icon: AlertCircle, color: 'text-orange-500' },
  { title: '待辦運單', value: '0', icon: AlertCircle, color: 'text-orange-500' },
  { title: '近期完成運單', value: '0', icon: AlertCircle, color: 'text-orange-500' },
];

const announcements = [
  {
    id: '1',
    title: '0311 test(tc)',
    content: '【重要通告：月結報告附加款項管理】有關款項調整流程變更（適用於每月一次月結報告的商戶）致商戶 Store ID: 作為香港最大的網購平台，HKTVmall一向致力於提升服務品質，為各商戶夥伴帶來更卓越的體驗。全新的「款項調整」功能，讓商戶能更輕鬆靈活地查閱及管理相關記錄，為您帶來更便捷營商體驗。透過系統，商戶可清楚掌握按月結報告（Payment Cycle Report，簡稱PCR）中待處理...',
    date: '2026-03-11 17:30',
    tags: ['0316 News', 'HKTVMALL']
  },
  {
    id: '2',
    title: 'duplicated - duplicated - 0311 test(tc) - SENT',
    content: '【重要通告：月結報告附加款項管理】有關款項調整流程變更（適用於每月一次月結報告的商戶）致商戶 Store ID: 作為香港最大的網購平台，HKTVmall一向致力於提升服務品質，為各商戶夥伴帶來更卓越的體驗。全新的「款項調整」功能，讓商戶能更輕鬆靈活地查閱及管理相關記錄，為您帶來更便捷營商體驗。透過系統，商戶可清楚掌握按月結報告（Payment Cycle Report，簡稱PCR）中待處理...',
    date: '2026-03-11 17:08',
    tags: ['0202 News', '0223 News', '0316 News', 'ThePlace']
  },
  {
    id: '3',
    title: 'MS-10751 & MS-10717(TC)',
    content: '【重要通告：月結報告附加款項管理】有關款項調整流程變更（適用於每月一次月結報告的商戶）致商戶 Store ID: 作為香港最大的網購平台，HKTVmall一向致力於提升服務品質，為各商戶夥伴帶來更卓越的體驗。全新的「款項調整」功能，讓商戶能更輕鬆靈活地查閱及管理相關記錄，為您帶來更便捷營商體驗。透過系統，商戶可清楚掌握按月結報告（Payment Cycle Report，簡稱PCR）中待處理...',
    date: '2026-03-10 12:30',
    tags: ['0316 News', 'HKTVMALL']
  }
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">歡迎你，Wayne Su</h1>
          <span className="bg-[#5244EE]/10 text-[#5244EE] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            A0057001 <ChevronRight size={12} className="rotate-90" />
          </span>
        </div>
        <div className="text-xs text-gray-400">
          最後更新時間：2026-03-17 16:50:34
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
              {card.title} <card.icon size={14} className={card.color} />
            </div>
            <div className="text-4xl font-bold text-gray-800">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Sales Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">銷售概覽</h2>
            <p className="text-xs text-gray-400 mt-1">每日資料計算期間可能暫時無法取得數據，若畫面無顯示資料，請稍後再試一次。</p>
          </div>
          <div className="flex gap-2">
            {['昨天', '過去7天', '過去30天'].map((tab, i) => (
              <button 
                key={tab}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${i === 1 ? 'bg-[#5244EE]/10 text-[#5244EE] font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#5244EE]/10 rounded-lg flex items-center justify-center text-[#5244EE]">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500">銷售總額</div>
              <div className="text-sm text-gray-400 italic">暫時沒有數據提供</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <Package size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500">產品銷量</div>
              <div className="text-sm text-gray-400 italic">暫時沒有數據提供</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <DollarSign size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-500">平均訂單金額</div>
              <div className="text-sm text-gray-400 italic">暫時沒有數據提供</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4">前3名熱門產品 - 銷售額</h3>
            <div className="h-40 flex items-center justify-center text-gray-300 italic text-xs">
              暫時沒有數據提供
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4">前3名熱門產品 - 銷售數量</h3>
            <div className="h-40 flex items-center justify-center text-gray-300 italic text-xs">
              暫時沒有數據提供
            </div>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4">會籍分佈</h3>
            <div className="h-40 flex items-center justify-center text-gray-300 italic text-xs">
              暫時沒有數據提供
            </div>
          </div>
        </div>
        <div className="text-right mt-4">
          <a href="#" className="text-[#5244EE] text-xs hover:underline flex items-center justify-end gap-1">
            查看完整數據 {'>>'}
          </a>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6">重要公告</h2>
        <div className="space-y-6">
          {announcements.map((item) => (
            <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                <Megaphone size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-800 hover:text-[#5244EE] cursor-pointer">{item.title}</h3>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                  {item.content}
                </p>
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">擴大你的業務</h2>
        <div className="bg-gradient-to-r from-[#5244EE] to-[#5244EE]/80 rounded-xl p-8 text-white relative overflow-hidden h-48 flex items-center justify-center">
          <div className="text-center z-10">
            <h3 className="text-3xl font-bold mb-2">聯絡我們以獲取更多商機</h3>
            <p className="opacity-90">我們的專業團隊隨時為您提供支援</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button className="flex items-center gap-2 bg-[#5244EE]/10 text-[#5244EE] px-6 py-3 rounded-full shadow-lg font-medium hover:bg-[#5244EE]/20 transition-colors">
          <Phone size={18} /> 聯絡我們
        </button>
        <button className="flex items-center gap-2 bg-[#5244EE] text-white px-6 py-3 rounded-full shadow-lg font-medium hover:opacity-90 transition-colors">
          <MessageSquare size={18} /> 客人訊息
        </button>
      </div>
    </div>
  );
}

function Megaphone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  )
}
