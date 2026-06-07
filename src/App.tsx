import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  RotateCcw, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  RotateCw, 
  BookOpen, 
  ClipboardCheck, 
  Palette, 
  Eye, 
  FileText,
  Bookmark,
  Check,
  Award
} from 'lucide-react';

import { ReportData, ReportTheme, ThemeStyles, CoverInfo } from './types';
import { INITIAL_REPORT_DATA, THEMES } from './data';

import A4PageWrapper from './components/A4PageWrapper';
import CoverPage from './components/CoverPage';
import ReflectionsPage from './components/ReflectionsPage';
import IndexPage from './components/IndexPage';
import AssignmentPage from './components/AssignmentPage';

const LOCAL_STORAGE_KEY = 'a4_report_builder_draft_v2';

export default function App() {
  // Report Core State
  const [reportData, setReportData] = useState<ReportData>(INITIAL_REPORT_DATA);
  const [selectedThemeId, setSelectedThemeId] = useState<ReportTheme>('academic');
  const [zoomScale, setZoomScale] = useState<number>(0.85); // Default 85% is cozy on most screens
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeSection, setActiveSection] = useState<'global' | 'toc' | 'theme'>('global');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cover && parsed.reflections && parsed.toc && parsed.assignment) {
          // If notes2 is empty or not yet customized, prefill with the requested supreme itinerary
          if (!parsed.assignment.notes2 || parsed.assignment.notes2.trim() === "") {
            parsed.assignment.notes2 = INITIAL_REPORT_DATA.assignment.notes2;
            parsed.assignment.notesTitle2 = INITIAL_REPORT_DATA.assignment.notesTitle2;
          }
          // Ensure new portalUrl and tripoUrl fields are populated if they are currently absent
          if (!parsed.assignment.portalUrl) {
            parsed.assignment.portalUrl = INITIAL_REPORT_DATA.assignment.portalUrl;
            parsed.assignment.portalUrlImage = INITIAL_REPORT_DATA.assignment.portalUrlImage;
            parsed.assignment.portalUrlTitle = INITIAL_REPORT_DATA.assignment.portalUrlTitle;
            parsed.assignment.portalUrlDesc = INITIAL_REPORT_DATA.assignment.portalUrlDesc;
          }
          if (!parsed.assignment.tripoUrl) {
            parsed.assignment.tripoUrl = INITIAL_REPORT_DATA.assignment.tripoUrl;
            parsed.assignment.tripoUrlImage = INITIAL_REPORT_DATA.assignment.tripoUrlImage;
            parsed.assignment.tripoUrlTitle = INITIAL_REPORT_DATA.assignment.tripoUrlTitle;
            parsed.assignment.tripoUrlDesc = INITIAL_REPORT_DATA.assignment.tripoUrlDesc;
          }
          setReportData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse draft from localStorage", e);
      }
    }
  }, []);

  // Save to local storage with debounce effect
  useEffect(() => {
    setSavingStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reportData));
      setSavingStatus('saved');
      const resetIdle = setTimeout(() => setSavingStatus('idle'), 1500);
      return () => clearTimeout(resetIdle);
    }, 600);

    return () => clearTimeout(timer);
  }, [reportData]);

  // Find active theme styles
  const activeTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];

  // Handle Cover field change
  const handleCoverChange = (field: keyof CoverInfo, value: string) => {
    setReportData(prev => ({
      ...prev,
      cover: {
        ...prev.cover,
        [field]: value
      }
    }));
  };

  // Reset to template
  const handleLoadSample = () => {
    if (window.confirm("確定要重新載入人工智慧導論專題的範例報告嗎？這將會覆蓋您目前的編輯內容。")) {
      setReportData(INITIAL_REPORT_DATA);
    }
  };

  // Reset to blank
  const handleResetBlank = () => {
    if (window.confirm("確定要清空整份報告嗎？這將提供空白範本以便您填入自定義科系與檔案。")) {
      setReportData({
        cover: {
          title: "請點擊此處輸入報告主標題",
          subtitle: "在此處輸入副標題（可選）",
          courseName: "請輸入課程名稱",
          department: "請輸入學校系所名稱",
          studentName: "您的名字",
          studentId: "您的學號",
          professor: "指導老師或教授",
          date: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        reflections: {
          paragraphs: [
            "請在此處撰寫您的第一段心得反思...",
            "請在此處撰寫您的第二段心得反思..."
          ],
          highlightTitle: "心得小結總覽",
          highlightContent: "在此處寫下您最核心的一句話心得。"
        },
        toc: {
          title: "目錄 Table of Contents",
          subtitle: "報告目錄結構說明",
          items: [
            { id: "1", title: "壹、 前言與動機", pageNum: "1" },
            { id: "2", title: "貳、 核心內容探討", pageNum: "2" },
            { id: "3", title: "參、 個人學習心得", pageNum: "3" },
            { id: "4", title: "肆、 成果附件與展示", pageNum: "4" }
          ]
        },
        assignment: {
          title: "實作成果與佐證展示",
          intro: "在此處介紹您的實作作業。您可以使用右方工具列或直接拖曳檔案上傳圖片，在此處嵌入您的作業截圖與報告檔案。",
          files: [],
          notes: "# 程式附註或實驗札記\n在這裡可以寫下您的代碼筆記，或者是從外部匯入 txt 代碼內容...\n",
          notesTitle2: "自主探究筆記 / 行程規劃 / 簡報紀錄",
          notes2: "",
          portalUrl: "https://sites.google.com/nkust.edu.tw/jalsjasljddjoaidjpafjpfkpakf/%E9%A6%96%E9%A0%81#h.b18zj4domaem",
          portalUrlImage: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=1200",
          portalUrlTitle: "國立高雄科技大學（NKUST）自主學習專題平台 · 歷程節點",
          portalUrlDesc: "本外部專題成果整合 Google Sites 平台之特別許可學習歷程節點。主要展示了針對未來精英差旅與日本頂級文化融合的科技化輔助決策物。",
          tripoUrl: "https://studio.tripo3d.ai/3d-model/b5345719-2b38-4dd1-b077-6ee1cb4cafb2?invite_code=HF6UKF",
          tripoUrlImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
          tripoUrlTitle: "Tripo3D 智慧生成數位雙生 · 3D 動態模型節點",
          tripoUrlDesc: "本外部 3D 模型節點整合 Tripo3D 智慧生成平台。透過高精度 AI 演算法，針對未來智慧差旅載具、頂奢空間格局與歷史文化地標進行 3D 擬真建模。"
        }
      });
    }
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Quick navigation to page anchors
  const scrollToPage = (pageNum: number) => {
    const el = document.getElementById(`a4-page-${pageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-neutral-100 flex flex-col font-sans select-text">
      
      {/* Universal Head Panel (No-print) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-5 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 text-white p-1.5 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-wide text-white font-display">A4 REPORT CREATOR</h1>
              <span className="text-[9px] bg-slate-800 text-slate-400 py-0.5 px-1.5 rounded font-mono font-bold">V2.4</span>
            </div>
            <p className="text-[10px] text-slate-400">專為 A4 精美書面報告、作業 PDF 設計的雲端編輯與排版系統</p>
          </div>
        </div>

        {/* Action Header bar */}
        <div className="flex items-center gap-3">
          
          {/* File state indicator */}
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              savingStatus === 'saved' ? 'bg-emerald-500' : (savingStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600')
            }`} />
            {savingStatus === 'saved' && "草稿已自動儲存"}
            {savingStatus === 'saving' && "自動儲存中..."}
            {savingStatus === 'idle' && "儲存於本機瀏覽器"}
          </div>

          <div className="w-[1px] h-4 bg-slate-800"></div>

          {/* Quick presets loaders */}
          <button
            onClick={handleLoadSample}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="載入預設的 AI 報告範例"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 載入範例
          </button>
          
          <button
            onClick={handleResetBlank}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="清空為空白報告範本"
          >
            <RotateCw className="w-3.5 h-3.5" /> 重設空白
          </button>

          {/* Major Print PDF Action */}
          <button
            onClick={handlePrint}
            className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-1.5 rounded-md flex items-center gap-1.5 shadow-md shadow-indigo-900/40 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            title="開起列印視窗，另存成 PDF 檔案"
          >
            <Printer className="w-4 h-4" /> 一鍵列印 / 存為 PDF
          </button>
        </div>
      </header>

      {/* Main Workdeck (No-print) / Print Deck split */}
      <div className="flex-grow flex flex-col lg:flex-row shadow-inner">
        
        {/* Left Control Dashboard Area (no-print) */}
        <aside className="no-print w-full lg:w-[350px] shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col justify-between sticky top-[53px] lg:h-[calc(100vh-53px)] overflow-y-auto">
          <div className="p-5 space-y-6">
            
            {/* Nav anchors list */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                快速定位分頁 ( A4 REPORT PAGES )
              </span>
              <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                {[
                  { page: 1, label: '封面' },
                  { page: 2, label: '心得' },
                  { page: 3, label: '目錄' },
                  { page: 4, label: '作業' }
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => scrollToPage(item.page)}
                    className="py-2 px-1 text-center bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 text-slate-300 hover:text-white rounded text-xs font-semibold tracking-wide transition-all cursor-pointer flex flex-col items-center gap-1"
                  >
                    <span className="text-[9px] font-mono opacity-50">PAGE</span>
                    <span className="font-bold">0{item.page}</span>
                    <span className="text-[10px] font-medium text-slate-400">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-slate-800"></div>

            {/* Panel Tabs Controls */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-850">
              <button
                onClick={() => setActiveSection('global')}
                className={`flex-1 py-1 px-2 text-center rounded text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  activeSection === 'global' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 封面資料
              </button>
              <button
                onClick={() => setActiveSection('toc')}
                className={`flex-1 py-1 px-2 text-center rounded text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  activeSection === 'toc' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> 目錄/作業
              </button>
              <button
                onClick={() => setActiveSection('theme')}
                className={`flex-1 py-1 px-2 text-center rounded text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 ${
                  activeSection === 'theme' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> 樣式風格
              </button>
            </div>

            {/* Active section settings fields form */}
            <div className="space-y-4">
              {activeSection === 'global' && (
                <div className="space-y-3.5">
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-850">
                    <p className="text-[11px] text-slate-400 leading-normal mb-1.5 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <strong>雙重編輯模式支援</strong>
                    </p>
                    <span className="text-[10px] text-slate-500 block leading-relaxed">
                      您可以直接點擊右側 A4 紙張上的任何文字、段落、或圖片欄位進行即時修改，或使用左側此表單填寫，兩者將會即時同步！
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 tracking-wider">報告主要標題</label>
                    <textarea
                      value={reportData.cover.title}
                      onChange={(e) => handleCoverChange('title', e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      placeholder="例如：深度學習專案心得書面報告"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 tracking-wider">報告副標題 (可選)</label>
                    <input
                      type="text"
                      value={reportData.cover.subtitle}
                      onChange={(e) => handleCoverChange('subtitle', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 tracking-wider">學校科系 / 班級</label>
                    <input
                      type="text"
                      value={reportData.cover.department}
                      onChange={(e) => handleCoverChange('department', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 tracking-wider">課程名稱</label>
                    <input
                      type="text"
                      value={reportData.cover.courseName}
                      onChange={(e) => handleCoverChange('courseName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 tracking-wider">姓名</label>
                      <input
                        type="text"
                        value={reportData.cover.studentName}
                        onChange={(e) => handleCoverChange('studentName', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 tracking-wider">學號</label>
                      <input
                        type="text"
                        value={reportData.cover.studentId}
                        onChange={(e) => handleCoverChange('studentId', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-center font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 tracking-wider">指導老師 / 職稱</label>
                      <input
                        type="text"
                        value={reportData.cover.professor}
                        onChange={(e) => handleCoverChange('professor', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 tracking-wider">填表時間</label>
                      <input
                        type="text"
                        value={reportData.cover.date}
                        onChange={(e) => handleCoverChange('date', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-center text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'toc' && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-850 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0" /> 第三頁目錄 & 第四頁附件管理
                    </p>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      為提升書面排版自由度，推薦您在右網格 A4 中<b>直接對目錄行做增刪/改名</b>。此處為快速項目引導：
                    </p>
                    <ol className="text-[10px] text-slate-400 space-y-1 pl-4 list-decimal">
                      <li>點擊右側 A4 <b className="text-white">目錄 P. 項目</b> 即可手動改寫數字或名稱。</li>
                      <li>滑鼠移到目錄行，右邊會出現 <b className="text-emerald-400">上/下箭頭</b> 排順序或垃圾桶刪除。</li>
                      <li>在第四頁，可以直接將本機 <b className="text-white">程式截圖</b> 拖入虛線框，系統會生成圖說與圖 1.1 精美圖形區。</li>
                    </ol>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 tracking-wider">第四頁作業區引言</label>
                    <textarea
                      value={reportData.assignment.intro}
                      onChange={(e) => setReportData(prev => ({
                        ...prev,
                        assignment: { ...prev.assignment, intro: e.target.value }
                      }))}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md text-xs p-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'theme' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider block mb-2">
                      選取視覺風格學術主題 ( REPORT SCENARIO THEMES )
                    </span>
                    <div className="space-y-2">
                      {THEMES.map((theme) => {
                        const isSelected = selectedThemeId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedThemeId(theme.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-slate-800 border-indigo-500 text-white shadow-md'
                                : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-750 hover:bg-slate-900'
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-neutral-200">{theme.name}</p>
                              <span className="text-[10px] text-slate-500 block">
                                {theme.id === 'academic' && "襯線字型、傳統嚴謹、學院必備"}
                                {theme.id === 'modern' && "無襯線字、科技藍青、簡報質感"}
                                {theme.id === 'elegant' && "雙線相框、人文精緻、文史心得"}
                                {theme.id === 'minimalist' && "單線、純白黑灰、前衛極簡"}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="bg-indigo-600 text-white p-1 rounded-full shadow-sm">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800"></div>

                  {/* Document Zoom settings */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-400 tracking-wider uppercase">螢幕預覽比例 (SCALE FILTER)</span>
                      <span className="font-mono text-indigo-400 font-bold">{Math.round(zoomScale * 100)}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setZoomScale(p => Math.max(0.5, p - 0.05))}
                        disabled={zoomScale <= 0.5}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 cursor-pointer"
                        title="縮小"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      
                      <input
                        type="range"
                        min="0.5"
                        max="1.2"
                        step="0.05"
                        value={zoomScale}
                        onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                        className="flex-grow accent-indigo-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                      />

                      <button
                        onClick={() => setZoomScale(p => Math.min(1.2, p + 0.05))}
                        disabled={zoomScale >= 1.25}
                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 cursor-pointer"
                        title="放大"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block italic leading-normal">
                      註：僅影響螢幕呈現舒適度。無論預覽比例大或小，列印時皆會自動以 100% 精準對齊 A4 標準紙張。
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick print guide in side foot */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-900 space-y-1 text-[10px] text-slate-500">
            <span className="font-bold text-slate-400 block">🖨️ PDF 列印撇步：</span>
            <p className="leading-normal">
              在列印視窗中，目標請選擇為<b>「另存為 PDF」</b>，並展開下方「更多設定」<b>關閉「頁首及頁尾」</b>並勾選<b>「背景圖形」</b>即可匯出最完美極致 A4 質感！
            </p>
          </div>
        </aside>

        {/* Right Scrollable Paper Canvas Deck */}
        <main className="flex-grow bg-slate-800/60 overflow-y-auto px-4 py-8 flex flex-col items-center select-text relative scroll-smooth print-area">
          
          <div className="no-print absolute top-2 right-4 flex items-center gap-1 bg-slate-900/80 border border-slate-850 py-1 px-2.5 rounded text-[10px] font-semibold text-slate-400 z-10 font-mono tracking-wide shadow-sm backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5" /> WYSIWYG A4 DECK PREVIEW
          </div>

          {/* Wrapper for scalable translation origin-top */}
          <div 
            style={{ 
              transform: `scale(${zoomScale})`, 
              transformOrigin: 'top center',
              marginBottom: `calc((297mm * ${zoomScale}) - 297mm)` // Compensate space collapse when scale changes
            }}
            className="transition-transform duration-150 ease-out origin-top w-full max-w-[210mm] flex flex-col print:transform-none print:m-0 print:max-w-none"
          >
            {/* Sheet Page 1: 封面 Cover */}
            <A4PageWrapper pageNum={1} showHeader={false} showFooter={false} theme={activeTheme}>
              <CoverPage 
                data={reportData.cover} 
                onChange={handleCoverChange} 
                theme={activeTheme} 
              />
            </A4PageWrapper>

            {/* Sheet Page 2: 心得 Reflections */}
            <A4PageWrapper pageNum={2} theme={activeTheme} headerText={reportData.cover.courseName}>
              <ReflectionsPage 
                data={reportData.reflections} 
                onChange={(updated) => setReportData(prev => ({ ...prev, reflections: updated }))} 
                theme={activeTheme} 
              />
            </A4PageWrapper>

            {/* Sheet Page 3: 目錄 TOC Index */}
            <A4PageWrapper pageNum={3} theme={activeTheme} headerText={reportData.cover.courseName}>
              <IndexPage 
                data={reportData.toc}
                onChange={(updated) => setReportData(prev => ({ ...prev, toc: updated }))}
                theme={activeTheme}
              />
            </A4PageWrapper>

            {/* Sheet Page 4: 作業區 Workspace Attachments */}
            <A4PageWrapper pageNum={4} theme={activeTheme} headerText={reportData.cover.courseName}>
              <AssignmentPage 
                data={reportData.assignment}
                onChange={(updated) => setReportData(prev => ({ ...prev, assignment: updated }))}
                theme={activeTheme}
              />
            </A4PageWrapper>

          </div>
        </main>

      </div>
    </div>
  );
}
