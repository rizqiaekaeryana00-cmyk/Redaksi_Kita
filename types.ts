export interface User {
  id: string;
  name: string;
  school: string;
  role: 'admin' | 'user';
  totalScore: number;
}

export interface NewsItem {
  id: string;
  text: string;
  type: 'hoax' | 'real';
}

export interface VideoContent {
  id: string;
  title: string;
  youtubeId: string;
  category: 'materi' | 'contoh';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

// Baru: Definisi untuk Puzzle Level
export interface PuzzleLevel {
  id: string;
  difficulty: 'mudah' | 'sulit';
  headline: string; // Judul (Kapital, singkat)
  lead: string;     // Teras (5W+1H ringkas, paragraf pertama)
  body: string;     // Tubuh (Penjelasan detail)
}

// Initial Data for the App (Mock Data fallback)
export const INITIAL_NEWS: NewsItem[] = [
  { id: '1', text: 'Bumi Itu Datar!', type: 'hoax' },
  { id: '2', text: 'Minum Air Garam Obat Covid', type: 'hoax' },
  { id: '3', text: 'Siswa SMP 3 Juara Lomba Robotik', type: 'real' },
  { id: '4', text: 'Alien Mendarat di Monas', type: 'hoax' },
  { id: '5', text: 'Harga Kuota Internet Pelajar Turun', type: 'real' },
  { id: '6', text: 'Vaksin Mengandung Microchip', type: 'hoax' },
  { id: '7', text: 'Presiden Resmikan Tol Baru', type: 'real' },
];

export const INITIAL_VIDEOS: VideoContent[] = [
  { id: '1', title: 'Berita TV Anak', youtubeId: '5F6vQp1lBEM', category: 'contoh' },
  { id: '2', title: 'Apa itu 5W+1H?', youtubeId: '0p-3s6sH1Q', category: 'materi' }
];

export const INITIAL_QUIZ: QuizQuestion[] = [
  { id: '1', question: 'Apa kepanjangan dari 5W+1H?', options: ['What, Who, When, Where, Why, How', 'Wajib, Waktu, Wawasan, Wajah, Warung, Hemat'], correctIndex: 0 },
  { id: '2', question: 'Berita harus bersifat faktual, artinya?', options: ['Berdasarkan opini', 'Berdasarkan kenyataan', 'Berdasarkan mimpi'], correctIndex: 1 },
];

// Data Awal Puzzle Level SMP (LENGKAP: 10 Mudah, 20 Sulit)
export const INITIAL_PUZZLES: PuzzleLevel[] = [
  // --- LEVEL MUDAH (10 SOAL) ---
  // Topik: Lingkungan Sekolah, Kegiatan Siswa, Hobi
  {
    id: 'm1',
    difficulty: 'mudah',
    headline: 'TIM BASKET SMP 1 JUARA KOTA',
    lead: 'Tim basket SMP Negeri 1 berhasil menyabet piala Walikota Cup pada laga final hari Minggu (12/10) di GOR Saparua.',
    body: 'Kemenangan diraih setelah mengalahkan tim lawan dengan skor tipis 50-48. Pelatih tim menyatakan kebanggaannya atas kerja keras para siswa selama latihan intensif dua bulan terakhir.'
  },
  {
    id: 'm2',
    difficulty: 'mudah',
    headline: 'KEGIATAN JUMAT BERSIH DI SEKOLAH',
    lead: 'Seluruh siswa dan guru SMP Harapan Bangsa gotong royong membersihkan lingkungan sekolah pada Jumat pagi (5/11).',
    body: 'Kegiatan ini bertujuan mencegah penyebaran nyamuk demam berdarah. Siswa dibagi menjadi beberapa kelompok untuk membersihkan selokan, kelas, dan taman sekolah.'
  },
  {
    id: 'm3',
    difficulty: 'mudah',
    headline: 'PERPUSTAKAAN DIGITAL DILUNCURKAN',
    lead: 'Kepala Dinas Pendidikan meresmikan penggunaan perpustakaan digital berbasis aplikasi di SMP 5 kemarin siang.',
    body: 'Aplikasi ini memungkinkan siswa meminjam buku elektronik (e-book) secara gratis. Diharapkan minat baca siswa akan meningkat dengan kemudahan akses teknologi ini.'
  },
   {
    id: 'm4',
    difficulty: 'mudah',
    headline: 'SISWA SMP CIPTAKAN ALAT DETEKSI BANJIR',
    lead: 'Rian, siswa kelas 8 SMP Merdeka, menciptakan alat pendeteksi banjir sederhana dari barang bekas.',
    body: 'Alat tersebut akan berbunyi nyaring jika air menyentuh sensor. Rian mengaku ide ini muncul karena rumahnya sering kebanjiran saat musim hujan.'
  },
  {
    id: 'm5',
    difficulty: 'mudah',
    headline: 'PEMILIHAN KETUA OSIS SECARA E-VOTING',
    lead: 'SMP Tunas Muda menggelar pemilihan Ketua OSIS periode baru menggunakan sistem pemungutan suara digital (e-voting) pada Senin (20/9).',
    body: 'Sistem ini dinilai lebih hemat kertas dan hasilnya bisa diketahui secara real-time. Terdapat tiga pasang calon yang bersaing memperebutkan suara dari 800 siswa.'
  },
  {
    id: 'm6',
    difficulty: 'mudah',
    headline: 'EKSTRAKURIKULER ROBOTIK RAIH EMAS',
    lead: 'Tim Robotik sekolah berhasil membawa pulang medali emas dalam kompetisi sains tingkat provinsi di Gedung Sate, Sabtu lalu.',
    body: 'Mereka menampilkan robot pemilah sampah otomatis. Karya ini dipuji juri karena relevan dengan masalah lingkungan saat ini dan menggunakan teknologi sensor canggih.'
  },
  {
    id: 'm7',
    difficulty: 'mudah',
    headline: 'KANTIN SEHAT BEBAS PLASTIK',
    lead: 'Mulai semester ini, kantin SMPN 10 tidak lagi menyediakan kemasan plastik sekali pakai bagi para siswa yang jajan.',
    body: 'Siswa diwajibkan membawa tempat makan dan botol minum sendiri (tumbler). Kebijakan ini berhasil mengurangi volume sampah sekolah hingga 40% dalam satu bulan.'
  },
  {
    id: 'm8',
    difficulty: 'mudah',
    headline: 'LOMBA MADING ANTAR KELAS',
    lead: 'Dalam rangka Bulan Bahasa, sekolah mengadakan lomba Majalah Dinding (Mading) 3D antar kelas yang berlangsung meriah di aula.',
    body: 'Setiap kelas menampilkan kreativitas dengan tema "Cinta Budaya Indonesia". Mading dinilai berdasarkan isi konten berita, estetika, dan penggunaan bahan daur ulang.'
  },
  {
    id: 'm9',
    difficulty: 'mudah',
    headline: 'PENSI SEKOLAH TAMPILKAN SENI TRADISIONAL',
    lead: 'Pentas Seni (Pensi) tahunan SMP Bintang Kejora tahun ini fokus menampilkan tarian dan musik tradisional dari berbagai daerah di Indonesia.',
    body: 'Acara ini bertujuan menanamkan rasa cinta tanah air kepada generasi muda. Penonton terpukau dengan penampilan angklung dan tari Saman yang dibawakan para siswa.'
  },
  {
    id: 'm10',
    difficulty: 'mudah',
    headline: 'PELATIHAN JURNALISTIK BAGI SISWA',
    lead: 'Sebanyak 50 siswa mengikuti pelatihan dasar jurnalistik yang dibimbing oleh wartawan senior koran lokal pada Sabtu (15/1).',
    body: 'Siswa diajarkan teknik wawancara dan menulis berita 5W+1H. Kegiatan ini merupakan persiapan untuk pembentukan tim redaksi majalah sekolah yang baru.'
  },


  // --- LEVEL SULIT (20 SOAL) ---
  // Topik: Nasional, Teknologi, Sains, Sosial (Bahasa lebih formal/kompleks)
  {
    id: 's1',
    difficulty: 'sulit',
    headline: 'PEMERINTAH HAPUS UJIAN NASIONAL TAHUN INI',
    lead: 'Kementerian Pendidikan dan Kebudayaan resmi mengumumkan penghapusan Ujian Nasional (UN) mulai tahun ajaran 2024/2025 sebagai langkah reformasi pendidikan.',
    body: 'Sebagai gantinya, penilaian kelulusan siswa akan diserahkan sepenuhnya kepada pihak sekolah melalui ujian sekolah dan asesmen kompetensi minimum. Kebijakan ini menuai pro dan kontra di kalangan pengamat pendidikan.'
  },
  {
    id: 's2',
    difficulty: 'sulit',
    headline: 'FENOMENA GERHANA BULAN TOTAL AKAN TERLIHAT BESOK',
    lead: 'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) memprediksi fenomena Gerhana Bulan Total akan melintasi langit Indonesia pada Selasa malam (8/11).',
    body: 'Masyarakat dapat menyaksikan fenomena langka ini mulai pukul 18.00 WIB tanpa alat bantu optik. BMKG menghimbau masyarakat pesisir untuk waspada terhadap potensi pasang air laut yang lebih tinggi dari biasanya.'
  },
  {
    id: 's3',
    difficulty: 'sulit',
    headline: 'INDONESIA TUAN RUMAH KTT G20 DI BALI',
    lead: 'Para pemimpin negara ekonomi terbesar dunia (G20) mulai berdatangan di Bandara Ngurah Rai, Bali, untuk menghadiri Konferensi Tingkat Tinggi yang dimulai besok.',
    body: 'Agenda utama pertemuan ini membahas pemulihan ekonomi global pasca pandemi dan krisis energi. Ribuan personil keamanan dikerahkan untuk memastikan kelancaran acara internasional tersebut.'
  },
  {
    id: 's4',
    difficulty: 'sulit',
    headline: 'KENAIKAN SUHU BUMI MENCAPAI TITIK KRITIS',
    lead: 'Laporan terbaru PBB mengenai perubahan iklim memperingatkan bahwa kenaikan suhu bumi telah mencapai ambang batas yang mengkhawatirkan bagi ekosistem.',
    body: 'Para ilmuwan mendesak negara-negara industri untuk segera memangkas emisi karbon. Dampak pemanasan global sudah terasa dengan mencairnya es di kutub dan cuaca ekstrem di berbagai belahan dunia.'
  },
  {
    id: 's5',
    difficulty: 'sulit',
    headline: 'MOBIL LISTRIK BUATAN MAHASISWA DIPAMERKAN',
    lead: 'Tim mahasiswa teknik dari universitas terkemuka meluncurkan prototipe mobil listrik hemat energi dalam pameran teknologi di Jakarta Convention Center.',
    body: 'Mobil ini diklaim mampu menempuh jarak 500 km dalam sekali pengisian daya. Inovasi ini diharapkan dapat mendukung program pemerintah dalam percepatan penggunaan kendaraan bermotor listrik berbasis baterai.'
  },
  {
    id: 's6',
    difficulty: 'sulit',
    headline: 'HARIMAU SUMATERA TERANCAM PUNAH',
    lead: 'Populasi Harimau Sumatera di alam liar diperkirakan tinggal tersisa kurang dari 400 ekor akibat perburuan liar dan penyempitan habitat hutan.',
    body: 'Organisasi konservasi dunia menyerukan penegakan hukum yang lebih tegas terhadap pemburu. Upaya pelestarian habitat menjadi kunci agar satwa endemik Indonesia ini tidak hilang selamanya.'
  },
  {
    id: 's7',
    difficulty: 'sulit',
    headline: 'SATELIT BARU INDONESIA SUKSES MENGORBIT',
    lead: 'Satelit multifungsi milik Indonesia berhasil diluncurkan dari pangkalan luar angkasa di Florida, Amerika Serikat, dini hari tadi waktu Indonesia.',
    body: 'Satelit ini akan beroperasi untuk meratakan akses internet di daerah terdepan, terluar, dan tertinggal (3T). Kehadirannya diharapkan mampu menunjang ekonomi digital nasional.'
  },
  {
    id: 's8',
    difficulty: 'sulit',
    headline: 'PENEMUAN CANDI KUNO DI JAWA TIMUR',
    lead: 'Tim arkeolog menemukan struktur bata merah yang diduga merupakan sisa bangunan candi peninggalan Kerajaan Majapahit saat melakukan ekskavasi di Mojokerto.',
    body: 'Penemuan ini bermula dari laporan warga yang sedang menggali tanah. Balai Pelestarian Kebudayaan kini telah mengamankan lokasi untuk penelitian sejarah lebih lanjut.'
  },
  {
    id: 's9',
    difficulty: 'sulit',
    headline: 'WASPADAI PENIPUAN ONLINE MODUS BARU',
    lead: 'Kepolisian Republik Indonesia menghimbau masyarakat agar waspada terhadap maraknya penipuan online dengan modus mengirimkan tautan undangan pernikahan digital.',
    body: 'Tautan tersebut ternyata berisi aplikasi jahat yang dapat mencuri data perbankan korban. Polisi menyarankan agar warga tidak sembarangan mengklik tautan dari nomor tidak dikenal.'
  },
  {
    id: 's10',
    difficulty: 'sulit',
    headline: 'KAMPANYE LITERASI DIGITAL UNTUK REMAJA',
    lead: 'Kementerian Kominfo meluncurkan program nasional literasi digital yang menargetkan satu juta pelajar SMP dan SMA agar bijak bermedia sosial.',
    body: 'Program ini mencakup pelatihan mengidentifikasi berita hoaks, menjaga privasi data, dan etika berkomentar. Hal ini dianggap mendesak mengingat tingginya penggunaan internet di kalangan remaja.'
  },
  {
    id: 's11',
    difficulty: 'sulit',
    headline: 'INFLASI PANGAN PENGARUHI HARGA PASAR',
    lead: 'Badan Pusat Statistik (BPS) mencatat kenaikan inflasi pada sektor pangan bulan ini, yang dipicu oleh gagal panen akibat cuaca buruk di sentra pertanian.',
    body: 'Harga cabai dan bawang merah mengalami lonjakan signifikan. Pemerintah berupaya menstabilkan harga dengan melakukan operasi pasar murah di berbagai daerah.'
  },
  {
    id: 's12',
    difficulty: 'sulit',
    headline: 'VAKSINASI BOOSTER KEDUA DIMULAI',
    lead: 'Dinas Kesehatan mulai memberikan layanan vaksinasi COVID-19 booster kedua bagi masyarakat umum di puskesmas dan rumah sakit daerah mulai pekan ini.',
    body: 'Langkah ini diambil untuk meningkatkan imunitas masyarakat di tengah munculnya varian baru. Warga yang sudah memenuhi syarat waktu interval vaksinasi dihimbau segera mendaftar.'
  },
  {
    id: 's13',
    difficulty: 'sulit',
    headline: 'INDONESIA JUARA UMUM SEA GAMES',
    lead: 'Kontingen Indonesia memastikan diri sebagai juara umum pada ajang olahraga SEA Games tahun ini setelah perolehan medali emas tidak terkejar negara lain.',
    body: 'Cabang olahraga pencak silat dan bulu tangkis menjadi penyumbang emas terbanyak. Presiden menyampaikan apresiasi tinggi kepada seluruh atlet yang telah mengharumkan nama bangsa.'
  },
  {
    id: 's14',
    difficulty: 'sulit',
    headline: 'AI AKAN GANTIKAN PEKERJAAN MANUSIA?',
    lead: 'Perkembangan pesat Kecerdasan Buatan (AI) memicu perdebatan global mengenai potensi hilangnya jutaan lapangan pekerjaan dalam satu dekade mendatang.',
    body: 'Para ahli menyarankan reformasi pendidikan yang fokus pada keahlian kreatif dan emosional yang sulit ditiru mesin. Namun, AI juga diprediksi akan menciptakan jenis pekerjaan baru di bidang teknologi.'
  },
  {
    id: 's15',
    difficulty: 'sulit',
    headline: 'MRT FASE DUA RESMI DIBANGUN',
    lead: 'Gubernur DKI Jakarta melakukan peletakan batu pertama pembangunan MRT Jakarta Fase 2A yang menghubungkan kawasan Bundaran HI hingga Kota Tua.',
    body: 'Proyek ini diharapkan dapat mengurai kemacetan parah di ibu kota. Jalur ini akan dibangun sepenuhnya di bawah tanah dan ditargetkan rampung dalam lima tahun ke depan.'
  },
  {
    id: 's16',
    difficulty: 'sulit',
    headline: 'DARURAT SAMPAH PLASTIK DI LAUT',
    lead: 'Studi terbaru menunjukkan Indonesia menjadi salah satu penyumbang sampah plastik terbesar ke laut, mengancam kehidupan biota laut dan terumbu karang.',
    body: 'Pemerintah merespons dengan target pengurangan sampah plastik hingga 70% pada 2025. Edukasi daur ulang dan pembatasan penggunaan plastik sekali pakai terus digencarkan.'
  },
  {
    id: 's17',
    difficulty: 'sulit',
    headline: 'PENURUNAN MUKA TANAH DI PESISIR UTARA',
    lead: 'Para ahli geologi memperingatkan percepatan penurunan muka tanah di wilayah pesisir utara Jawa akibat pengambilan air tanah yang berlebihan.',
    body: 'Jika tidak segera ditangani, beberapa wilayah diprediksi akan tenggelam pada 2050. Solusi yang ditawarkan meliputi pembangunan tanggul laut raksasa dan penyediaan air bersih perpipaan.'
  },
  {
    id: 's18',
    difficulty: 'sulit',
    headline: 'BATIK INDONESIA MENDUNIA',
    lead: 'Desainer muda Indonesia sukses memamerkan koleksi busana berbahan Batik di ajang New York Fashion Week, mendapatkan sambutan hangat kritikus mode.',
    body: 'Koleksi ini memadukan motif tradisional dengan potongan modern. Hal ini membuktikan bahwa warisan budaya Indonesia memiliki daya tarik tinggi di pasar internasional.'
  },
  {
    id: 's19',
    difficulty: 'sulit',
    headline: 'REKOR EKSPOR PERTANIAN MENINGKAT',
    lead: 'Kementerian Pertanian melaporkan nilai ekspor produk pertanian Indonesia tahun ini mencapai rekor tertinggi, didorong oleh komoditas kelapa sawit dan kopi.',
    body: 'Pemerintah terus mendorong hilirisasi produk agar memiliki nilai tambah lebih besar. Petani milenial juga mulai dilibatkan untuk memodernisasi sektor pertanian nasional.'
  },
  {
    id: 's20',
    difficulty: 'sulit',
    headline: 'GEMPA BUMI GUNCANG WILAYAH SELATAN',
    lead: 'Gempa berkekuatan 6,5 magnitudo mengguncang wilayah pesisir selatan Jawa siang tadi, menyebabkan kepanikan warga namun tidak berpotensi tsunami.',
    body: 'Badan Penanggulangan Bencana Daerah (BPBD) melaporkan kerusakan ringan pada puluhan rumah. Tim SAR telah diterjunkan ke lokasi untuk membantu evakuasi warga terdampak.'
  }
];

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // FontAwesome icon class
  condition: 'quiz_10' | 'hoax_5' | 'puzzle_10' | 'writing_5' | 'perfect_quiz' | 'speed_quiz' | 'all_games';
  color: string; // Tailwind color class
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: number; // timestamp
}

