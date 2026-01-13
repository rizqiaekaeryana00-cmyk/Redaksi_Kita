import React, { useState } from 'react';
import { User } from '../types';
import { AudioService } from '../services/audioService';

type WritingStep = 'topic' | 'facts' | 'lead' | 'body' | 'headline' | 'preview' | 'publish';

export const WritingView: React.FC<{ user: User | null, onExit: () => void }> = ({ user, onExit }) => {
  const [step, setStep] = useState<WritingStep>('topic');
  const [topic, setTopic] = useState('');
  
  // Structured Data State
  const [facts, setFacts] = useState({
    who: '',
    what: '',
    where: '',
    when: '',
    why: '',
    how: ''
  });
  
  const [draft, setDraft] = useState({
    lead: '',
    body: '',
    headline: ''
  });

  // Helper untuk pindah step
  const nextStep = (next: WritingStep) => {
    AudioService.playClick();
    setStep(next);
  };

  const handleTopicSelect = (t: string) => {
    setTopic(t);
    // Reset form
    setFacts({ who: '', what: '', where: '', when: '', why: '', how: '' });
    nextStep('facts');
  };

  const handleFactChange = (field: keyof typeof facts, value: string) => {
    setFacts(prev => ({ ...prev, [field]: value }));
  };

  const generateAutoLead = () => {
    // Basic template logic to help students start
    const autoLead = `Pada ${facts.when || '...'}, ${facts.who || '...'} melakukan kegiatan ${facts.what || '...'} di ${facts.where || '...'}.`;
    setDraft(prev => ({ ...prev, lead: autoLead }));
    nextStep('lead');
  };

  const handlePublish = () => {
    AudioService.playWin();
    nextStep('publish');
  };

  // --- RENDER COMPONENTS PER STEP ---

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div className="bg-news-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
    </div>
  );

  const renderEditorMessage = (msg: string, icon: string = "user-tie") => (
    <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-pop-in">
        <div className="w-12 h-12 bg-news-blue rounded-full flex items-center justify-center text-white shrink-0">
            <i className={`fas fa-${icon} text-xl`}></i>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl rounded-tl-none text-gray-700 text-sm md:text-base flex-1">
            <span className="font-bold block text-news-blue mb-1">Pemimpin Redaksi</span>
            {msg}
        </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 overflow-y-auto pb-20 font-sans">
        {/* Header Navigation */}
         <div className="p-4 bg-white/90 backdrop-blur sticky top-0 z-30 shadow-sm flex justify-between items-center">
            <button onClick={onExit} className="text-gray-500 font-bold hover:text-red-500 transition"><i className="fas fa-times mr-2"></i> Keluar</button>
            <h2 className="font-display text-xl font-bold text-news-green"><i className="fas fa-pen-nib mr-2"></i>Meja Tulis Interaktif</h2>
            <div className="w-20 text-right text-xs font-bold text-gray-400">
                {step === 'topic' ? 'Mulai' : step === 'publish' ? 'Selesai' : 'Menulis...'}
            </div>
        </div>

        <div className="container mx-auto p-4 md:p-8 max-w-3xl">
            
            {/* STEP 1: TOPIC SELECTION */}
            {step === 'topic' && (
                <div className="animate-pop-in text-center mt-8">
                    <h3 className="text-3xl font-display font-black mb-2 text-news-dark">Apa Beritamu Hari Ini?</h3>
                    <p className="text-gray-500 mb-8">Pilih topik untuk mulai latihan menulis.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => handleTopicSelect('Kegiatan Sekolah')} className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition border-b-4 border-news-green">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                                <span className="text-4xl">🏫</span>
                            </div>
                            <h4 className="font-bold text-xl text-gray-800">Kegiatan Sekolah</h4>
                            <p className="text-sm text-gray-400 mt-2">Upacara, Lomba, atau Ekskul.</p>
                        </button>
                        <button onClick={() => handleTopicSelect('Kejadian Sekitar')} className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition border-b-4 border-news-purple">
                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                                <span className="text-4xl">🏘️</span>
                            </div>
                            <h4 className="font-bold text-xl text-gray-800">Lingkungan Sekitar</h4>
                            <p className="text-sm text-gray-400 mt-2">Kerja bakti, Hobi, atau Peristiwa unik.</p>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: GATHERING FACTS (5W+1H) */}
            {step === 'facts' && (
                <div className="max-w-xl mx-auto">
                    {renderProgressBar(20)}
                    {renderEditorMessage("Halo! Sebelum menulis paragraf panjang, ayo kumpulkan dulu fakta-fakta kuncinya. Jawab pertanyaan di bawah ini dengan singkat dan jelas ya!")}
                    
                    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 animate-pop-in">
                        <div>
                            <label className="block text-xs font-black text-news-blue uppercase mb-1">WHO (Siapa)</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Tim Basket SMP 1"
                                value={facts.who} 
                                onChange={e => handleFactChange('who', e.target.value)}
                                className="w-full p-3 bg-blue-50 rounded-xl border-none focus:ring-2 focus:ring-news-blue font-bold text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-news-green uppercase mb-1">WHAT (Apa)</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Memenangkan Juara 1"
                                value={facts.what} 
                                onChange={e => handleFactChange('what', e.target.value)}
                                className="w-full p-3 bg-green-50 rounded-xl border-none focus:ring-2 focus:ring-news-green font-bold text-gray-700"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-news-red uppercase mb-1">WHEN (Kapan)</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: Sabtu Kemarin"
                                    value={facts.when} 
                                    onChange={e => handleFactChange('when', e.target.value)}
                                    className="w-full p-3 bg-red-50 rounded-xl border-none focus:ring-2 focus:ring-news-red font-bold text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-news-yellow uppercase mb-1">WHERE (Di mana)</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: GOR Kota"
                                    value={facts.where} 
                                    onChange={e => handleFactChange('where', e.target.value)}
                                    className="w-full p-3 bg-yellow-50 rounded-xl border-none focus:ring-2 focus:ring-news-yellow font-bold text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button 
                            disabled={!facts.who || !facts.what}
                            onClick={generateAutoLead} 
                            className="bg-news-dark text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:scale-100"
                        >
                            Lanjut: Susun Paragraf <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: DRAFTING LEAD */}
            {step === 'lead' && (
                <div className="max-w-2xl mx-auto">
                    {renderProgressBar(40)}
                    {renderEditorMessage("Bagus! Saya sudah menyusun draf kasar dari faktamu. Sekarang, ubah kalimat ini agar terdengar lebih enak dibaca sebagai paragraf pembuka (Teras Berita).", "pen-fancy")}

                    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-news-green animate-pop-in">
                        <label className="block text-sm font-bold text-gray-400 mb-2">Editor's Draft (Bisa diedit):</label>
                        <textarea 
                            value={draft.lead}
                            onChange={(e) => setDraft({...draft, lead: e.target.value})}
                            className="w-full h-32 text-xl font-serif text-gray-800 p-4 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-news-green transition leading-relaxed resize-none"
                        ></textarea>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                         <button onClick={() => setStep('facts')} className="text-gray-400 font-bold hover:text-gray-600">Kembali</button>
                         <button onClick={() => nextStep('body')} className="bg-news-green text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">
                            Lanjut: Isi Berita <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: BODY & DETAILS */}
            {step === 'body' && (
                <div className="max-w-2xl mx-auto">
                     {renderProgressBar(60)}
                     {renderEditorMessage("Sekarang kita masuk ke Tubuh Berita. Ceritakan detailnya! Jelaskan MENGAPA (Why) itu terjadi dan BAGAIMANA (How) prosesnya.", "align-left")}
                     
                     <div className="space-y-4 animate-pop-in">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                             <h4 className="font-bold text-gray-700 mb-2"><i className="fas fa-question-circle text-purple-400 mr-2"></i>Detail Tambahan</h4>
                             <textarea 
                                placeholder="Ceritakan kronologinya, suasananya, atau kutipan wawancara..."
                                value={draft.body}
                                onChange={(e) => setDraft({...draft, body: e.target.value})}
                                className="w-full h-48 p-4 bg-gray-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-news-purple transition font-serif text-lg leading-relaxed resize-none"
                             ></textarea>
                        </div>
                     </div>

                     <div className="mt-6 flex justify-between items-center">
                         <button onClick={() => setStep('lead')} className="text-gray-400 font-bold hover:text-gray-600">Kembali</button>
                         <button onClick={() => nextStep('headline')} className="bg-news-purple text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">
                            Lanjut: Buat Judul <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 5: HEADLINE */}
            {step === 'headline' && (
                <div className="max-w-xl mx-auto text-center">
                    {renderProgressBar(80)}
                    {renderEditorMessage("Terakhir dan terpenting! Buatlah JUDUL yang menarik, singkat, dan padat. Judul harus membuat orang ingin membaca tulisanmu.", "newspaper")}

                    <div className="bg-white p-8 rounded-3xl shadow-xl mt-6 animate-pop-in">
                        <input 
                            type="text" 
                            placeholder="KETIK JUDUL DI SINI..."
                            value={draft.headline}
                            onChange={(e) => setDraft({...draft, headline: e.target.value})}
                            className="w-full text-center text-2xl md:text-3xl font-black text-gray-800 border-b-4 border-gray-200 focus:border-news-blue outline-none py-4 uppercase placeholder-gray-300"
                        />
                         <p className="text-gray-400 text-sm mt-4 font-bold">Tips: Gunakan kata kerja aktif (Contoh: "Siswa SMP 1 Raih Emas", bukan "Emas Diraih Siswa")</p>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                         <button onClick={() => setStep('body')} className="text-gray-400 font-bold hover:text-gray-600">Kembali</button>
                         <button 
                            disabled={!draft.headline}
                            onClick={handlePublish} 
                            className="bg-news-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50"
                        >
                            Terbitkan Berita <i className="fas fa-check-circle ml-2"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 6: PUBLISH & CERTIFICATE */}
            {step === 'publish' && (
                <div className="animate-pop-in flex flex-col items-center">
                     <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-8 border-news-yellow relative overflow-hidden max-w-2xl w-full text-center">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><i className="fas fa-certificate text-9xl text-news-yellow"></i></div>
                        
                        <div className="inline-block bg-news-yellow text-news-dark px-4 py-1 rounded-full font-bold text-xs mb-4 uppercase tracking-widest">Sertifikat Jurnalis Muda</div>
                        
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-news-dark mb-1">PRESS RELEASE</h2>
                        <div className="w-full h-1 bg-gray-200 my-4"></div>
                        
                        <div className="text-left mb-6">
                            <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 uppercase">{draft.headline}</h1>
                            <div className="text-sm text-gray-500 font-bold mb-4 flex justify-between">
                                <span>Oleh: {user?.name} ({user?.school})</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="font-serif text-gray-800 space-y-4 text-justify leading-relaxed">
                                <p><span className="font-bold">{facts.where}</span> - {draft.lead}</p>
                                <p>{draft.body}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                             <p className="text-gray-400 italic text-sm">Berita ini telah lulus verifikasi meja redaksi.</p>
                             <div className="mt-4 flex justify-center gap-4">
                                <button onClick={onExit} className="bg-news-dark text-white px-8 py-3 rounded-full font-bold shadow hover:bg-black transition">
                                    Simpan & Kembali
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};