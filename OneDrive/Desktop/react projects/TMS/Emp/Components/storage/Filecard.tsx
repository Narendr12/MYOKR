'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileItem } from './types';
import { 
  Star, MoreVertical, FileText, FileImage, FileCode, Film, Archive, Layers, 
  Share2, Download, Trash2
} from 'lucide-react';

const getFileIcon = (type: string) => {
  if (['png', 'jpg', 'jpeg', 'gif'].includes(type)) return <FileImage className="text-purple-400" size={22} />;
  if (['json', 'js', 'tsx', 'html'].includes(type)) return <FileCode className="text-blue-400" size={22} />;
  if (['mp4', 'mov'].includes(type)) return <Film className="text-pink-600" size={22} />;
  if (['zip', 'rar'].includes(type)) return <Archive className="text-yellow-600" size={22} />;
  return <FileText className="text-slate-500" size={22} />;
};

const getTagStyle = (tag: string) => {
  if (tag === 'Enhancement') return 'bg-purple-100 text-purple-900 border-purple-300';
  if (tag === 'Configuration') return 'bg-gray-100 text-gray-900 border-gray-300';
  if (tag.includes('Major') || tag === 'High') return 'bg-blue-100 text-blue-900 border-blue-300';
  if (tag.includes('Issue') || tag === 'Bug Fix') return 'bg-red-100 text-red-900 border-red-300';
  return 'bg-gray-100 text-slate-800 border-gray-200';
};
interface FileCardProps {
  file: FileItem;
  onClick: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

export default function FileCard({ file, onClick, onToggleStar }: FileCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!file) return null;
  const currentVersion = file.versions?.length ? file.versions[0].version : 'v1.0';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    alert(`${action}: ${file.name}`);
    setIsMenuOpen(false);
  };

  return (
    <div 
      onClick={onClick}
      style={{ width: '316px', height: '290px', borderBottom: '3.5px solid rgb(39 75 135)' }}
      className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1  transition-all duration-300 cursor-pointer flex flex-col relative shrink-0"
    >
      {/* 1. Preview Area */}
      <div className="relative h-[115px] bg-gray-100 border-b-2 border-gray-100 overflow-hidden shrink-0">
        {file.previewUrl ? (
          <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
             {getFileIcon(file.type)}
          </div>
        )}
        
        <div className="absolute inset-0 bg-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Actions */}
        <div className="absolute top-2 right-2 flex gap-1 z-20">
           <button 
             onClick={(e) => { e.stopPropagation(); onToggleStar(e); }}
             className={`p-1.5 rounded-full backdrop-blur-sm transition-transform hover:scale-110 ${file.isStarred ? 'bg-yellow-400 text-white shadow-md' : 'bg-black/20 text-white hover:bg-black/40'}`}
           >
             <Star size={14} className={file.isStarred ? 'fill-current' : ''} />
           </button>
           
           <div className="relative" ref={menuRef}>
             <button 
               onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
               className="p-1.5 rounded-full text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-transform hover:scale-110"
             >
               <MoreVertical size={14} />
             </button>

             {isMenuOpen && (
               <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border-2 border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95">
                 <button onClick={(e) => handleAction(e, 'Share')} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Share2 size={12}/> Share</button>
                 <button onClick={(e) => handleAction(e, 'Download')} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Download size={12}/> Download</button>
                 <div className="border-t border-gray-100 my-1"></div>
                 <button onClick={(e) => handleAction(e, 'Delete')} className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12}/> Delete</button>
               </div>
             )}
           </div>
        </div>

        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[10px] text-white font-extrabold flex items-center gap-1 shadow-sm">
          <Layers size={10} /> {currentVersion}
        </div>
      </div>

      {/* 2. Content Details - Fitting Inside Tile */}
      <div className="p-3 flex-1 flex flex-col justify-between h-full min-h-0">
        
        {/* Header */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="shrink-0">{getFileIcon(file.type)}</div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight truncate w-full" title={file.name}>
              {file.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 pl-7 truncate">
            {file.size} • <span className="text-slate-700 font-medium">{file.contextName}</span>
          </p>
        </div>

        {/* Tags (Limited to fit) */}
          <div className="flex flex-wrap gap-1 mb-2 pl-7">
          {file.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded border font-semibold uppercase tracking-wide truncate ${getTagStyle(tag)}`}>{tag}</span>
          ))}
          {file.tags.length > 2 && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold border border-gray-300">+{file.tags.length - 2}</span>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
           
           <div className="flex items-center gap-2 min-w-0">
             <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-gray-100 shadow-sm shrink-0">
               {file.userAvatar ? (
                 <img src={file.userAvatar} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[9px] font-black text-white">
                   {file.uploadedBy.charAt(0)}
                 </div>
               )}
             </div>
             <span className="text-sm font-medium text-slate-700 truncate max-w-[80px]" title={file.uploadedBy}>
               {file.uploadedBy.split(' ')[0]}
             </span>
           </div>

           <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded shrink-0">
             {file.date}
           </span>
           
        </div>

      </div>
    </div>
  );
}