export interface PlayerStats {
  userId: string;
  userName: string;
  school: string;
  totalScore: number;
  quizCompleted: number;
  quizCorrect: number;
  hoaxBusted: number;
  puzzlesCompleted: number;
  writingSubmitted: number;
  achievements: UserAchievement[];
  lastUpdated: number;
}

export interface LeaderboardEntry extends PlayerStats {
  rank: number;
  accuracy: number; // percentage of correct answers
}

// Multiplayer Game Types
export interface MultiplayerPlayer {
  name: string;
  side: 'left' | 'right';
  score: number;
  correct?: number;
  hoaxCaught?: number;
  puzzlesSolved?: number;
}

export interface MultiplayerGameState {
  player1: MultiplayerPlayer;
  player2: MultiplayerPlayer;
  gameMode: 'quiz' | 'hoax' | 'puzzle';
  timeLimit: number; // seconds (60, 120, 180, 300)
  timeRemaining: number;
  isActive: boolean;
  startTime: number;
  endTime: number;
}

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Selesaikan 10 kuis dengan benar',
    icon: 'brain',
    condition: 'quiz_10',
    color: 'bg-blue-500'
  },
  {
    id: 'hoax_buster',
    name: 'Hoax Buster',
    description: 'Tangkap 5 berita palsu',
    icon: 'shield-alt',
    condition: 'hoax_5',
    color: 'bg-red-500'
  },
  {
    id: 'puzzle_solver',
    name: 'Puzzle Solver',
    description: 'Selesaikan 10 puzzle berita',
    icon: 'puzzle-piece',
    condition: 'puzzle_10',
    color: 'bg-purple-500'
  },
  {
    id: 'author',
    name: 'Penulis Muda',
    description: 'Tulis 5 berita original',
    icon: 'pen-fancy',
    condition: 'writing_5',
    color: 'bg-green-500'
  },
  {
    id: 'perfect',
    name: 'Sempurna!',
    description: 'Jawab satu kuis dengan nilai 100%',
    icon: 'star',
    condition: 'perfect_quiz',
    color: 'bg-yellow-500'
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Selesaikan kuis dalam waktu kurang dari 30 detik',
    icon: 'bolt',
    condition: 'speed_quiz',
    color: 'bg-orange-500'
  },
  {
    id: 'journalist',
    name: 'Jurnalis Sejati',
    description: 'Mainkan semua mode permainan',
    icon: 'newspaper',
    condition: 'all_games',
    color: 'bg-indigo-500'
  }
];