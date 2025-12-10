'use client';

import { useState, useRef } from 'react';
import { Media } from '@/redux/types/media/media.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Upload, Search, Trash2, Download, Eye, FileText, Film, Music, X, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface MediaPageComponentProps {
  media: Media[];
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function MediaPageComponent({
  media,
  isLoading,
  onUpload,
  onDelete,
}: MediaPageComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<Media | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await onUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onUpload(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-purple-500" />;
      case 'video': return <Film className="w-8 h-8 text-pink-500" />;
      case 'document': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'audio': return <Music className="w-8 h-8 text-yellow-500" />;
      default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-primary-600" />
              Media Library
            </h1>
            <p className="text-slate-500">
              Manage and organize your digital assets.
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${isDragging
            ? 'border-primary-500 bg-primary-50 scale-[1.01]'
            : 'border-slate-200 bg-white/50 hover:border-primary-300 hover:bg-slate-50'
            }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-primary-100' : 'bg-slate-100'}`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {isDragging ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-slate-500 mt-1">or click "Upload Files" to browse</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Files', value: media.length, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Images', value: media.filter(m => m.type === 'image').length, icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Videos', value: media.filter(m => m.type === 'video').length, icon: Film, color: 'text-pink-600', bg: 'bg-pink-50' },
            { label: 'Documents', value: media.filter(m => m.type === 'document').length, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '-' : stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm sticky top-4 z-40 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 font-medium cursor-pointer"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse">
                <div className="h-48 bg-slate-100 rounded-t-xl"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-slate-100 rounded mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredMedia.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-1">No files found</h3>
              <p className="text-slate-500">Upload files to get started</p>
            </div>
          ) : (
            filteredMedia.map((file) => (
              <Card key={file.id} className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="h-48 bg-slate-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt={file.filename}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      {getTypeIcon(file.type)}
                    </div>
                  )}
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      onClick={() => setPreviewItem(file)}
                      variant="secondary"
                      size="sm"
                      className="rounded-full bg-white/90 hover:bg-white text-slate-900 w-10 h-10 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full bg-white/90 hover:bg-white text-slate-900 w-10 h-10 p-0"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(file.id)}
                      variant="destructive"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-slate-900 truncate flex-1" title={file.filename}>
                      {file.filename}
                    </h3>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {file.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <Button
                onClick={() => setPreviewItem(null)}
                variant="secondary"
                size="sm"
                className="rounded-full bg-white/50 hover:bg-white backdrop-blur-md w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-1 bg-slate-900 flex items-center justify-center min-h-[400px] max-h-[80vh]">
              {previewItem.type === 'image' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.filename}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : previewItem.type === 'video' ? (
                <video
                  src={previewItem.url}
                  controls
                  className="max-w-full max-h-[70vh]"
                />
              ) : (
                <div className="text-center text-white p-12">
                  {getTypeIcon(previewItem.type)}
                  <p className="mt-4 text-lg font-medium">{previewItem.filename}</p>
                  <Button
                    className="mt-6"
                    onClick={() => window.open(previewItem.url, '_blank')}
                  >
                    Download to View
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6 bg-white border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{previewItem.filename}</h3>
              <div className="flex gap-6 text-sm text-slate-500">
                <div>
                  <span className="font-medium text-slate-900">Type:</span> {previewItem.type}
                </div>
                <div>
                  <span className="font-medium text-slate-900">Size:</span> {formatFileSize(previewItem.size)}
                </div>
                <div>
                  <span className="font-medium text-slate-900">Uploaded:</span> {previewItem.createdAt ? new Date(previewItem.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}