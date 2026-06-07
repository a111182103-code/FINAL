import { CoverInfo, ThemeStyles } from '../types';
import { BookOpen, GraduationCap, User, FileSpreadsheet, Sparkles, Award } from 'lucide-react';

interface CoverPageProps {
  data: CoverInfo;
  onChange: (field: keyof CoverInfo, value: string) => void;
  theme: ThemeStyles;
}

export default function CoverPage({ data, onChange, theme }: CoverPageProps) {
  const renderLayout = () => {
    switch (theme.id) {
      case 'academic':
        return (
          <div className="flex-grow flex flex-col justify-between border-4 border-double border-[#1e3a8a] p-10 h-full relative">
            {/* Header badges */}
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-[#1e3a8a] font-semibold border-b-2 border-[#1e3a8a]/40 pb-1 inline-block">
                ★ 學生學術專題報告 ★
              </span>
            </div>

            {/* Course & Major */}
            <div className="space-y-4 mt-8 text-center text-neutral-700">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1e3a8a]" />
                <input
                  type="text"
                  value={data.department}
                  onChange={(e) => onChange('department', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-center w-64 text-sm font-semibold tracking-wide"
                  placeholder="學校與科系名稱"
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1e3a8a]" />
                <input
                  type="text"
                  value={data.courseName}
                  onChange={(e) => onChange('courseName', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-center w-64 text-sm font-semibold tracking-wide"
                  placeholder="學科/課程名稱"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center my-auto space-y-6 px-4">
              <div className="w-16 h-1 bg-[#1e3a8a] mx-auto"></div>
              <textarea
                value={data.title}
                onChange={(e) => onChange('title', e.target.value)}
                rows={3}
                className="bg-transparent hover:bg-neutral-100/50 focus:bg-white focus:outline-none text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 text-center w-full resize-none font-serif leading-relaxed"
                placeholder="報告標題 (A4 第一頁)"
              />
              <textarea
                value={data.subtitle}
                onChange={(e) => onChange('subtitle', e.target.value)}
                rows={2}
                className="bg-transparent hover:bg-neutral-100/50 focus:bg-white focus:outline-none text-sm text-neutral-500 text-center w-full resize-none font-serif italic"
                placeholder="報告副標題"
              />
              <div className="w-16 h-1 bg-[#1e3a8a] mx-auto"></div>
            </div>

            {/* Student metadata table */}
            <div className="w-full max-w-sm mx-auto mb-10 pt-8 border-t border-dashed border-[#1e3a8a]/30">
              <div className="grid grid-cols-12 gap-y-3.5 text-sm">
                <div className="col-span-4 text-right pr-4 font-bold text-[#1e3a8a]">作者姓名：</div>
                <div className="col-span-8 border-b border-[#1e3a8a]/50">
                  <input
                    type="text"
                    value={data.studentName}
                    onChange={(e) => onChange('studentName', e.target.value)}
                    className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full pb-0.5 tracking-wide"
                  />
                </div>

                <div className="col-span-4 text-right pr-4 font-bold text-[#1e3a8a]">學號代碼：</div>
                <div className="col-span-8 border-b border-[#1e3a8a]/50">
                  <input
                    type="text"
                    value={data.studentId}
                    onChange={(e) => onChange('studentId', e.target.value)}
                    className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full pb-0.5 tracking-wide font-mono"
                  />
                </div>

                <div className="col-span-4 text-right pr-4 font-bold text-[#1e3a8a]">指導教授：</div>
                <div className="col-span-8 border-b border-[#1e3a8a]/50">
                  <input
                    type="text"
                    value={data.professor}
                    onChange={(e) => onChange('professor', e.target.value)}
                    className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full pb-0.5 tracking-wide"
                  />
                </div>

                <div className="col-span-4 text-right pr-4 font-bold text-[#1e3a8a]">填表日期：</div>
                <div className="col-span-8 border-b border-[#1e3a8a]/50">
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => onChange('date', e.target.value)}
                    className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded w-full pb-0.5 tracking-wide"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="flex-grow flex flex-col justify-between h-full relative font-sans">
            {/* Cyber stripe styling on top */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-[#0f766e]"></div>

            {/* Org Header */}
            <div className="flex items-center justify-between pt-6 text-xs text-neutral-500 font-mono tracking-widest">
              <span className="flex items-center gap-1.5 font-bold text-[#0f766e]">
                <Sparkles className="w-3.5 h-3.5" /> DIGITAL COGNITION REPORT
              </span>
              <span>VER 37.2</span>
            </div>

            {/* Main Center info with design block */}
            <div className="my-auto space-y-12">
              <div className="space-y-3 border-l-4 border-[#0f766e] pl-5">
                <input
                  type="text"
                  value={data.department}
                  onChange={(e) => onChange('department', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-xs uppercase font-bold text-neutral-500 tracking-wider w-full"
                />
                <input
                  type="text"
                  value={data.courseName}
                  onChange={(e) => onChange('courseName', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-sm text-[#0f766e] font-semibold tracking-wide w-full"
                />
              </div>

              {/* Mega Title Box */}
              <div className="space-y-6">
                <textarea
                  value={data.title}
                  onChange={(e) => onChange('title', e.target.value)}
                  rows={3}
                  className="bg-transparent hover:bg-neutral-100/50 focus:bg-white focus:outline-none text-3xl font-black tracking-tight text-neutral-950 w-full resize-none leading-snug"
                  placeholder="主標題"
                />
                <textarea
                  value={data.subtitle}
                  onChange={(e) => onChange('subtitle', e.target.value)}
                  rows={2}
                  className="bg-transparent hover:bg-neutral-100/50 focus:bg-white focus:outline-none text-sm text-neutral-500 w-full resize-none font-medium leading-relaxed"
                  placeholder="副標題"
                />
              </div>

              {/* Graphic Element */}
              <div className="h-[2px] bg-gradient-to-r from-[#0f766e] via-[#0f766e]/30 to-transparent w-3/4"></div>
            </div>

            {/* Standard aligned grids for student information */}
            <div className="bg-neutral-50 border border-neutral-150 rounded-lg p-5">
              <div className="grid grid-cols-2 gap-4 text-xs font-sans text-neutral-600">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">STUDENT AUTHOR / 研究員</span>
                  <div className="flex gap-2 items-center">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={data.studentName}
                      onChange={(e) => onChange('studentName', e.target.value)}
                      className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded font-bold text-neutral-900 w-full py-0.5"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">STUDENT ID / 學號</span>
                  <div className="flex gap-2 items-center">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={data.studentId}
                      onChange={(e) => onChange('studentId', e.target.value)}
                      className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded font-mono text-neutral-900 w-full py-0.5 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">SUPERVISOR / 指導</span>
                  <input
                    type="text"
                    value={data.professor}
                    onChange={(e) => onChange('professor', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded font-semibold text-neutral-800 w-full py-0.5"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider">DATE / 發行日期</span>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => onChange('date', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-800 w-full py-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'elegant':
        return (
          <div className="flex-grow flex flex-col justify-between h-full border-t-[8px] border-[#991b1b] px-6 py-4 font-serif">
            {/* Top decorative crest */}
            <div className="text-center pt-8">
              <Award className="w-8 h-8 text-[#991b1b] mx-auto opacity-80" />
              <div className="text-[10px] tracking-[0.2em] text-[#991b1b] font-bold uppercase mt-2">
                H U M A N I T I E S  &  A M B I E N C E  S E R I E S
              </div>
            </div>

            {/* Course Information */}
            <div className="text-center mt-12 space-y-2">
              <input
                type="text"
                value={data.department}
                onChange={(e) => onChange('department', e.target.value)}
                className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-center text-xs tracking-[0.1em] text-neutral-500 w-1/2"
              />
              <div className="w-1.5 h-1.5 rounded-full bg-[#991b1b] mx-auto opacity-40my-4"></div>
              <input
                type="text"
                value={data.courseName}
                onChange={(e) => onChange('courseName', e.target.value)}
                className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-center text-xs font-semibold tracking-wider text-neutral-600 block mx-auto w-1/2"
              />
            </div>

            {/* Title Block */}
            <div className="text-center my-auto space-y-6 max-w-lg mx-auto">
              <textarea
                value={data.title}
                onChange={(e) => onChange('title', e.target.value)}
                rows={3}
                className="bg-transparent hover:bg-red-50/50 focus:bg-white focus:outline-none text-2xl md:text-3xl font-serif text-neutral-800 font-bold leading-relaxed text-center w-full resize-none border-b border-rose-100 pb-4"
                placeholder="報告主標題"
              />
              <textarea
                value={data.subtitle}
                onChange={(e) => onChange('subtitle', e.target.value)}
                rows={2}
                className="bg-transparent hover:bg-red-50/50 focus:bg-white focus:outline-none text-xs italic text-neutral-400 text-center w-full resize-none"
                placeholder="報告副標題"
              />
            </div>

            {/* Bottom details block aligned elegantly */}
            <div className="border-t border-[#991b1b]/30 pt-6 pb-10">
              <div className="flex justify-around items-center text-[11px] font-sans text-neutral-600 tracking-wider">
                <div className="space-y-1 text-center">
                  <span className="text-[9px] uppercase text-neutral-400 block font-bold">WRITTEN BY</span>
                  <input
                    type="text"
                    value={data.studentName}
                    onChange={(e) => onChange('studentName', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded font-bold text-neutral-800 text-center w-24 py-0.5"
                  />
                  <input
                    type="text"
                    value={data.studentId}
                    onChange={(e) => onChange('studentId', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-400 text-center w-24 text-[9px] block font-mono"
                  />
                </div>

                <div className="w-[1px] h-6 bg-[#991b1b]/20"></div>

                <div className="space-y-1 text-center">
                  <span className="text-[9px] uppercase text-neutral-400 block font-bold">INSTRUCTOR</span>
                  <input
                    type="text"
                    value={data.professor}
                    onChange={(e) => onChange('professor', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-800 font-semibold text-center w-28 py-0.5"
                  />
                </div>

                <div className="w-[1px] h-6 bg-[#991b1b]/20"></div>

                <div className="space-y-1 text-center">
                  <span className="text-[9px] uppercase text-neutral-400 block font-bold">SUBMITTED ON</span>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => onChange('date', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-800 text-center w-28 py-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'minimalist':
        return (
          <div className="flex-grow flex flex-col justify-between h-full font-mono text-neutral-900 border-l-[1px] border-neutral-200 pl-8 pr-2 py-4">
            {/* Minimalist Grid header */}
            <div className="text-[10px] text-neutral-400 flex flex-col gap-1 tracking-widest uppercase">
              <span>REPORT_TYPE: TECHNICAL_MEMO</span>
              <span>CLASSIFICATION: OPEN_ACCESS</span>
            </div>

            {/* Huge bold title stacked in the middle-top */}
            <div className="my-auto space-y-10">
              <div className="space-y-2">
                <input
                  type="text"
                  value={data.courseName}
                  onChange={(e) => onChange('courseName', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-[11px] font-bold text-neutral-500 uppercase tracking-widest w-full"
                />
                <input
                  type="text"
                  value={data.department}
                  onChange={(e) => onChange('department', e.target.value)}
                  className="bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none rounded text-[10px] text-neutral-400 block w-full"
                />
              </div>

              <div className="space-y-4">
                <textarea
                  value={data.title}
                  onChange={(e) => onChange('title', e.target.value)}
                  rows={2}
                  className="bg-transparent hover:bg-neutral-100/50 focus:bg-white focus:outline-none text-2xl font-black tracking-tight text-neutral-950 w-full resize-none leading-snug font-sans"
                  placeholder="編輯主標題"
                />
                <textarea
                  value={data.subtitle}
                  onChange={(e) => onChange('subtitle', e.target.value)}
                  rows={2}
                  className="bg-transparent hover:bg-neutral-100/50 focus:bg-white focus:outline-none text-xs text-neutral-500 w-full resize-none font-sans"
                  placeholder="編輯副標題"
                />
              </div>
            </div>

            {/* Grid for student metadata at the very bottom */}
            <div className="border-t border-neutral-200 pt-8 pb-4 space-y-4 text-[11px] text-neutral-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">STUDENT //</span>
                  <input
                    type="text"
                    value={data.studentName}
                    onChange={(e) => onChange('studentName', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-900 font-bold w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">ID_CODE //</span>
                  <input
                    type="text"
                    value={data.studentId}
                    onChange={(e) => onChange('studentId', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded font-mono text-neutral-900 w-full font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">COACH //</span>
                  <input
                    type="text"
                    value={data.professor}
                    onChange={(e) => onChange('professor', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-800 w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">DATE_MARK //</span>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => onChange('date', e.target.value)}
                    className="bg-transparent hover:bg-neutral-100 focus:bg-white focus:outline-none rounded text-neutral-800 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-4">
      {renderLayout()}
    </div>
  );
}
