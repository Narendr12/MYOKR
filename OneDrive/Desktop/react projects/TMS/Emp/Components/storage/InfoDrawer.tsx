'use client';

import React, { useState } from 'react';
import { 
  X, Download, Share2, HardDrive, Clock, FileText, 
  RotateCcw, Shield, CheckCircle2, Tag, LogOut, AlertTriangle
} from 'lucide-react';
import { FileItem } from './types';

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
}

// Helper to get Priority Label with Icon
const getPriorityLabel = (priority?: string) => {
  switch (priority) {
    case 'Very High': return '🔺 Very High';
    case 'High': return '🔸 High';
    case 'Medium': return '⚪ Medium';
    case 'Low': return '🔹 Low';
    default: return '⚪ Medium';
  }
};

export default function InfoDrawer({ isOpen, onClose, file }: InfoDrawerProps) {
  const [tab, setTab] = useState('Details');
  
  if (!isOpen || !file) return null;

  const isAdmin = true;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 font-sans">
        
        {/* Header */}
        <div className="p-6 pb-2 border-b border-gray-100">
           <div className="flex justify-between items-start mb-4">
             <div className="flex gap-3">
                <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                   <h2 className="font-bold text-xl text-slate-900 leading-tight line-clamp-2">{file.name}</h2>
                   <p className="text-sm font-medium text-slate-500 mt-1">
                     Current Version: <span className="font-mono text-slate-700">{file.versions.length > 0 ? file.versions[0].version : 'v1.0'}</span>
                   </p>
                </div>
             </div>
             <button onClick={onClose} className="text-gray-400 hover:text-slate-800 p-1 rounded-full hover:bg-gray-100">
               <X size={24} />
             </button>
           </div>

           {/* Tabs */}
           <div className="flex gap-6 mt-4">
            {['Details', 'Activity', 'Versions'].map(t => (
              <button 
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
           
           {/* --- DETAILS TAB --- */}
           {tab === 'Details' && (
             <div className="space-y-6">
               {/* Preview */}
               <div className="aspect-video bg-white rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm">
                  {file.previewUrl ? (
                    <img src={file.previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FileText size={40} />
                      <span className="text-sm font-bold">No Preview Available</span>
                    </div>
                  )}
               </div>

               {/* Metadata Card */}
               <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-5">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-gray-100 pb-2">
                    <HardDrive size={18} className="text-blue-600"/> File Metadata
                  </h3>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">Uploaded By</span>
                        <span className="text-base font-bold text-slate-900">{file.uploadedBy}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">Upload Date</span>
                        <span className="text-base font-bold text-slate-900">{file.date}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">File Size</span>
                        <span className="text-base font-bold text-slate-900">{file.size}</span>
                     </div>
                     
                     {/* PRIORITY SECTION */}
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">Priority</span>
                        <span className="text-sm font-bold text-slate-800 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                          {getPriorityLabel(file.priority)}
                        </span>
                     </div>

                     <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-500 mt-1">Context Path</span>
                        <div className="text-right">
                          <span className="block text-base font-bold text-slate-900">{file.contextName}</span>
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">{file.contextType}</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500">Visibility</span>
                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-md text-green-700 border border-green-200">
                          <Shield size={12} />
                          <span className="text-xs font-extrabold uppercase">{file.visibility}</span>
                        </div>
                     </div>
                  </div>

                  {/* Tags Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                       <Tag size={16} className="text-gray-400"/>
                       <span className="text-sm font-bold text-slate-500">Associated Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {file.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
             </div>
           )}

           {/* --- ACTIVITY TAB --- */}
           {tab === 'Activity' && (
             <div className="space-y-4">
                {file.activity.map((log, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                     <div className="mt-0.5 text-gray-400 bg-gray-50 p-1.5 rounded-full"><Clock size={16} /></div>
                     <div className="text-sm text-slate-800 leading-snug">
                        <span className="font-mono text-xs text-blue-600 font-bold">[{log.timestamp}]</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span>
                          <span className="font-semibold">{log.action}</span> by <span className="font-bold text-slate-900">{log.user}</span>
                        </span>
                     </div>
                  </div>
                ))}
                
                {file.activity.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-4 font-bold">No activity recorded.</p>
                )}
             </div>
           )}

           {/* --- VERSIONS TAB --- */}
           {tab === 'Versions' && (
             <div className="space-y-4">
                {file.versions.map((ver, i) => {
                  const isActive = i === 0;
                  const nameParts = file.name.split('.');
                  const ext = nameParts.pop();
                  const baseName = nameParts.join('.');
                  const displayVersion = isActive ? file.name : `${baseName}_${ver.version}.${ext}`;

                  return (
                    <div key={i} className={`flex flex-col p-4 rounded-xl border transition-all ${isActive ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-50' : 'bg-slate-50 border-gray-200 opacity-80'}`}>
                       
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col">
                             <span className="text-base font-bold text-slate-900">{displayVersion}</span>
                             <span className="text-xs font-bold text-gray-500 mt-0.5 font-mono">{ver.version}</span>
                          </div>
                          {isActive ? (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                              <CheckCircle2 size={12} /> Active
                            </span>
                          ) : (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-bold border border-gray-300">
                              Archived
                            </span>
                          )}
                       </div>

                       {ver.note && (
                         <div className="mb-3 text-sm font-medium text-slate-600 italic border-l-4 border-blue-300 pl-3 bg-blue-50/50 py-2 rounded-r">
                            "{ver.note}"
                         </div>
                       )}

                       <div className="flex justify-between items-center mt-1 border-t border-gray-100 pt-2">
                          <span className="text-xs font-bold text-gray-400">By {ver.uploadedBy} on {ver.date}</span>
                          
                          {!isActive && isAdmin && (
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 rounded transition-colors shadow-sm">
                              <RotateCcw size={12} /> Revert
                            </button>
                          )}
                       </div>
                    </div>
                  );
                })}
             </div>
           )}

        </div>

        {/* Footer with Close Button */}
        <div className="p-5 border-t border-gray-200 bg-white flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
           >
              <LogOut size={16} /> Close
           </button>
           <button className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-gray-50 flex items-center justify-center gap-2">
              <Share2 size={16} /> Share
           </button>
           <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
              <Download size={16} /> Download
           </button>
        </div>

      </div>
    </div>
  );
}