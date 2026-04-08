import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Megaphone, 
  Wallet, 
  Star, 
  Settings,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Store,
  Truck,
  Ticket,
  Menu
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  {
    title: 'Main',
    items: [
      { title: '訂單管理', icon: ShoppingBag },
      { title: '商品及庫存', icon: Package },
      { title: '商戶數據分析平台', icon: BarChart3 },
      { title: '商戶廣告', icon: Megaphone },
      { title: '帳務中心', icon: Wallet },
      { title: '評分及評論', icon: Star },
      { title: '系統', icon: Settings },
    ]
  },
  {
    title: 'Platform Support',
    items: [
      { title: '退換貨申請', icon: RotateCcw },
    ]
  },
  {
    title: 'HKTVmall',
    items: [
      { title: '商店管理', icon: Store },
      { title: '3PL', icon: Truck },
      { title: '優惠活動管理', icon: Ticket },
    ]
  },
  {
    title: 'ThePlace',
    items: [
      { title: '商店管理', icon: Store },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Main', 'Platform Support', 'HKTVmall', 'ThePlace']);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-30 w-64 bg-[#0A0A32] text-white flex flex-col overflow-y-auto shrink-0 border-r border-white/10 transition-transform duration-300 lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-4 flex items-center gap-2 border-b border-white/10">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img src="https://picsum.photos/seed/merchant/100/100" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="font-bold text-lg leading-tight">
          Merchant<br /><span className="text-xs font-normal opacity-70">Management System</span>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-4">
            <button 
              onClick={() => toggleExpand(section.title)}
              className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
            >
              {section.title}
              {expandedItems.includes(section.title) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {expandedItems.includes(section.title) && (
              <div className="mt-1">
                {section.items.map((item) => (
                  <a
                    key={item.title}
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors group"
                  >
                    <item.icon size={18} className="text-white/70 group-hover:text-white" />
                    <span className="flex-1">{item.title}</span>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
