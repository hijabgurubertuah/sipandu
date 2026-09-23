import React, { useState, useEffect, useRef } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  X,
  FileText,
  Code,
  Sparkles,
  Image as ImageIcon,
  Link2,
  HardDrive,
  Upload,
  Eye,
  Edit3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Smile,
  Check,
  Globe,
  Save,
  Send,
  Trash2,
  CloudUpload,
  ChevronDown
} from 'lucide-react';
import type { NewsAnnouncement } from '../types';

export interface GalleryPhotoItem {
  id: string;
  title: string;
  url: string;
}

interface NewsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NewsAnnouncement | null;
  onSave: (news: NewsAnnouncement, isPublishToCloud: boolean) => Promise<void> | void;
  galleryPhotos?: GalleryPhotoItem[];
}

export default function NewsEditorModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  galleryPhotos = []
}: NewsEditorModalProps) {
  useBodyScrollLock(isOpen);
  
  const [mode, setMode] = useState<'berita' | 'embed'>('berita');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prestasi');
  const [customCategory, setCustomCategory] = useState('');
  const [author, setAuthor] = useState('Humas Instansi');
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  );
  const [coverType, setCoverType] = useState<'drive' | 'galeri' | 'link'>('drive');
  const [imageUrl, setImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'preview'>('editor');
  const [fontSize, setFontSize] = useState<number>(14);
  const [selectedColor, setSelectedColor] = useState<string>('#1e293b');
  const [highlightColor, setHighlightColor] = useState<string>('transparent');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to parse legacy basic Markdown into HTML format for the WYSIWYG editor
  const convertMarkdownToHtml = (md: string): string => {
    if (!md) return '';
    let html = md;
    // Replace bold **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    // Replace italic *text* or _text_
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    // Replace bullet points \n- item
    html = html.replace(/\n-\s(.*?)(?=\n|$)/g, '<li>$1</li>');
    // Wrap li in ul
    if (html.includes('<li>')) {
      html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    }
    // Replace newlines with <br>
    html = html.replace(/\n/g, '<br>');
    return html;
  };

  // Initialize or reset form when modal opens or initialData changes
  useEffect(() => {
    let initialContent = '';
    if (initialData) {
      setTitle(initialData.title || '');
      const standardCategories = ['Prestasi', 'Layanan', 'Kesehatan', 'Pengumuman', 'Edukasi Kesehatan', 'Promosi Kesehatan', 'Akademik', 'Kegiatan', 'Inovasi', 'Umum'];
      if (standardCategories.includes(initialData.category)) {
        setCategory(initialData.category);
        setCustomCategory('');
      } else {
        setCategory('Lainnya');
        setCustomCategory(initialData.category || '');
      }
      setAuthor(initialData.author || 'Humas Instansi');
      setDate(initialData.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }));
      setImageUrl(initialData.imageUrl || '');
      setExcerpt(initialData.excerpt || '');
      initialContent = initialData.content || '';
      setEmbedCode(initialData.embedCode || '');
      setMode(initialData.isEmbed ? 'embed' : 'berita');
      setCoverType((initialData.coverType === 'webp' ? 'drive' : (initialData.coverType || 'drive')) as any);
    } else {
      setTitle('');
      setCategory('Prestasi');
      setCustomCategory('');
      setAuthor('Humas Instansi');
      setDate(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }));
      setImageUrl('');
      setExcerpt('');
      initialContent = '';
      setEmbedCode('');
      setMode('berita');
      setCoverType('drive');
    }

    // Convert basic markdown tags to HTML format for live rich editing
    const convertedHtml = initialContent.includes('<') ? initialContent : convertMarkdownToHtml(initialContent);
    setContent(convertedHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = convertedHtml;
    }

    setActiveSubTab('editor');
    setIsUploading(false);
    setUploadProgress('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Execute standard DOM formatting commands on the contentEditable editor
  const execFormatter = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Quick Emoji Picker list
  const emojis = ['🏥', '🩺', '💊', '📢', '🏆', '⭐', '📅', '📌', '✨', '💉', '❤️', '👨‍⚕️', '👩‍⚕️', '🔬', '🚑', '📊', '✅', '💡'];

  // Color options
  const colorOptions = [
    { name: 'Hitam / Gelap', value: '#1e293b' },
    { name: 'Biru Utama', value: '#2563eb' },
    { name: 'Hijau Emerald', value: '#059669' },
    { name: 'Amber / Oranye', value: '#d97706' },
    { name: 'Merah Rose', value: '#e11d48' },
    { name: 'Ungu Indigo', value: '#7c3aed' }
  ];

  const highlightOptions = [
    { name: 'Tanpa Stabilo', value: 'transparent' },
    { name: 'Kuning Terang', value: '#fef08a' },
    { name: 'Hijau Muda', value: '#bbf7d0' },
    { name: 'Biru Lembut', value: '#bfdbfe' },
    { name: 'Merah Muda', value: '#fbcfe8' }
  ];

  // Handle local file image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress('Membaca berkas...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64); // Show local preview instantly

      const appScriptUrl = localStorage.getItem('sipandu_gas_url') || 'https://script.google.com/macros/s/AKfycbwUYbOQB31xIjCPtwbXF01CyDUs9d9X5cQP5NZPXksFNJIXnDhfsCdBSB8G9qyK6v2Qtg/exec';
      const driveFolderId = localStorage.getItem('sipandu_drive_folder_id') || '';

      if (appScriptUrl && base64.startsWith('data:')) {
        setUploadProgress('Menyimpan banner ke Google Drive...');
        try {
          const base64Content = base64.split(',')[1] || base64;
          const res = await fetch(appScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'uploadImage',
              fileName: file.name,
              mimeType: file.type || 'image/jpeg',
              base64: base64Content,
              category: 'banner',
              folderId: driveFolderId || undefined
            })
          });

          if (res.ok) {
            const result = await res.json();
            if (result.status === 'success' && (result.thumbnailUrl || result.driveUrl)) {
              setImageUrl(result.thumbnailUrl || result.driveUrl);
              setUploadProgress('✅ Gambar banner tersimpan di Google Drive!');
              if (result.folderId) {
                localStorage.setItem('sipandu_drive_folder_id', result.folderId);
              }
            } else {
              setUploadProgress('⚠️ Gagal disimpan di Drive: ' + (result.message || 'Cek hak akses'));
            }
          } else {
            setUploadProgress(`⚠️ Server Apps Script mengembalikan HTTP ${res.status}`);
          }
        } catch (err: any) {
          console.error('Error uploading to Drive:', err);
          setUploadProgress('⚠️ Gagal terhubung ke Apps Script (' + (err.message || 'CORS') + ')');
        } finally {
          setIsUploading(false);
        }
      } else {
        setIsUploading(false);
        setUploadProgress('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save
  const handleSubmit = async (publishToCloud: boolean) => {
    if (isUploading) {
      alert('Mohon tunggu hingga proses unggah gambar ke Google Drive selesai!');
      return;
    }
    if (!title.trim()) {
      alert('Mohon masukkan Judul Berita.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCategory = initialData?.category || 'Berita';
      const finalExcerpt = excerpt.trim() || (content.slice(0, 120).replace(/[#*`_]/g, '') + '...');

      const newsItem: NewsAnnouncement = {
        id: initialData?.id || `news-${Date.now()}`,
        title: title.trim(),
        category: finalCategory,
        date: date.trim() || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        excerpt: finalExcerpt,
        content: mode === 'embed' ? (embedCode || content) : content,
        author: initialData?.author || 'Humas Instansi',
        imageUrl: imageUrl.trim() || undefined,
        status: publishToCloud ? 'Published' : 'Draft',
        storageType: publishToCloud ? 'Cloud' : 'Lokal',
        coverType,
        embedCode: mode === 'embed' ? embedCode : undefined,
        isEmbed: mode === 'embed',
        isBookmarked: initialData?.isBookmarked || false
      };

      await onSave(newsItem, publishToCloud);
      onClose();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Gagal menyimpan berita. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 sticky top-0 z-20">
          
          {/* Mode Switcher Pills (Berita vs Embed) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setMode('berita')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                mode === 'berita'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Berita</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('embed')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                mode === 'embed'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 text-slate-500" />
              <span>Embed</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= FORM BODY ================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* JUDUL BERITA */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Judul Berita <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul berita yang jelas dan menarik..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* TANGGAL PUBLIKASI ROW */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Tanggal Publikasi
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="12 September 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ================= COVER IMAGE SELECTOR ================= */}
          <div className="space-y-2">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Cover Image
            </label>

            {/* Sub-tab pills for Cover Image */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
              <button
                type="button"
                onClick={() => setCoverType('drive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'drive'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Drive</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('galeri')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'galeri'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Galeri</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('link')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'link'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link</span>
              </button>
            </div>

            {/* Dropzone / Upload / Link Form */}
            <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-2 border-dashed border-blue-200 dark:border-blue-900/60 rounded-2xl flex flex-col items-center justify-center min-h-[100px] transition text-center relative group">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-600 animate-spin" />
                  <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{uploadProgress}</p>
                </div>
              ) : imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <img
                    src={imageUrl}
                    alt="Preview Cover"
                    className="w-24 h-20 sm:w-32 sm:h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" /> Cover Berhasil Dipasang
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                      {imageUrl.startsWith('data:') ? 'Gambar lokal terunggah' : imageUrl}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer"
                      >
                        Ganti Gambar
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg hover:bg-rose-100 transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ) : coverType === 'link' ? (
                <div className="w-full space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... atau URL gambar langsung"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Tempelkan link gambar eksternal yang dapat diakses publik.</p>
                </div>
              ) : coverType === 'galeri' && galleryPhotos.length > 0 ? (
                <div className="w-full space-y-3 text-left">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih dari Galeri Puskesmas:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                    {galleryPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setImageUrl(photo.url)}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition relative group cursor-pointer"
                      >
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer py-2 w-full"
                >
                  <CloudUpload className="w-7 h-7 text-blue-500 animate-bounce" />
                  <p className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    Pilih Gambar ke Google Drive <span className="font-normal text-slate-500 dark:text-slate-400">atau seret ke sini</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Format: PNG, JPG, JPEG (Maks 5MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* ================= RINGKASAN BERITA ================= */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Ringkasan Berita
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat 1–2 kalimat yang tampil di kartu berita..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* ================= ISI POSTINGAN / EMBED ================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                {mode === 'embed' ? 'Kode Embed HTML' : 'Isi Postingan'}
              </label>

              {/* Sub-tab Editor vs Pratinjau */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('editor')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeSubTab === 'editor'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeSubTab === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau</span>
                </button>
              </div>
            </div>

            {mode === 'embed' ? (
              /* Embed Code Editor */
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder="<iframe src='https://...' width='100%' height='450' frameborder='0'></iframe>"
                  className="w-full font-mono text-xs px-4 py-3 bg-slate-950 text-emerald-400 border border-slate-800 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">Mendukung embed Google Forms, Canva, YouTube, Google Maps, dan Dokumen Drive.</p>
              </div>
            ) : activeSubTab === 'editor' ? (
              /* Rich Post Editor */
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/90 shadow-2xs relative">
                
                {/* TOOLBAR */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-850 flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  
                  {/* Basic Formatting: B, I, U */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => execFormatter('bold')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded font-bold text-xs cursor-pointer"
                      title="Tebal (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormatter('italic')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs cursor-pointer"
                      title="Miring (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormatter('underline')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs cursor-pointer"
                      title="Garis Bawah (Underline)"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Heading / Style dropdown */}
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Mencegah focus hilang agar blok teks tidak hilang
                        setShowFontDropdown(!showFontDropdown);
                        setShowColorPicker(false);
                        setShowHighlightPicker(false);
                        setShowEmojiPicker(false);
                      }}
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <span>T Default</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    
                    {showFontDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 max-h-[300px] overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">Gaya Teks</div>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('formatBlock', '<h1>'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Judul Utama (H1)</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('formatBlock', '<h2>'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Subjudul (H2)</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('formatBlock', '<h3>'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Heading 3 (H3)</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('formatBlock', '<p>'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm font-normal text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Paragraf Normal (P)</button>
                        
                        <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 mt-1">Jenis Font</div>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('fontName', 'Arial'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" style={{ fontFamily: 'Arial, sans-serif' }}>Arial</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('fontName', 'Times New Roman'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" style={{ fontFamily: '"Times New Roman", serif' }}>Times New Roman</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('fontName', 'Courier New'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" style={{ fontFamily: '"Courier New", monospace' }}>Courier New</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('fontName', 'Georgia'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" style={{ fontFamily: 'Georgia, serif' }}>Georgia</button>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormatter('fontName', 'Verdana'); setShowFontDropdown(false); }} className="px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" style={{ fontFamily: 'Verdana, sans-serif' }}>Verdana</button>
                      </div>
                    )}
                  </div>

                  {/* Font Size Selector: A- 14 A+ */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                      className="px-1.5 py-1 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Perkecil Ukuran Teks"
                    >
                      A-
                    </button>
                    <span className="px-2 text-xs font-extrabold text-blue-600 dark:text-blue-400">{fontSize}</span>
                    <button
                      type="button"
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      className="px-1.5 py-1 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Perbesar Ukuran Teks"
                    >
                      A+
                    </button>
                  </div>

                  {/* Text Color Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowHighlightPicker(false);
                      }}
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      title="Warna Teks"
                    >
                      <span>🎨</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColor }} />
                    </button>

                    {showColorPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-lg z-30 grid grid-cols-3 gap-1.5 w-40">
                        {colorOptions.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              setSelectedColor(c.value);
                              execFormatter('foreColor', c.value);
                              setShowColorPicker(false);
                            }}
                            className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px]"
                          >
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                            <span className="truncate">{c.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Highlight Color */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowHighlightPicker(!showHighlightPicker);
                        setShowColorPicker(false);
                      }}
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      title="Stabilo / Highlight"
                    >
                      <span>🖌️</span>
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: highlightColor === 'transparent' ? '#ffffff' : highlightColor }} />
                    </button>

                    {showHighlightPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-lg z-30 space-y-1 w-36">
                        {highlightOptions.map((h) => (
                          <button
                            key={h.value}
                            type="button"
                            onClick={() => {
                              setHighlightColor(h.value);
                              execFormatter('hiliteColor', h.value);
                              setShowHighlightPicker(false);
                            }}
                            className="w-full flex items-center gap-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left text-[11px]"
                          >
                            <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: h.value === 'transparent' ? '#ffffff' : h.value }} />
                            <span>{h.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setTextAlign('left');
                        execFormatter('justifyLeft');
                      }}
                      className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Kiri"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTextAlign('center');
                        execFormatter('justifyCenter');
                      }}
                      className={`p-1.5 rounded ${textAlign === 'center' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Tengah"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTextAlign('right');
                        execFormatter('justifyRight');
                      }}
                      className={`p-1.5 rounded ${textAlign === 'right' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Kanan"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTextAlign('justify');
                        execFormatter('justifyFull');
                      }}
                      className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Kanan Kiri"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Lists & Quote */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => execFormatter('insertUnorderedList')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormatter('insertOrderedList')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => execFormatter('formatBlock', '<blockquote>')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Kutipan (Quote)"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Link, Emoji, Image */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Masukkan URL Tautan:', 'https://');
                        if (url) execFormatter('createLink', url);
                      }}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Sisipkan Tautan (Link)"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                        title="Sisipkan Emoji"
                      >
                        <Smile className="w-3.5 h-3.5" />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-lg z-30 grid grid-cols-6 gap-1 w-48">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                execFormatter('insertHTML', emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-base p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const imgUrl = prompt('Masukkan URL Gambar:', 'https://');
                        if (imgUrl) execFormatter('insertImage', imgUrl);
                      }}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Sisipkan Gambar Inline"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* RICH TEXT EDITOR (contentEditable) */}
                <div className="relative bg-transparent min-h-[250px] max-h-[400px] overflow-y-auto">
                  <div
                    ref={editorRef}
                    contentEditable
                    onClick={() => {
                      setShowFontDropdown(false);
                      setShowColorPicker(false);
                      setShowHighlightPicker(false);
                      setShowEmojiPicker(false);
                    }}
                    onInput={handleEditorInput}
                    style={{
                      fontSize: `${fontSize}px`,
                      color: selectedColor
                    }}
                    className="w-full p-4 bg-transparent border-0 focus:outline-hidden focus:ring-0 leading-relaxed font-sans min-h-[250px] outline-hidden prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
                  />
                  {(!content || content === '<br>' || content === '') && (
                    <div className="absolute top-4 left-4 text-slate-400 pointer-events-none select-none text-xs sm:text-sm">
                      Tuliskan isi berita lengkap di sini... Anda dapat menggunakan toolbar di atas untuk format teks langsung (WYSIWYG).
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* LIVE PREVIEW MODE */
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-850 space-y-4 max-h-[400px] overflow-y-auto">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full max-h-64 object-cover rounded-xl shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">📅 {date}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {title || 'Judul Berita'}
                  </h2>
                  {excerpt && (
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-3">
                      {excerpt}
                    </p>
                  )}
                </div>
                <div 
                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-700 rich-text-content"
                  dangerouslySetInnerHTML={{ __html: content || 'Belum ada konten berita.' }}
                />
              </div>
            )}
          </div>

        </div>

        {/* ================= MODAL FOOTER ACTIONS ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 z-20">
          
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mode: <strong>{mode === 'berita' ? 'Posting Berita Reguler' : 'Embed Media / Iframe'}</strong></span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>{isUploading ? 'Menunggu Unggah...' : 'Simpan Draf (Lokal)'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isUploading ? 'Mengunggah...' : isSubmitting ? 'Memproses...' : 'Publikasikan Berita'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
