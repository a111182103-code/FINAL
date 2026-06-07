export interface CoverInfo {
  title: string;
  subtitle: string;
  courseName: string;
  department: string;
  studentName: string;
  studentId: string;
  professor: string;
  date: string;
}

export interface ReflectionData {
  paragraphs: string[];
  highlightTitle: string;
  highlightContent: string;
}

export interface TocItem {
  id: string;
  title: string;
  pageNum: string;
}

export interface TocData {
  title: string;
  subtitle: string;
  items: TocItem[];
}

export interface AttachmentFile {
  id: string;
  name: string;
  type: string; // 'image/*' | 'text/plain' etc
  dataUrl: string; // Base64 representation for persistence
  caption: string;
  description: string;
}

export interface AssignmentData {
  title: string;
  intro: string;
  files: AttachmentFile[];
  notes: string;
  notesTitle?: string;
  notes2?: string;
  notesTitle2?: string;
  portalUrl?: string;
  portalUrlImage?: string;
  portalUrlTitle?: string;
  portalUrlDesc?: string;
  tripoUrl?: string;
  tripoUrlImage?: string;
  tripoUrlTitle?: string;
  tripoUrlDesc?: string;
}

export interface ReportData {
  cover: CoverInfo;
  reflections: ReflectionData;
  toc: TocData;
  assignment: AssignmentData;
}

export type ReportTheme = 'academic' | 'modern' | 'elegant' | 'minimalist';

export interface ThemeStyles {
  id: ReportTheme;
  name: string;
  fontTitle: string;
  fontBody: string;
  borderColor: string;
  accentBg: string;
  accentText: string;
  coverLayout: string;
}
