1. Latar Belakang & Tujuan
 Amalku  adalah aplikasi web yang membantu keluarga melacak ibadah Ramadhan secara bersama-sama. Dibuat supaya ibadah terasa lebih terstruktur, menyenangkan, dan bisa dinikmati semua anggota keluarga.
Masalah yang diselesaikan:

Tidak ada cara mudah memantau ibadah seluruh anggota keluarga dalam satu tempat
Anak-anak dan remaja kurang termotivasi karena tidak ada elemen fun
Tracker yang ada terlalu kompleks atau tidak ramah semua umur
Tidak ada kompetisi sehat antar keluarga yang bisa mempererat hubungan

Tujuan produk:

Tracker ibadah yang bisa diakses seluruh keluarga via browser, tanpa install app
Input semudah mungkin — tap-tap selesai dalam 30 detik
Progress keluarga tampil real-time dalam satu dashboard
Elemen fun (leaderboard, badge, trophy) supaya konsisten dipakai 30 hari

3. Fitur & Prioritas
#FiturDeskripsiPrioritas
1Tracker Ibadah HarianInput via kartu tap-only. Puasa, sholat 5 waktu, tarawih, tadarus, sedekah, 10+ sunnah. Tidak perlu ketik.P1 — Must Have2Kalender Ramadhan Visual30 kotak warna — hijau sempurna, kuning sebagian, abu kosong. Progress sekilas pandang.P1 — Must Have3Sistem Akun & Grup KeluargaLogin email, buat grup keluarga, undang via link. Satu keluarga = satu grup privat.P1 — Must Have4Family DashboardHalaman utama berisi semua anggota + status ibadah hari ini. Orang tua bisa pantau anak.P1 — Must Have5Leaderboard KeluargaRanking berdasarkan total poin. Update real-time. Filter per minggu & total Ramadhan.P2 — Should Have6Sistem Poin & BadgeSetiap ibadah hasilkan poin. Badge mingguan otomatis: Raja Tadarus, Bintang Sedekah, dll.P2 — Should Have7Streak CounterHitung hari berturut-turut ibadah penuh. Reset kalau satu hari terlewat.P2 — Should Have8Daily TrophyAnimasi trophy muncul kalau semua ibadah wajib selesai. Khusus motivasi anak-anak.P2 — Should Have9Koleksi Doa RamadhanDoa shahih Ramadhan — buka, sahur, lailatul qadar. Lengkap Arab, Latin, terjemahan.P3 — Nice to Have10Reminder HarianNotifikasi pengingat habis Isya untuk isi tracker. Via email atau push notification.P3 — Nice to Have11Share ke WhatsAppTombol share screenshot progress atau leaderboard ke grup WA.P3 — Nice to Have

Tabel poin ibadah:
IbadahPoinCatatanPuasa50 poinIbadah wajib utamaSholat Wajib (per sholat)10 poinMaks 50 poin/hariTarawih20 poin—Tadarus (per halaman)2 poinInput jumlah halamanSedekah15 poinCentang atau input nominalSholat Dhuha10 poin—Witir10 poin—Dzikir Pagi/Petang5 poin per sesiMaks 10 poin/hariSholat Rawatib5 poin—

🛠️ Tech Stack yang Direkomendasikan
Karena ini web app dengan multi-user per keluarga, ini stack yang cocok dan tidak terlalu rumit:
Frontend: Next.js + Tailwind CSS — cepat, bisa dibuka di HP maupun desktop
Backend & Auth: Supabase — gratis, ada sistem login/akun, database, dan realtime (cocok untuk leaderboard live)
Hosting: Vercel — gratis dan mudah deploy
Kombinasi ini memungkinkan kamu launch dengan budget nyaris nol untuk keluarga sendiri.