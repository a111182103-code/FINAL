import React, { useRef, useState, useEffect } from 'react';
import { AssignmentData, AttachmentFile, ThemeStyles } from '../types';
import { UploadCloud, Image as ImageIcon, Trash2, HelpCircle, FileText, Plus, FileCode, CheckCircle2, Globe, ExternalLink, Box } from 'lucide-react';

interface AssignmentPageProps {
  data: AssignmentData;
  onChange: (data: AssignmentData) => void;
  theme: ThemeStyles;
}

export default function AssignmentPage({ data, onChange, theme }: AssignmentPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notes2Ref = useRef<HTMLTextAreaElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [itineraryViewMode, setItineraryViewMode] = useState<'preview' | 'edit'>('preview');
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);

  // Sync helper
  const updateData = (updated: Partial<AssignmentData>) => {
    onChange({
      ...data,
      ...updated
    });
  };

  // Convert File to Base64 Url for localStorage persistence
  const processFile = (file: File) => {
    const reader = new FileReader();
    
    if (file.type.startsWith('image/')) {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        
        const newAttachment: AttachmentFile = {
          id: 'file-' + Date.now() + Math.random().toString(36).substr(2, 4),
          name: file.name,
          type: file.type,
          dataUrl: base64,
          caption: `圖：${file.name.split('.')[0]} 實行畫面成果佐證`,
          description: `本圖檔為作業實做「${file.name}」之直接輸出紀錄。上傳於 ${new Date().toLocaleDateString()}。`
        };
        
        updateData({
          files: [...data.files, newAttachment]
        });
        triggerStatusMessage(`成功匯入圖片：${file.name}`);
      };
      reader.readAsDataURL(file);
    } else {
      // Treat as plain text (txt, logs, code, python, etc.)
      reader.onload = (e) => {
        const textContent = e.target?.result as string;
        
        // Append parsed file context elegantly to the notes
        const delimiter = "\n\n" + "=".repeat(40) + "\n";
        const appendText = `${delimiter}【匯入檔案: ${file.name}】\n${textContent}\n`;
        
        updateData({
          notes: data.notes + appendText
        });
        triggerStatusMessage(`已成功讀取並串接到下方實驗筆記底層：${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const triggerStatusMessage = (msg: string) => {
    setUploadStatus(msg);
    setTimeout(() => setUploadStatus(null), 3000);
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files);
      filesArray.forEach(processFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(processFile);
    }
  };

  // CTRL-V Paste screenshots listener (highly desired student utility)
  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePasteEvent);
    return () => {
      window.removeEventListener('paste', handlePasteEvent);
    };
  }, [data.files]);

  // Dynamic automatic height adjustment for Notes 2 to completely eliminate scrolling
  useEffect(() => {
    if (itineraryViewMode === 'edit' && notes2Ref.current) {
      notes2Ref.current.style.height = 'auto';
      notes2Ref.current.style.height = `${notes2Ref.current.scrollHeight + 4}px`;
    }
  }, [data.notes2, itineraryViewMode]);

  // Remove Attachment
  const deleteAttachment = (id: string) => {
    const updated = data.files.filter(f => f.id !== id);
    updateData({ files: updated });
  };

  // Modify caption or description of image
  const updateAttachmentField = (id: string, field: 'caption' | 'description', value: string) => {
    const updated = data.files.map(f => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    });
    updateData({ files: updated });
  };

  // Helper parser for multi-day itineraries
  const parseItinerary = (text: string) => {
    if (!text) return [];
    const parts = text.split(/(?=Day\s*\d+)/i);
    const result: { dayLabel: string; title: string; content: string }[] = [];
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      const match = trimmed.match(/^Day\s*(\d+)[:：\s]*(.*)/i);
      if (match) {
        const dayNum = match[1];
        const lines = trimmed.split('\n');
        const firstLine = lines[0] || '';
        const rawTitle = firstLine.replace(/^Day\s*\d+[:：\s]*/i, '').trim();
        const content = lines.slice(1).join('\n').trim();
        result.push({
          dayLabel: `Day ${dayNum}`,
          title: rawTitle || `第 ${dayNum} 天`,
          content: content
        });
      } else {
        if (result.length > 0) {
          result[result.length - 1].content += "\n\n" + trimmed;
        } else {
          result.push({
            dayLabel: "附錄",
            title: "核心須知與探究備忘",
            content: trimmed
          });
        }
      }
    });
    return result;
  };

  const itineraryDays = parseItinerary(data.notes2 || "");
  const safeActiveIdx = activeDayIdx < itineraryDays.length ? activeDayIdx : 0;

  // Render markdown strong emphasis as highlighted bold elements
  const formatInlineBold = (text: string) => {
    const regex = /(\*\*.*?\*\*)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-neutral-950 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/50">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Render text blocks cleanly with headings & nested meal plan boards
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n').map(p => p.trim()).filter(Boolean);
    
    return (
      <div className="space-y-3.5">
        {paragraphs.map((p, idx) => {
          // Detect Meal Plan Paragraphs
          if (p.startsWith("三餐規劃：") || p.includes("午餐：") || p.includes("晚餐：") || p.includes("早餐：") || p.includes("宵夜：") || p.includes("下午茶：")) {
            return (
              <div key={idx} className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 border-b border-neutral-150 pb-1.5 mb-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                  <span>🍽️</span>
                  <span>當日精緻奢華美饌規劃</span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-700 leading-relaxed">
                  {p.split('\n').map((line, lIdx) => {
                    const cleanedLine = line.replace(/三餐規劃：/g, '').trim();
                    if (!cleanedLine) return null;
                    
                    if (cleanedLine.startsWith("早餐：") || cleanedLine.startsWith("午餐：") || cleanedLine.startsWith("晚餐：") || cleanedLine.startsWith("宵夜：") || cleanedLine.startsWith("下午茶：")) {
                      const match = cleanedLine.match(/^([^：]+)：(.*)/);
                      if (match) {
                        return (
                          <div key={lIdx} className="flex gap-2 items-start py-0.5">
                            <span className="shrink-0 text-[10px] font-bold font-mono bg-neutral-200/80 text-neutral-700 px-1.5 py-0.5 rounded-md shadow-2xs">
                              {match[1]}
                            </span>
                            <span className="text-neutral-600 text-[11px] leading-relaxed pt-0.5">
                              {formatInlineBold(match[2])}
                            </span>
                          </div>
                        );
                      }
                    }
                    return (
                      <p key={lIdx} className="text-neutral-600 text-[11px] leading-relaxed font-sans">
                        {formatInlineBold(cleanedLine)}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          }

          // Render Normal activities with bold times/events mapping
          return (
            <div key={idx} className="text-[11.5px] text-neutral-650 leading-relaxed space-y-1.5 font-sans">
              {p.split('\n').map((line, lIdx) => {
                if (line.trim().startsWith("上午：") || line.trim().startsWith("下午：") || line.trim().startsWith("全天：") || line.trim().startsWith("返程：") || line.trim().startsWith("晚上：") || line.trim().startsWith("全天")) {
                  const match = line.match(/^([^：]+)：(.*)/);
                  if (match) {
                    return (
                      <div key={lIdx} className="flex gap-2.5 items-start py-1">
                        <span className={`shrink-0 font-bold text-[9px] px-2 py-0.5 rounded-md font-mono select-none text-white shadow-2xs ${theme.accentBg}`}>
                          {match[1]}
                        </span>
                        <span className="text-neutral-850 font-extrabold text-[11.5px] pt-0.5 font-sans">
                          {formatInlineBold(match[2])}
                        </span>
                      </div>
                    );
                  }
                }
                return (
                  <p key={lIdx} className="text-neutral-600 pl-0.5 leading-relaxed font-sans">
                    {formatInlineBold(line)}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col pt-1 font-sans justify-between">
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          {theme.id === 'modern' && (
            <span className="text-xl font-bold text-[#0f766e] bg-[#0f766e]/10 py-0.5 px-2 rounded">
              04
            </span>
          )}
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className={`text-xl md:text-2xl font-bold text-neutral-900 tracking-tight bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full ${theme.fontTitle}`}
            placeholder="第四頁標題名稱"
          />
        </div>
        <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-mono">
          PRACTICAL WORKSPACE & FILE ATTACHMENTS APPENDIX
        </p>
        <div className={`h-1 w-20 ${theme.accentBg} mt-3`}></div>
      </div>

      {/* Intro Text */}
      <div className="mb-4">
        <textarea
          value={data.intro}
          onChange={(e) => updateData({ intro: e.target.value })}
          rows={2}
          className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-xs leading-relaxed text-neutral-600 w-full resize-none pb-1"
          placeholder="請在此處為作業區或實作成果、上傳檔案做簡單的引言說明..."
        />
      </div>

      {/* Drag & Drop Upload Zone (Hidden during printing!) */}
      <div className="no-print mb-4 relative">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,text/*,.py,.js,.html,.css,.json,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="p-2 bg-white rounded-full shadow-sm text-neutral-500">
            <UploadCloud className="w-5 h-5 text-neutral-400" />
          </div>
          
          <div className="space-y-0.5 text-xs">
            <p className="font-semibold text-neutral-700">
              拖曳檔案至此、點擊選取，或直接按 <kbd className="bg-neutral-200 px-1 py-0.5 rounded text-[10px] font-mono font-bold">CTRL+V</kbd> 貼上截圖
            </p>
            <p className="text-neutral-400">
              支援圖片自動嵌入 A4，或純文字檔（代碼、紀錄）串接至下方筆記欄
            </p>
          </div>
        </div>

        {uploadStatus && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-3" /> {uploadStatus}
          </div>
        )}
      </div>

      {/* Attachments rendering area */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          {/* NKUST External Course Project Platform Node */}
          <div className="p-4 border border-neutral-200 rounded-xl bg-gradient-to-r from-neutral-50 via-white to-neutral-50/75 shadow-sm hover:shadow-md transition-all duration-200 break-inside-avoid">
            <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-neutral-150">
              <Globe className="w-4 h-4 text-neutral-500 no-print" />
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                NKUST 專題特許學習歷程與外部成果節點
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Display Image (The requested visual element) */}
              <div className="w-full md:w-48 h-28 shrink-0 rounded-lg overflow-hidden border border-neutral-200/80 shadow-inner group/portal relative bg-neutral-100">
                <img
                  src={data.portalUrlImage || "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1200"}
                  alt="NKUST Site Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/portal:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all pointer-events-none md:block" />
              </div>

              {/* Portal Content & Editing Area */}
              <div className="flex-grow w-full space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <input
                    type="text"
                    value={data.portalUrlTitle || "國立高雄科技大學（NKUST）專題展示平台 · 歷程節點"}
                    onChange={(e) => updateData({ portalUrlTitle: e.target.value })}
                    className={`text-xs md:text-sm font-bold bg-transparent hover:bg-neutral-100/60 focus:bg-white focus:outline-none rounded px-1.5 py-0.5 w-full tracking-wide duration-150 ${theme.accentText}`}
                    placeholder="編輯專題名稱"
                  />

                  <a
                    href={data.portalUrl || "https://sites.google.com/nkust.edu.tw/jalsjasljddjoaidjpafjpfkpakf/%E9%A6%96%E9%A0%81#h.b18zj4domaem"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-neutral-800 hover:bg-neutral-900 duration-150 rounded-md shadow-sm select-none"
                  >
                    <ExternalLink className="w-3 h-3" /> 打開連結
                  </a>
                </div>

                {/* Editable URL Input */}
                <div className="flex items-center gap-1.5 no-print">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 select-none">連結網址:</span>
                  <input
                    type="text"
                    value={data.portalUrl || "https://sites.google.com/nkust.edu.tw/jalsjasljddjoaidjpafjpfkpakf/%E9%A6%96%E9%A0%81#h.b18zj4domaem"}
                    onChange={(e) => updateData({ portalUrl: e.target.value })}
                    className="text-[10px] font-mono text-neutral-500 bg-neutral-100 hover:bg-neutral-200/50 focus:bg-white focus:outline-none rounded px-1.5 py-0.5 w-full truncate border border-neutral-150"
                    placeholder="輸入專題外部 Google Sites 連結網址..."
                  />
                </div>

                {/* Printable representation of the link */}
                <div className="hidden print:block text-[10px] font-mono text-neutral-600 border border-neutral-200 p-1.5 rounded bg-neutral-50 select-text break-all">
                  📢 專題連結網址：{data.portalUrl || "https://sites.google.com/nkust.edu.tw/jalsjasljddjoaidjpafjpfkpakf/%E9%A6%96%E9%A0%81#h.b18zj4domaem"}
                </div>

                {/* Editable Description area */}
                <textarea
                  value={data.portalUrlDesc || ""}
                  onChange={(e) => updateData({ portalUrlDesc: e.target.value })}
                  rows={2}
                  className="w-full bg-transparent hover:bg-neutral-100/60 focus:bg-white focus:outline-none rounded px-1.5 py-1 text-[11px] text-neutral-600 leading-relaxed resize-none h-[48px]"
                  placeholder="輸入專題成果特色、學習歷程記錄描述..."
                />
              </div>
            </div>
          </div>

          {/* Tripo3D generative model Node */}
          <div className="p-4 border border-neutral-200 rounded-xl bg-gradient-to-r from-neutral-50 via-white to-neutral-50/75 shadow-sm hover:shadow-md transition-all duration-200 break-inside-avoid">
            <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-neutral-100">
              <Box className="w-4 h-4 text-neutral-500 no-print" />
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Tripo3D 智慧生成數位雙生與動態立體物件
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Display Image (The requested visual element) */}
              <div className="w-full md:w-48 h-28 shrink-0 rounded-lg overflow-hidden border border-neutral-200/80 shadow-inner group/portal2 relative bg-neutral-100">
                <img
                  src={data.tripoUrlImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"}
                  alt="Tripo3D Model Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/portal2:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all pointer-events-none md:block" />
              </div>

              {/* Portal Content & Editing Area */}
              <div className="flex-grow w-full space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <input
                    type="text"
                    value={data.tripoUrlTitle || "Tripo3D 智慧生成數位雙生 · 3D 動態模型節點"}
                    onChange={(e) => updateData({ tripoUrlTitle: e.target.value })}
                    className={`text-xs md:text-sm font-bold bg-transparent hover:bg-neutral-100/60 focus:bg-white focus:outline-none rounded px-1.5 py-0.5 w-full tracking-wide duration-150 ${theme.accentText}`}
                    placeholder="編輯 3D 模型專案名稱"
                  />

                  <a
                    href={data.tripoUrl || "https://studio.tripo3d.ai/3d-model/b5345719-2b38-4dd1-b077-6ee1cb4cafb2?invite_code=HF6UKF"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-print shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-neutral-800 hover:bg-neutral-900 duration-150 rounded-md shadow-sm select-none"
                  >
                    <ExternalLink className="w-3 h-3" /> 打開 3D 模型
                  </a>
                </div>

                {/* Editable URL Input */}
                <div className="flex items-center gap-1.5 no-print">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 select-none">連結網址:</span>
                  <input
                    type="text"
                    value={data.tripoUrl || "https://studio.tripo3d.ai/3d-model/b5345719-2b38-4dd1-b077-6ee1cb4cafb2?invite_code=HF6UKF"}
                    onChange={(e) => updateData({ tripoUrl: e.target.value })}
                    className="text-[10px] font-mono text-neutral-500 bg-neutral-100 hover:bg-neutral-200/50 focus:bg-white focus:outline-none rounded px-1.5 py-0.5 w-full truncate border border-neutral-150"
                    placeholder="輸入 Tripo3D 專案連結核心網址..."
                  />
                </div>

                {/* Printable representation of the link */}
                <div className="hidden print:block text-[10px] font-mono text-neutral-600 border border-neutral-200 p-1.5 rounded bg-neutral-50 select-text break-all">
                  📢 3D 模型展示網址：{data.tripoUrl || "https://studio.tripo3d.ai/3d-model/b5345719-2b38-4dd1-b077-6ee1cb4cafb2?invite_code=HF6UKF"}
                </div>

                {/* Editable Description area */}
                <textarea
                  value={data.tripoUrlDesc || "本外部 3D 模型節點整合 Tripo3D 智慧生成平台。透過高精度 AI 演算法，針對未來智慧差旅載具、頂奢空間格局與歷史文化地標進行 3D 擬真建模，提供沈浸式的立體視覺呈現與空間關係解析。"}
                  onChange={(e) => updateData({ tripoUrlDesc: e.target.value })}
                  rows={2}
                  className="w-full bg-transparent hover:bg-neutral-100/60 focus:bg-white focus:outline-none rounded px-1.5 py-1 text-[11px] text-neutral-600 leading-relaxed resize-none h-[48px]"
                  placeholder="輸入模型特性、設計概念或者技術敘述..."
                />
              </div>
            </div>
          </div>

          {data.files.map((file) => (
            <div key={file.id} className="relative group/file border border-neutral-150 rounded-lg overflow-hidden bg-neutral-50/30 p-3">
              <div className="flex flex-col md:flex-row gap-3.5 items-center">
                
                {/* File Thumbnail Preview */}
                <div className="w-full md:w-44 h-28 bg-neutral-100 rounded border border-neutral-150 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain cursor-zoom-in"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400 py-4">
                      <FileText className="w-8 h-8" />
                      <span className="text-[10px] uppercase font-mono mt-1 font-bold">TEXT_ATTACHMENT</span>
                    </div>
                  )}
                </div>

                {/* File metadata editable box */}
                <div className="flex-grow w-full space-y-2">
                  <input
                    type="text"
                    value={file.caption}
                    onChange={(e) => updateAttachmentField(file.id, 'caption', e.target.value)}
                    className="bg-transparent hover:bg-neutral-150/70 focus:bg-white focus:outline-none rounded text-xs font-bold text-neutral-900 w-full px-1"
                    placeholder="圖表/附件名稱 (如：圖 1.1 注意力熱圖)"
                  />
                  
                  <textarea
                    value={file.description}
                    onChange={(e) => updateAttachmentField(file.id, 'description', e.target.value)}
                    rows={2}
                    className="bg-transparent hover:bg-neutral-150/70 focus:bg-white focus:outline-none rounded text-[11px] leading-relaxed text-neutral-500 w-full px-1 resize-none h-[42px]"
                    placeholder="輸入該圖表包含的實驗參數、運算結論、結果說明..."
                  />
                </div>
              </div>

              {/* Delete overlay button (No-print) */}
              <button
                type="button"
                onClick={() => deleteAttachment(file.id)}
                className="no-print absolute top-2 right-2 p-1.5 bg-neutral-900/85 hover:bg-red-600 text-white rounded-full opacity-0 group-hover/file:opacity-100 transition-all pointer-events-auto shadow cursor-pointer scale-90"
                title="刪除此附件"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Technical / Workspace Notes Block 2 (Primary Workspace requested by user) */}
        <div className="mt-4 break-inside-avoid">
          <div className="flex items-center gap-1.5 pb-1.5 border-b border-neutral-200 mb-2.5">
            <FileCode className="w-4 h-4 text-neutral-500 no-print" />
            <input
              type="text"
              value={data.notesTitle2 || "自主探究筆記 / 行程規劃 / 簡報紀錄"}
              onChange={(e) => updateData({ notesTitle2: e.target.value })}
              className={`text-xs md:text-sm font-bold bg-transparent hover:bg-neutral-100/60 focus:bg-white focus:outline-none rounded px-1.5 py-0.5 w-full tracking-wide uppercase duration-150 ${theme.accentText}`}
              placeholder="編輯標題 (例如：四天極致行程規劃)"
            />
          </div>

          {/* Interactive Screen Display: Tabbed Widget to fit in a neat small block */}
          <div className="no-print border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs">
            {/* Header / Tabs Controller */}
            <div className="flex flex-wrap items-center justify-between border-b border-neutral-150 bg-neutral-50/80 px-3.5 py-2.5 gap-2 select-none">
              <div className="flex flex-wrap gap-1.5 items-center">
                {itineraryViewMode === 'preview' && (() => {
                  const days = parseItinerary(data.notes2 || "");
                  return days.map((day, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDayIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold tracking-wide transition-all duration-150 cursor-pointer ${
                        safeActiveIdx === idx
                          ? `${theme.accentBg} text-white shadow-xs`
                          : 'bg-white hover:bg-neutral-200/80 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {day.dayLabel}
                    </button>
                  ));
                })()}
              </div>

              {/* View/Edit toggle switcher */}
              <div className="flex gap-1 bg-neutral-200 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setItineraryViewMode('preview')}
                  className={`px-2.5 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer ${
                    itineraryViewMode === 'preview'
                      ? 'bg-white text-neutral-850 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  🗂️ 互動展示卡
                </button>
                <button
                  type="button"
                  onClick={() => setItineraryViewMode('edit')}
                  className={`px-2.5 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer ${
                    itineraryViewMode === 'edit'
                      ? 'bg-white text-neutral-850 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  ✍️ 自由編輯
                </button>
              </div>
            </div>

            {/* Content Container (Compact box with a scroll limit of 300px) */}
            <div className="p-4 bg-gradient-to-br from-neutral-50/50 to-white min-h-[160px] max-h-[340px] overflow-y-auto">
              {itineraryViewMode === 'edit' ? (
                <div className="space-y-1.5">
                  <textarea
                    ref={notes2Ref}
                    value={data.notes2 || ""}
                    onChange={(e) => updateData({ notes2: e.target.value })}
                    className="w-full bg-neutral-50/60 hover:bg-white focus:bg-white text-neutral-800 font-sans text-xs md:text-[13px] rounded-lg p-3 border border-neutral-200 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 leading-relaxed duration-150 focus:outline-none min-h-[160px]"
                    placeholder="請在此處輸入您的心得文字、行程規劃、或者是專題報告..."
                  />
                  <span className="text-[9.5px] text-neutral-400 font-medium block">✨ 提示：編輯後切換回「互動展示卡」可立即生成多日頁籤與精緻排版。</span>
                </div>
              ) : (() => {
                const days = parseItinerary(data.notes2 || "");
                const currentDay = days[safeActiveIdx];
                return currentDay ? (
                  <div className="space-y-3">
                    {/* Header / Subtitle of Selected Day */}
                    <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-neutral-800 tracking-wide flex items-center gap-1.5">
                        <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full ${theme.accentBg} text-white`}>
                          {currentDay.dayLabel}
                        </span>
                        {currentDay.title}
                      </h4>
                    </div>
                    
                    {/* Highlighted Body Content */}
                    {renderFormattedContent(currentDay.content)}
                  </div>
                ) : (
                  <div className="text-center py-6 text-neutral-400">
                    <p className="text-xs">目前無行程內容，請切換至「自由編輯」輸入您的行程規劃。</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Printable Layout: Automatically prints ALL days sequentially with premium spacing, hidden on computer screens */}
          <div className="hidden print:block space-y-4">
            {(() => {
              const days = parseItinerary(data.notes2 || "");
              return days.map((day, idx) => (
                <div key={idx} className="border border-neutral-200 rounded-xl p-4 bg-white break-inside-avoid">
                  <div className="pb-1.5 border-b border-neutral-200 mb-2.5">
                    <h4 className="text-xs font-bold text-neutral-800 tracking-wide">
                      {day.dayLabel}：{day.title}
                    </h4>
                  </div>
                  {renderFormattedContent(day.content)}
                </div>
              ));
            })()}
            {(!data.notes2 || data.notes2.trim() === "") && (
              <p className="text-[11px] text-neutral-400 italic">（無行程筆記內容）</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
