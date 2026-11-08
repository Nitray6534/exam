// Data awal materi SkillLearn. Video memakai video YouTube publik yang ID-nya sudah diverifikasi.
const P = 'pemrograman';
const D = 'desain-grafis';
const M = 'digital-marketing';
const T = 'teknologi';

const subtitleNote = 'Video berbahasa Inggris, aktifkan subtitle bila perlu';

export const materials = [
  {
    order: 1,
    title: 'Dasar Pemrograman dengan JavaScript: Intro',
    slug: 'video-dasar-javascript-wpu',
    category: P,
    type: 'video',
    level: 'Pemula',
    durationMinutes: 20,
    summary:
      'Video pembuka seri dasar pemrograman JavaScript dari kanal WPU. Cocok untuk kamu yang baru mulai belajar logika pemrograman.',
    author: 'WPU (Web Programming UNPAS)',
    tags: ['javascript', 'dasar pemrograman', 'web'],
    video: {
      youtubeId: 'RUTV_5m4VeI',
      channel: 'WPU',
      sourceTitle: '1. Dasar Pemrograman dengan Javascript : INTRO',
      keyPoints: [
        'Perhatikan bagaimana JavaScript bekerja bersama HTML dan CSS',
        'Catat tools yang disarankan untuk mulai menulis kode',
        'Tulis pertanyaan yang muncul selama menonton, lalu cari jawabannya di materi artikel',
        'Setelah selesai, lanjutkan ke Kuis Dasar JavaScript',
      ],
    },
  },
  {
    order: 2,
    title: 'Prinsip Dasar Desain: Kontras, Hierarki, dan Ruang Kosong',
    slug: 'prinsip-dasar-desain',
    category: D,
    type: 'artikel',
    level: 'Pemula',
    durationMinutes: 7,
    summary:
      'Tiga prinsip yang menjadi fondasi hampir semua karya visual, dari poster sampai antarmuka aplikasi.',
    tags: ['prinsip desain', 'layout', 'hierarki'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Desain yang baik bukan soal hiasan, tetapi soal membantu orang memahami informasi dengan cepat. Tiga prinsip berikut menjadi fondasi hampir semua karya visual, dari poster sampai antarmuka aplikasi.',
      },
      { kind: 'heading', text: 'Kontras' },
      {
        kind: 'paragraph',
        text: 'Kontras membuat elemen penting menonjol. Kontras bisa dibangun lewat ukuran, warna, ketebalan huruf, atau bentuk. Untuk teks, pastikan rasio kontras dengan latar minimal 4.5:1 agar tetap terbaca (standar WCAG level AA).',
      },
      { kind: 'heading', text: 'Hierarki visual' },
      {
        kind: 'paragraph',
        text: 'Hierarki menentukan urutan mata membaca. Judul paling besar, subjudul lebih kecil, lalu isi. Jika semua elemen dibuat sama besar, tidak ada yang terasa penting.',
      },
      {
        kind: 'list',
        items: [
          'Gunakan maksimal 3 ukuran huruf dalam satu desain sederhana.',
          'Bedakan tingkat informasi dengan ketebalan huruf sebelum menambah warna.',
          'Letakkan informasi utama di area yang pertama kali dilihat, biasanya kiri atas.',
        ],
      },
      { kind: 'heading', text: 'Ruang kosong (white space)' },
      {
        kind: 'paragraph',
        text: 'Ruang kosong memberi napas pada desain dan mengelompokkan elemen yang saling berhubungan. Elemen yang berdekatan dianggap satu kelompok (prinsip proximity), jadi atur jarak dengan sengaja.',
      },
      {
        kind: 'tip',
        text: 'Latihan cepat: ambil satu poster acara, lalu tulis urutan informasi yang kamu baca pertama, kedua, dan ketiga. Jika urutannya membingungkan, hierarkinya perlu diperbaiki.',
      },
    ],
  },
  {
    order: 3,
    title: 'Kuis Dasar SEO dan Media Sosial',
    slug: 'kuis-seo-media-sosial',
    category: M,
    type: 'kuis',
    level: 'Pemula',
    durationMinutes: 5,
    summary: 'Uji pemahamanmu tentang SEO, metrik iklan, dan funnel pemasaran dalam 5 soal.',
    tags: ['seo', 'media sosial', 'metrik'],
    quiz: [
      {
        question: 'SEO adalah singkatan dari...',
        options: [
          'Search Engine Optimization',
          'Social Engagement Online',
          'Search Email Outreach',
          'Site Engine Operation',
        ],
        answerIndex: 0,
        explanation:
          'SEO (Search Engine Optimization) adalah upaya agar halaman web mudah ditemukan di hasil pencarian organik.',
      },
      {
        question:
          'Metrik yang menunjukkan persentase orang yang mengklik dari total yang melihat iklan adalah...',
        options: ['CPA', 'CTR', 'ROI', 'CPM'],
        answerIndex: 1,
        explanation: 'CTR (click-through rate) dihitung dari jumlah klik dibagi impressions, dikali 100%.',
      },
      {
        question: 'Tahap funnel ketika calon pelanggan membandingkan beberapa pilihan disebut...',
        options: ['Awareness', 'Consideration', 'Conversion', 'Retention'],
        answerIndex: 1,
        explanation:
          'Pada tahap consideration, calon pelanggan sudah mengenal merek dan sedang menimbang pilihan.',
      },
      {
        question:
          'Judul berwarna biru pada hasil pencarian Google paling sering diambil dari elemen...',
        options: ['Meta keywords', 'Title tag', 'Alt text gambar', 'Footer halaman'],
        answerIndex: 1,
        explanation:
          'Title tag (<title>) adalah sumber utama judul di hasil pencarian, walaupun Google dapat menulis ulangnya.',
      },
      {
        question: 'Engagement rate di media sosial umumnya dihitung dari...',
        options: [
          'Jumlah followers saja',
          'Jumlah interaksi (like, komentar, share, save) dibanding reach atau followers',
          'Jumlah posting per minggu',
          'Biaya iklan per hari',
        ],
        answerIndex: 1,
        explanation:
          'Engagement rate membandingkan interaksi dengan jumlah orang yang melihat atau mengikuti akun.',
      },
    ],
  },
  {
    order: 4,
    title: 'Latihan: Mengamankan Akun dengan 2FA dan Password Manager',
    slug: 'latihan-keamanan-akun',
    category: T,
    type: 'latihan',
    level: 'Pemula',
    durationMinutes: 30,
    summary:
      'Langkah praktis meningkatkan keamanan akun email, media sosial, dan akun kampus dalam 30 menit.',
    tags: ['keamanan', '2fa', 'password'],
    practice: {
      goal: 'Meningkatkan keamanan akun digital pribadi (email, media sosial, dan akun kampus) dengan langkah praktis yang bisa langsung dikerjakan.',
      tools: [
        'Password manager (Bitwarden, 1Password, atau bawaan browser)',
        'Aplikasi authenticator (Google Authenticator atau Microsoft Authenticator)',
        'Situs haveibeenpwned.com',
      ],
      steps: [
        'Cek apakah email kamu pernah terlibat kebocoran data di haveibeenpwned.com.',
        'Pasang password manager dan buat master password berupa passphrase panjang.',
        'Ganti password akun email utama dengan password acak yang dibuat password manager.',
        'Aktifkan 2FA berbasis aplikasi authenticator pada email dan media sosial.',
        'Simpan backup codes 2FA di tempat aman yang terpisah dari ponsel.',
        'Tinjau daftar perangkat yang sedang login di akunmu dan keluarkan perangkat yang tidak dikenal.',
      ],
      checklist: [
        'Sudah mengecek kebocoran data email',
        'Password manager terpasang',
        'Password email utama sudah diganti',
        '2FA aktif di minimal 2 akun',
        'Backup codes tersimpan aman',
      ],
    },
  },
  {
    order: 5,
    title: 'Variabel dan Tipe Data di JavaScript',
    slug: 'variabel-tipe-data-javascript',
    category: P,
    type: 'artikel',
    level: 'Pemula',
    durationMinutes: 8,
    summary:
      'Kenali let, const, dan var, tujuh tipe data primitif, serta jebakan type coercion yang sering membuat bug.',
    tags: ['javascript', 'variabel', 'tipe data'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Variabel adalah wadah bernama untuk menyimpan data yang akan dipakai program. Di JavaScript modern ada tiga cara membuat variabel: let, const, dan var. Memahami perbedaannya akan menghindarkan kamu dari bug yang sulit dilacak.',
      },
      { kind: 'heading', text: 'let, const, dan var' },
      {
        kind: 'list',
        items: [
          'const untuk nilai yang tidak akan di-assign ulang, misalnya URL API atau konfigurasi.',
          'let untuk nilai yang akan berubah, misalnya counter atau total belanja.',
          'var adalah cara lama dengan function scope. Hindari di kode baru karena mudah menimbulkan kebingungan scope.',
        ],
      },
      {
        kind: 'code',
        text: "const kampus = 'BINUS';\nlet semester = 3;\nsemester = semester + 1; // boleh\n// kampus = 'Lain';     // TypeError: Assignment to constant variable",
      },
      { kind: 'heading', text: 'Tipe data primitif' },
      {
        kind: 'paragraph',
        text: 'JavaScript memiliki tujuh tipe primitif: string, number, bigint, boolean, undefined, null, dan symbol. Selain itu ada object, yang juga mencakup array dan function.',
      },
      {
        kind: 'code',
        text: "typeof 'halo'      // 'string'\ntypeof 42          // 'number'\ntypeof true        // 'boolean'\ntypeof undefined   // 'undefined'\ntypeof null        // 'object' (bug historis)\ntypeof [1, 2, 3]   // 'object'",
      },
      { kind: 'heading', text: 'Hati-hati dengan type coercion' },
      {
        kind: 'paragraph',
        text: 'JavaScript sering mengubah tipe data secara otomatis. Operator == membandingkan setelah konversi tipe, sedangkan === membandingkan nilai sekaligus tipe datanya.',
      },
      { kind: 'code', text: "'5' == 5    // true\n'5' === 5   // false\n'2' + 2     // '22'\n'2' * 2     // 4" },
      {
        kind: 'tip',
        text: 'Biasakan memakai const secara default, ganti ke let hanya jika nilainya memang perlu berubah, dan selalu gunakan === saat membandingkan.',
      },
    ],
  },
  {
    order: 6,
    title: 'Mengenal Figma untuk Pemula',
    slug: 'video-figma-pemula',
    category: D,
    type: 'video',
    level: 'Pemula',
    durationMinutes: 25,
    summary:
      'Tur singkat antarmuka Figma dan alur kerja dasar membuat desain UI, dari frame sampai prototype.',
    author: 'Rino de Boer',
    tags: ['figma', 'ui design', 'tools'],
    video: {
      youtubeId: 'JGLfyTDgfDc',
      channel: 'Rino de Boer',
      sourceTitle: 'Introducing Figma: A Beginners Tutorial (2023 UI UX Design)',
      keyPoints: [
        'Kenali bagian antarmuka Figma: canvas, layers panel, dan properties panel',
        'Catat shortcut yang dipakai, misalnya F untuk frame dan T untuk teks',
        'Ikuti langsung di akun Figma gratis sambil menonton',
        subtitleNote,
      ],
    },
  },
  {
    order: 7,
    title: 'Funnel Pemasaran Digital: Dari Awareness ke Konversi',
    slug: 'funnel-pemasaran-digital',
    category: M,
    type: 'artikel',
    level: 'Pemula',
    durationMinutes: 9,
    summary:
      'Pahami empat tahap perjalanan pelanggan beserta konten dan metrik yang tepat untuk setiap tahap.',
    tags: ['funnel', 'strategi', 'metrik'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Calon pelanggan jarang langsung membeli saat pertama kali melihat sebuah merek. Mereka melewati beberapa tahap yang biasa digambarkan sebagai funnel atau corong pemasaran. Memahami funnel membantu kamu memilih konten dan metrik yang tepat di setiap tahap.',
      },
      { kind: 'heading', text: '1. Awareness' },
      {
        kind: 'paragraph',
        text: 'Tujuannya membuat orang tahu bahwa merek kamu ada. Konten yang cocok: video pendek, konten edukatif, dan kolaborasi dengan kreator. Metrik yang dipantau: reach, impressions, dan views.',
      },
      { kind: 'heading', text: '2. Consideration' },
      {
        kind: 'paragraph',
        text: 'Calon pelanggan mulai membandingkan pilihan. Berikan alasan untuk memilih kamu melalui testimoni, perbandingan fitur, atau studi kasus. Metrik: engagement rate, klik ke website, dan waktu baca.',
      },
      { kind: 'heading', text: '3. Conversion' },
      {
        kind: 'paragraph',
        text: 'Tahap ketika orang mengambil tindakan, misalnya membeli, mendaftar, atau mengisi formulir. Permudah prosesnya dengan call to action yang jelas dan halaman yang cepat dimuat. Metrik: conversion rate dan cost per acquisition.',
      },
      { kind: 'heading', text: '4. Retention' },
      {
        kind: 'paragraph',
        text: 'Mempertahankan pelanggan lama biasanya lebih murah daripada mencari pelanggan baru. Gunakan email, program loyalitas, dan layanan purna jual yang responsif.',
      },
      {
        kind: 'list',
        items: [
          'Awareness: reach dan impressions',
          'Consideration: engagement rate dan CTR',
          'Conversion: conversion rate dan CPA',
          'Retention: repeat purchase dan churn rate',
        ],
      },
      {
        kind: 'tip',
        text: 'Sebelum membuat konten, tanyakan dulu: konten ini untuk tahap funnel yang mana? Satu konten yang mencoba melayani semua tahap biasanya tidak efektif di tahap mana pun.',
      },
    ],
  },
  {
    order: 8,
    title: 'Kuis Keamanan Siber Dasar',
    slug: 'kuis-keamanan-siber',
    category: T,
    type: 'kuis',
    level: 'Pemula',
    durationMinutes: 5,
    summary: 'Seberapa siap kamu menghadapi phishing, password lemah, dan ransomware? Cek lewat 5 soal.',
    tags: ['keamanan', 'phishing', 'password'],
    quiz: [
      {
        question: 'Email yang menyamar sebagai pihak tepercaya untuk mencuri password disebut...',
        options: ['Phishing', 'DNS spoofing', 'DDoS', 'Ransomware'],
        answerIndex: 0,
        explanation:
          'Phishing memanfaatkan rekayasa sosial: korban diarahkan ke halaman palsu untuk memasukkan kredensial.',
      },
      {
        question: 'Langkah paling efektif melindungi akun jika password kamu bocor adalah...',
        options: [
          'Mengganti foto profil',
          'Mengaktifkan two-factor authentication (2FA)',
          'Logout dari semua perangkat setiap hari',
          'Memakai password pendek agar mudah diingat',
        ],
        answerIndex: 1,
        explanation:
          '2FA menambahkan faktor kedua, sehingga password yang bocor saja tidak cukup untuk masuk ke akun.',
      },
      {
        question: 'Protokol yang mengenkripsi komunikasi antara browser dan website adalah...',
        options: ['HTTP', 'FTP', 'HTTPS (TLS)', 'Telnet'],
        answerIndex: 2,
        explanation: 'HTTPS adalah HTTP yang berjalan di atas TLS sehingga data terenkripsi saat dikirim.',
      },
      {
        question: 'Password mana yang paling kuat?',
        options: ['binus2024', 'P@ssw0rd', 'kopi-senja-gitar-hujan-42', '12345678'],
        answerIndex: 2,
        explanation:
          'Passphrase panjang dari beberapa kata acak lebih sulit ditebak, namun tetap mudah diingat.',
      },
      {
        question: 'Malware yang mengenkripsi file korban lalu meminta tebusan disebut...',
        options: ['Adware', 'Spyware', 'Ransomware', 'Worm'],
        answerIndex: 2,
        explanation: 'Ransomware mengunci data korban dan meminta tebusan. Backup rutin adalah pertahanan utama.',
      },
    ],
  },
  {
    order: 9,
    title: 'Kuis Dasar JavaScript',
    slug: 'kuis-dasar-javascript',
    category: P,
    type: 'kuis',
    level: 'Pemula',
    durationMinutes: 5,
    summary: 'Lima soal untuk menguji pemahaman variabel, tipe data, operator, dan array di JavaScript.',
    tags: ['javascript', 'kuis', 'dasar'],
    quiz: [
      {
        question: 'Keyword yang paling tepat untuk nilai yang tidak akan di-assign ulang adalah...',
        options: ['var', 'let', 'const', 'static'],
        answerIndex: 2,
        explanation: 'const mencegah assignment ulang pada variabel. Jadikan const sebagai pilihan default.',
      },
      {
        question: "Apa hasil dari '2' + 2 di JavaScript?",
        options: ['4', "'22'", 'NaN', 'TypeError'],
        answerIndex: 1,
        explanation:
          'Operator + dengan string melakukan penggabungan (concatenation), sehingga angka 2 diubah menjadi string.',
      },
      {
        question: 'Apa hasil dari typeof null?',
        options: ["'null'", "'undefined'", "'object'", "'number'"],
        answerIndex: 2,
        explanation: "typeof null menghasilkan 'object'. Ini bug historis yang dipertahankan demi kompatibilitas.",
      },
      {
        question: 'Operator perbandingan yang memeriksa nilai sekaligus tipe data adalah...',
        options: ['=', '==', '===', '=>'],
        answerIndex: 2,
        explanation: '=== (strict equality) tidak melakukan konversi tipe sebelum membandingkan.',
      },
      {
        question:
          'Method array yang menghasilkan array baru berisi hasil transformasi setiap elemen adalah...',
        options: ['forEach()', 'map()', 'push()', 'find()'],
        answerIndex: 1,
        explanation: 'map() mengembalikan array baru. forEach() hanya menjalankan fungsi tanpa mengembalikan array.',
      },
    ],
  },
  {
    order: 10,
    title: 'Latihan: Mendesain Poster Acara Kampus',
    slug: 'latihan-poster-acara-kampus',
    category: D,
    type: 'latihan',
    level: 'Pemula',
    durationMinutes: 60,
    summary:
      'Praktikkan hierarki, kontras, dan ruang kosong dengan membuat poster seminar kampus di Figma.',
    tags: ['figma', 'poster', 'layout'],
    practice: {
      goal: 'Membuat poster digital ukuran 1080 x 1350 px untuk acara seminar kampus dengan hierarki informasi yang jelas.',
      tools: ['Figma (akun gratis)', 'Google Fonts', 'Unsplash untuk foto bebas pakai'],
      steps: [
        'Buat frame berukuran 1080 x 1350 px di Figma.',
        'Tulis semua informasi: nama acara, tema, pembicara, tanggal, lokasi, dan cara mendaftar.',
        'Urutkan informasi berdasarkan kepentingan, lalu tentukan 3 ukuran huruf (judul, subjudul, isi).',
        'Pilih palet maksimal 3 warna dan cek kontras teks terhadap latar.',
        'Susun layout dengan margin minimal 64 px di setiap sisi agar poster tidak terasa sesak.',
        'Minta satu teman melihat poster selama 5 detik, lalu tanyakan informasi apa yang ia ingat.',
      ],
      checklist: [
        'Nama acara adalah elemen paling menonjol',
        'Tanggal dan lokasi terbaca dalam 5 detik',
        'Maksimal 2 jenis font',
        'Kontras teks memenuhi rasio 4.5:1',
        'Ada call to action yang jelas (contoh: scan QR untuk daftar)',
      ],
    },
  },
  {
    order: 11,
    title: 'Digital Marketing dalam 5 Menit',
    slug: 'video-digital-marketing-5-menit',
    category: M,
    type: 'video',
    level: 'Pemula',
    durationMinutes: 10,
    summary:
      'Gambaran singkat apa itu digital marketing dan kanal-kanal utamanya, cocok sebagai titik awal.',
    author: 'Simplilearn',
    tags: ['digital marketing', 'pengantar'],
    video: {
      youtubeId: 'bixR-KIJKYM',
      channel: 'Simplilearn',
      sourceTitle: 'Digital Marketing In 5 Minutes | What Is Digital Marketing?',
      keyPoints: [
        'Catat perbedaan pemasaran tradisional dan pemasaran digital',
        'Perhatikan kanal yang disebutkan, misalnya SEO, media sosial, dan email',
        'Pikirkan satu bisnis di sekitarmu dan kanal mana yang paling cocok untuknya',
        subtitleNote,
      ],
    },
  },
  {
    order: 12,
    title: 'Cara Kerja Internet: Dari DNS sampai HTTP',
    slug: 'cara-kerja-internet',
    category: T,
    type: 'artikel',
    level: 'Pemula',
    durationMinutes: 10,
    summary:
      'Apa yang terjadi sejak kamu mengetik alamat website sampai halaman tampil di layar? Ikuti alurnya langkah demi langkah.',
    tags: ['internet', 'dns', 'http'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Saat kamu mengetik alamat website lalu menekan Enter, ada serangkaian proses yang terjadi dalam hitungan milidetik. Memahami alurnya sangat membantu ketika kamu belajar web development atau melakukan troubleshooting jaringan.',
      },
      { kind: 'heading', text: '1. DNS resolution' },
      {
        kind: 'paragraph',
        text: 'Komputer berkomunikasi memakai alamat IP, bukan nama domain. Browser bertanya ke DNS resolver untuk menerjemahkan nama domain menjadi alamat IP. Hasilnya disimpan di cache agar kunjungan berikutnya lebih cepat.',
      },
      { kind: 'heading', text: '2. Koneksi TCP dan TLS' },
      {
        kind: 'paragraph',
        text: 'Browser membuka koneksi TCP ke server melalui three-way handshake (SYN, SYN-ACK, ACK). Untuk situs HTTPS, proses dilanjutkan dengan TLS handshake agar data terenkripsi dan identitas server terverifikasi lewat sertifikat.',
      },
      { kind: 'heading', text: '3. HTTP request dan response' },
      {
        kind: 'paragraph',
        text: 'Browser mengirim HTTP request, misalnya GET /index.html. Server membalas dengan response yang berisi status code, header, dan body.',
      },
      {
        kind: 'code',
        text: 'GET /api/materials HTTP/1.1\nHost: skilllearn.app\nAuthorization: Bearer <token>\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{ "total": 17, "items": [ ... ] }',
      },
      { kind: 'heading', text: '4. Rendering' },
      {
        kind: 'paragraph',
        text: 'Browser membaca HTML, mengunduh CSS dan JavaScript, menyusun DOM, lalu menampilkan halaman. Setiap gambar atau script tambahan memicu request baru.',
      },
      {
        kind: 'list',
        items: [
          '2xx: berhasil (200 OK, 201 Created)',
          '3xx: redirect (301, 302)',
          '4xx: kesalahan dari sisi klien (400, 401, 404)',
          '5xx: kesalahan dari sisi server (500, 503)',
        ],
      },
      {
        kind: 'tip',
        text: 'Buka DevTools di browser (F12), pilih tab Network, lalu muat ulang halaman. Kamu bisa melihat setiap request, status code, dan waktu yang dibutuhkan.',
      },
    ],
  },
  {
    order: 13,
    title: 'Latihan: Membuat To-Do List dengan JavaScript',
    slug: 'latihan-todo-list-javascript',
    category: P,
    type: 'latihan',
    level: 'Pemula',
    durationMinutes: 45,
    summary:
      'Bangun aplikasi to-do list yang bisa menambah, menandai selesai, menghapus, dan menyimpan tugas di localStorage.',
    tags: ['javascript', 'dom', 'proyek mini'],
    practice: {
      goal: 'Membuat aplikasi to-do list sederhana yang bisa menambah, menandai selesai, dan menghapus tugas, lalu menyimpannya di localStorage.',
      tools: ['Browser (Chrome atau Firefox)', 'Code editor (VS Code)', 'HTML, CSS, dan JavaScript'],
      steps: [
        'Buat file index.html berisi input teks, tombol Tambah, dan elemen <ul> kosong.',
        'Di script.js, ambil elemen dengan document.querySelector lalu pasang event listener pada tombol.',
        'Simpan daftar tugas dalam array of object, misalnya { id, teks, selesai }.',
        'Buat fungsi render() yang mengosongkan <ul> lalu membuat <li> untuk setiap tugas.',
        'Tambahkan tombol hapus dan checkbox selesai pada setiap <li>.',
        'Simpan array ke localStorage setiap kali data berubah, lalu muat kembali saat halaman dibuka.',
      ],
      checklist: [
        'Tugas baru muncul setelah tombol Tambah diklik',
        'Input kosong tidak bisa ditambahkan',
        'Tugas bisa ditandai selesai dan tampil dicoret',
        'Tugas bisa dihapus',
        'Data tetap ada setelah halaman di-refresh',
      ],
    },
  },
  {
    order: 14,
    title: 'Kuis Warna dan Tipografi',
    slug: 'kuis-warna-tipografi',
    category: D,
    type: 'kuis',
    level: 'Pemula',
    durationMinutes: 5,
    summary: 'Uji pemahamanmu tentang kontras, teori warna, jenis huruf, dan format file desain.',
    tags: ['warna', 'tipografi', 'kuis'],
    quiz: [
      {
        question: 'Rasio kontras minimal untuk teks normal menurut WCAG level AA adalah...',
        options: ['3:1', '4.5:1', '7:1', '10:1'],
        answerIndex: 1,
        explanation: 'WCAG level AA mensyaratkan 4.5:1 untuk teks normal dan 3:1 untuk teks berukuran besar.',
      },
      {
        question: 'Warna yang letaknya berseberangan pada color wheel disebut...',
        options: ['Analogous', 'Monochromatic', 'Complementary', 'Triadic'],
        answerIndex: 2,
        explanation: 'Warna complementary (misalnya biru dan oranye) menghasilkan kontras yang kuat.',
      },
      {
        question: 'Jenis huruf yang memiliki kait kecil di ujung garisnya disebut...',
        options: ['Sans-serif', 'Serif', 'Monospace', 'Script'],
        answerIndex: 1,
        explanation: 'Serif memiliki kait (serif) di ujung huruf, contohnya Times New Roman dan Georgia.',
      },
      {
        question: 'Prinsip desain yang menyatakan elemen berdekatan dianggap satu kelompok adalah...',
        options: ['Proximity', 'Repetition', 'Alignment', 'Contrast'],
        answerIndex: 0,
        explanation: 'Proximity: kedekatan jarak membuat elemen dipersepsikan sebagai satu kelompok.',
      },
      {
        question: 'Format file yang paling tepat untuk logo agar tetap tajam saat diperbesar adalah...',
        options: ['JPG', 'PNG', 'SVG', 'GIF'],
        answerIndex: 2,
        explanation: 'SVG berbasis vektor sehingga tidak pecah saat diperbesar ke ukuran berapa pun.',
      },
    ],
  },
  {
    order: 15,
    title: 'Latihan: Menyusun Content Plan Instagram 1 Minggu',
    slug: 'latihan-content-plan-instagram',
    category: M,
    type: 'latihan',
    level: 'Menengah',
    durationMinutes: 50,
    summary:
      'Rancang 7 konten Instagram lengkap dengan content pillar, format, CTA, tahap funnel, dan metrik.',
    tags: ['instagram', 'content plan', 'media sosial'],
    practice: {
      goal: 'Menyusun rencana konten 7 hari untuk sebuah UMKM atau organisasi kampus, lengkap dengan tujuan funnel dan metrik.',
      tools: ['Google Sheets atau Notion', 'Canva atau Figma', 'Instagram Insights (jika memakai akun bisnis)'],
      steps: [
        'Pilih satu brand (UMKM keluarga, organisasi kampus, atau brand fiktif) dan tentukan target audiensnya.',
        'Tentukan 3 content pillar, misalnya edukasi, behind the scenes, dan promo.',
        'Buat tabel dengan kolom: hari, pillar, format (reels, carousel, story), ide konten, caption, CTA, dan tahap funnel.',
        'Isi 7 baris untuk satu minggu, dengan porsi promo maksimal 2 konten.',
        'Tentukan satu metrik utama untuk setiap konten (reach, saves, atau klik link).',
        'Jadwalkan waktu posting berdasarkan jam aktif audiens.',
      ],
      checklist: [
        'Target audiens tertulis jelas',
        'Ada 3 content pillar',
        '7 konten lengkap dengan format dan caption',
        'Setiap konten punya CTA dan tahap funnel',
        'Setiap konten punya metrik yang akan diukur',
      ],
    },
  },
  {
    order: 16,
    title: 'Apa itu Cloud Computing?',
    slug: 'video-cloud-computing-aws',
    category: T,
    type: 'video',
    level: 'Pemula',
    durationMinutes: 10,
    summary:
      'Penjelasan singkat konsep cloud computing dan alasan banyak aplikasi modern berjalan di cloud.',
    author: 'Amazon Web Services',
    tags: ['cloud', 'infrastruktur'],
    video: {
      youtubeId: 'mxT233EdY5c',
      channel: 'Amazon Web Services',
      sourceTitle: 'What is Cloud Computing? | Amazon Web Services',
      keyPoints: [
        'Catat definisi cloud computing dan model bayar sesuai pemakaian',
        'Bandingkan dengan membeli dan merawat server sendiri',
        'Pikirkan contoh layanan cloud yang kamu pakai sehari-hari',
        subtitleNote,
      ],
    },
  },
  {
    order: 17,
    title: 'JavaScript Full Course untuk Pemula',
    slug: 'video-javascript-full-course',
    category: P,
    type: 'video',
    level: 'Menengah',
    durationMinutes: 210,
    summary:
      'Kursus video lengkap JavaScript dari freeCodeCamp. Tonton bertahap per chapter sambil mempraktikkan kodenya.',
    author: 'freeCodeCamp.org',
    tags: ['javascript', 'kursus lengkap'],
    video: {
      youtubeId: 'PkZNo7MFNFg',
      channel: 'freeCodeCamp.org',
      sourceTitle: 'Learn JavaScript - Full Course for Beginners',
      keyPoints: [
        'Kursus ini panjang, tonton per bagian memakai chapter di YouTube',
        'Ketik ulang setiap contoh kode, jangan hanya menonton',
        'Tandai bagian yang belum dipahami lalu ulangi lewat materi artikel',
        subtitleNote,
      ],
    },
  },
];
