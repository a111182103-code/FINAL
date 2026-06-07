import { TocData, TocItem, ThemeStyles } from '../types';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, HelpCircle, ChevronRight, ListOrdered } from 'lucide-react';

interface IndexPageProps {
  data: TocData;
  onChange: (data: TocData) => void;
  theme: ThemeStyles;
}

export default function IndexPage({ data, onChange, theme }: IndexPageProps) {
  
  // Handle changing toc general fields
  const handleFieldChange = (field: 'title' | 'subtitle', value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Handle changing individual item field
  const handleItemChange = (itemId: string, field: keyof TocItem, value: string) => {
    const updatedItems = data.items.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...data, items: updatedItems });
  };

  // Add a new TOC item
  const addItem = () => {
    const newItem: TocItem = {
      id: Date.now().toString(),
      title: '請輸入新的目錄標題名稱...',
      pageNum: (data.items.length > 0 ? Math.max(...data.items.map(i => parseInt(i.pageNum) || 1)) + 1 : 1).toString()
    };
    onChange({
      ...data,
      items: [...data.items, newItem]
    });
  };

  // Delete a TOC item
  const deleteItem = (itemId: string) => {
    const updatedItems = data.items.filter(item => item.id !== itemId);
    onChange({ ...data, items: updatedItems });
  };

  // Move item up in the list
  const moveItemUp = (index: number) => {
    if (index === 0) return;
    const updatedItems = [...data.items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index - 1];
    updatedItems[index - 1] = temp;
    onChange({ ...data, items: updatedItems });
  };

  // Move item down in the list
  const moveItemDown = (index: number) => {
    if (index === data.items.length - 1) return;
    const updatedItems = [...data.items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index + 1];
    updatedItems[index + 1] = temp;
    onChange({ ...data, items: updatedItems });
  };

  return (
    <div className="w-full h-full flex flex-col pt-2 font-sans justify-between">
      <div>
        {/* Header Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {theme.id === 'modern' && (
              <span className="text-xl font-bold text-[#0f766e] bg-[#0f766e]/10 py-0.5 px-2 rounded">
                03
              </span>
            )}
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className={`text-xl md:text-2xl font-bold text-neutral-900 tracking-tight bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full ${theme.fontTitle}`}
              placeholder="目錄標題"
            />
          </div>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
            className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-mono bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full"
            placeholder="目錄副標題說明"
          />
          <div className={`h-1 w-20 ${theme.accentBg} mt-3`}></div>
        </div>

        {/* Dynamic Dotted List */}
        <div className="space-y-4 max-w-xl mx-auto pt-4">
          {data.items.map((item, idx) => (
            <div key={item.id} className="group/toc flex items-center justify-between gap-1 relative">
              
              {/* Left drag indicator (numbered) or bullet icon */}
              <div className="flex items-center gap-1.5 shrink-0">
                <ChevronRight className={`w-3.5 h-3.5 ${theme.accentText} opacity-40`} />
              </div>

              {/* Title input field */}
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-100 rounded text-xs text-neutral-700 font-medium py-0.5 px-1 flex-grow shrink max-w-xs transition-all tracking-wide"
                placeholder="目錄項目名稱"
              />

              {/* Classic Book Dotted Leader - pure CSS */}
              <div className="flex-grow border-b border-dotted border-neutral-300 mx-2 select-none relative -top-1 opacity-70"></div>

              {/* Page Number input field */}
              <div className="flex items-center shrink-0">
                <span className="text-xs text-neutral-400 font-mono select-none mr-0.5">P.</span>
                <input
                  type="text"
                  value={item.pageNum}
                  onChange={(e) => handleItemChange(item.id, 'pageNum', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-xs text-neutral-800 font-bold font-mono text-center w-8 py-0.5 transition-all"
                  placeholder="頁"
                />
              </div>

              {/* Action utilities (up, down, delete) - hidden in print! */}
              <div className="no-print absolute -right-20 top-1/2 -translate-y-1/2 flex items-center bg-white/95 shadow-sm border border-neutral-150 rounded opacity-0 group-hover/toc:opacity-100 transition-all p-0.5 z-10 gap-0.5 scale-95 origin-left">
                <button
                  type="button"
                  onClick={() => moveItemUp(idx)}
                  disabled={idx === 0}
                  className="p-1 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50 rounded disabled:opacity-20 transition-colors"
                  title="上移"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItemDown(idx)}
                  disabled={idx === data.items.length - 1}
                  className="p-1 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-50 rounded disabled:opacity-20 transition-colors"
                  title="下移"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-neutral-200"></div>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-neutral-400 hover:text-red-500 hover:bg-neutral-50 rounded transition-colors"
                  title="刪除"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* New Item Trigger Row */}
          <div className="no-print pt-4 flex justify-center">
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-medium px-4 py-1.5 rounded-full border border-dashed border-neutral-200 hover:border-neutral-400 hover:shadow-sm transition-all bg-neutral-50/70"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              新增目錄子項目
            </button>
          </div>
        </div>
      </div>

      {/* Decorative summary footer area in TOC */}
      <div className="mt-10 border-t border-dashed border-neutral-200 pt-6">
        <div className="text-[10px] text-neutral-400 flex items-center justify-between px-2 font-mono">
          <span className="flex items-center gap-1.5">
            <ListOrdered className="w-3 h-3" /> INDEX_VALIDATION: COMPILED_SUCCESSFULLY
          </span>
          <span>SYSTEM_PAGES: 04</span>
        </div>
      </div>
    </div>
  );
}
