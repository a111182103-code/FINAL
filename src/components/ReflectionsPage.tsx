import { ReflectionData, ThemeStyles } from '../types';
import { PlusCircle, Trash2, AlignLeft, Info } from 'lucide-react';

interface ReflectionsPageProps {
  data: ReflectionData;
  onChange: (data: ReflectionData) => void;
  theme: ThemeStyles;
}

export default function ReflectionsPage({ data, onChange, theme }: ReflectionsPageProps) {
  
  // Handle changing specific paragraph text
  const handleParagraphChange = (index: number, value: string) => {
    const updatedParagraphs = [...data.paragraphs];
    updatedParagraphs[index] = value;
    onChange({
      ...data,
      paragraphs: updatedParagraphs
    });
  };

  // Add new blank paragraph
  const addParagraph = () => {
    onChange({
      ...data,
      paragraphs: [...data.paragraphs, '']
    });
  };

  // Delete a paragraph
  const deleteParagraph = (index: number) => {
    if (data.paragraphs.length <= 1) {
      // Keep at least one empty
      onChange({
        ...data,
        paragraphs: ['']
      });
      return;
    }
    const updatedParagraphs = data.paragraphs.filter((_, i) => i !== index);
    onChange({
      ...data,
      paragraphs: updatedParagraphs
    });
  };

  // Handle callout/box changes
  const handleCalloutChange = (field: 'highlightTitle' | 'highlightContent', value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Total word counts
  const totalCharacters = data.paragraphs.reduce((acc, p) => acc + p.length, 0) + 
                          data.highlightTitle.length + 
                          data.highlightContent.length;

  return (
    <div className="w-full h-full flex flex-col pt-2 font-sans">
      {/* Title block based on themes */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          {theme.id === 'modern' && (
            <span className="text-xl font-bold text-[#0f766e] bg-[#0f766e]/10 py-0.5 px-2 rounded">
              02
            </span>
          )}
          <h1 className={`text-xl md:text-2xl font-bold text-neutral-900 tracking-tight ${theme.fontTitle}`}>
            學習與課程心得反思
          </h1>
        </div>
        <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-mono">
          REFLECTIVE THOUGHTS & LEARNING REVELATIONS
        </p>
        <div className={`h-1 w-20 ${theme.accentBg} mt-3`}></div>
      </div>



      <div className="flex-grow flex flex-col justify-between">
        {/* Paragraph List */}
        <div className="space-y-4">
          {data.paragraphs.map((para, idx) => (
            <div key={idx} className="relative group/para flex items-start gap-2">
              {/* Vertical accent bars based on themes */}
              <div className={`w-1 self-stretch rounded-full shrink-0 ${theme.accentBg} opacity-0 group-hover/para:opacity-20`}></div>
              
              <div className="flex-grow">
                <textarea
                  value={para}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  rows={para.length > 100 ? 4 : (para.length > 50 ? 3 : 2)}
                  className={`bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-blue-100 focus:outline-none rounded text-xs leading-relaxed text-neutral-700 w-full resize-none pb-1 transition-all ${
                    theme.id === 'academic' || theme.id === 'elegant' ? 'font-serif indent-6' : 'font-sans'
                  }`}
                  placeholder={`請在此處撰寫心得第 ${idx + 1} 段...`}
                />
              </div>

              {/* Action Buttons (Hover triggers) */}
              <div className="no-print absolute right-0 -top-2 flex items-center bg-white/90 shadow-sm border border-neutral-100 rounded opacity-0 group-hover/para:opacity-100 transition-opacity p-0.5">
                <button
                  type="button"
                  onClick={() => deleteParagraph(idx)}
                  className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                  title="刪除此段落"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Paragraph Trigger */}
          <div className="no-print pt-2 flex justify-start">
            <button
              type="button"
              onClick={addParagraph}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-medium px-2 py-1 rounded border border-dashed border-neutral-200 hover:border-neutral-400 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              新增心得段落
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
