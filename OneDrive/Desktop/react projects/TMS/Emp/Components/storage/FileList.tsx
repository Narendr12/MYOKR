import React from 'react';
import { FileItem } from './types';
import { 
  FileText, Image, Music, Video, Code, 
  Star, File, UserCircle
} from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  onSelect: (file: FileItem) => void;
  onToggleStar: (e: React.MouseEvent, id: string) => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="text-red-500" size={20} />;
    case 'png': 
    case 'jpg': return <Image className="text-purple-500" size={20} />;
    case 'mp4': return <Video className="text-pink-500" size={20} />;
    case 'mp3': return <Music className="text-blue-500" size={20} />;
    case 'json': 
    case 'xml': return <Code className="text-slate-600" size={20} />;
    default: return <File className="text-gray-400" size={20} />;
  }
};

const FileList: React.FC<FileListProps> = ({ files, onSelect, onToggleStar }) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <File className="text-gray-300" size={32} />
        </div>
        <p className="text-gray-400 font-bold">No files found in this view.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="px-6 py-4 w-10 text-center">
              <Star size={14} className="mx-auto" />
            </th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Context</th>
            <th className="px-6 py-4">Size</th>
            <th className="px-6 py-4">Uploaded By</th>
            <th className="px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {files.map((file) => (
            <tr 
              key={file.id} 
              onClick={() => onSelect(file)}
              className="hover:bg-blue-50/30 group cursor-pointer transition-colors duration-150"
            >
              {/* Star Column */}
              <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={(e) => onToggleStar(e, file.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Star 
                    size={16} 
                    className={`${file.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} 
                  />
                </button>
              </td>

              {/* Name Column */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded uppercase tracking-wide
                          ${file.visibility === 'Private' ? 'bg-red-50 text-red-600' : 
                            file.visibility === 'Team' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {file.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Context Column */}
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-slate-600 bg-gray-100 px-2 py-1 rounded-md">
                  {file.contextName}
                </span>
              </td>

              {/* Size Column */}
              <td className="px-6 py-4 text-sm font-medium text-slate-500">
                {file.size}
              </td>

              {/* Uploaded By Column */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {file.userAvatar ? (
                    <img src={file.userAvatar} alt="User" className="w-6 h-6 rounded-full object-cover shadow-sm" />
                  ) : (
                    <UserCircle size={24} className="text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                    {file.uploadedBy}
                  </span>
                </div>
              </td>

              {/* Date Column */}
              <td className="px-6 py-4 text-sm font-medium text-slate-500 font-mono">
                {file.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;