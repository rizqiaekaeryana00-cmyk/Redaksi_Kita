import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { VideoContent } from '../types';

export const NewsRoomView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'materi'>('video');
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null);

  useEffect(() => {
    DataService.getVideos().then(setVideos);
  }, []);

  // Filter video berdasarkan tab
  const filteredList = videos.filter(v => activeTab === 'video' ? v.category === 'contoh' : v.category === 'materi');

  // Auto-select video pertama saat tab berubah atau data dimuat
  useEffect(() => {
    if (filteredList.length > 0) {
        // Cek jika video yang sedang diputar ada di list yang baru
        const isCurrentInList = currentVideo && filteredList.find(v => v.id === currentVideo.id);
        
        if (!currentVideo || !isCurrentInList) {
            setCurrentVideo(filteredList[0]);
        }
    } else {
        setCurrentVideo(null);
    }
  }, [activeTab, videos]);

  // Helper untuk membersihkan Youtube ID
  const getEmbedUrl = (rawId: string) => {
    let videoId = rawId;
    // Regex untuk menangkap ID dari berbagai format URL Youtube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = rawId.match(regExp);
    if (match && match[2].length === 11) {
        videoId = match[2];
    }
    
    // PERBAIKAN ERROR 153:
    // 1. Menghapus parameter 'origin' yang sering menyebabkan konflik di localhost/dev environment
    // 2. Menambahkan 'playsinline=1' untuk kompatibilitas mobile
    // 3. Menambahkan 'iv_load_policy=3' untuk menyembunyikan anotasi
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`;
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-screen overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 bg-white border-b shadow-sm z-30 flex justify-between items-center shrink-0">
            <button onClick={onExit} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 text-sm">
                <i className="fas fa-arrow-left"></i> Kembali
            </button>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('video')} 
                    className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'video' ? 'bg-white text-news-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <i className="fas fa-tv mr-2"></i>Contoh Berita
                </button>
                <button 
                    onClick={() => setActiveTab('materi')} 
                    className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'materi' ? 'bg-white text-news-purple shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <i className="fas fa-book mr-2"></i>Materi Jurnalistik
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* LEFT: Main Player Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-white">
                {currentVideo ? (
                    <div className="animate-pop-in">
                        {/* Video Player */}
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 relative group bg-gray-900">
                            <iframe 
                                className="w-full h-full rounded-2xl" 
                                src={getEmbedUrl(currentVideo.youtubeId)}
                                title={currentVideo.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Video Info */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-2">{currentVideo.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-bold border-b pb-4">
                                <span className={`uppercase px-2 py-1 rounded ${currentVideo.category === 'materi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {currentVideo.category}
                                </span>
                                <span><i className="fas fa-play-circle mr-1"></i> Sedang Diputar</span>
                            </div>
                            <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                                <i className="fas fa-info-circle mr-2"></i>
                                Jika video tidak dapat diputar (Error 150/153), kemungkinan pemilik video menonaktifkan fitur "Embed". Silakan pilih video lain yang diizinkan untuk disematkan.
                            </div>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                Simak video ini dengan baik untuk memahami materi jurnalistik atau melihat contoh penyampaian berita yang benar.
                            </p>
                        </div>

                        {/* Special Section: Materi Info Cards (Only visible in Materi tab) */}
                        {activeTab === 'materi' && (
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                <h3 className="font-display text-xl font-bold text-news-purple mb-4"><i className="fas fa-lightbulb mr-2"></i>Catatan Pintar: 5W+1H</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <InfoCard color="blue" title="WHAT" desc="Apa peristiwanya?" />
                                    <InfoCard color="green" title="WHO" desc="Siapa terlibat?" />
                                    <InfoCard color="red" title="WHEN" desc="Kapan terjadi?" />
                                    <InfoCard color="yellow" title="WHERE" desc="Di mana lokasinya?" />
                                    <InfoCard color="purple" title="WHY" desc="Mengapa terjadi?" />
                                    <InfoCard color="orange" title="HOW" desc="Bagaimana prosesnya?" />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <i className="fas fa-film text-6xl mb-4"></i>
                        <p className="font-bold">Pilih video dari daftar putar</p>
                    </div>
                )}
            </div>

            {/* RIGHT: Playlist Sidebar */}
            <div className="w-full lg:w-96 bg-gray-50 border-l border-gray-200 flex flex-col h-full shrink-0">
                <div className="p-4 bg-gray-100 border-b font-bold text-gray-700 flex justify-between items-center">
                    <span><i className="fas fa-list-ul mr-2"></i>Daftar Putar</span>
                    <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">{filteredList.length} Video</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredList.map((video, idx) => (
                        <button 
                            key={video.id} 
                            onClick={() => setCurrentVideo(video)}
                            className={`w-full text-left p-3 rounded-xl flex gap-3 transition group
                                ${currentVideo?.id === video.id 
                                    ? 'bg-white shadow-md ring-2 ring-news-blue scale-[1.02]' 
                                    : 'hover:bg-white hover:shadow-sm'
                                }`}
                        >
                            {/* Thumbnail */}
                            <div className="relative w-32 h-20 bg-black rounded-lg overflow-hidden shrink-0">
                                <img 
                                    src={`https://img.youtube.com/vi/${getEmbedUrl(video.youtubeId).split('/embed/')[1].split('?')[0]}/mqdefault.jpg`} 
                                    alt="thumb" 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                                    onError={(e) => {
                                        // Fallback thumbnail jika ID rumit
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x80/000000/FFFFFF?text=Video';
                                    }}
                                />
                                {currentVideo?.id === video.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <i className="fas fa-play text-white animate-pulse"></i>
                                    </div>
                                )}
                            </div>
                            
                            {/* Meta */}
                            <div className="flex flex-col justify-center">
                                <h4 className={`font-bold text-sm line-clamp-2 leading-tight ${currentVideo?.id === video.id ? 'text-news-blue' : 'text-gray-700'}`}>
                                    {video.title}
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Video #{idx + 1}</span>
                            </div>
                        </button>
                    ))}

                    {filteredList.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            Tidak ada video di kategori ini.
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};

const InfoCard = ({color, title, desc}: {color:string, title:string, desc:string}) => (
    <div className={`bg-white p-2 px-3 rounded-lg border-l-4 border-${color}-400 shadow-sm`}>
        <b className={`text-${color}-600 text-sm block`}>{title}</b>
        <span className="text-xs text-gray-500 font-medium leading-none">{desc}</span>
    </div>
);