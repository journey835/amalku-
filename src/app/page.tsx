import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  CalendarCheck, 
  Trophy, 
  Flame, 
  Moon, 
  BookOpen, 
  Heart, 
  Star,
  Sparkles,
  ArrowRight,
  Check,
  Users
} from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to dashboard if already logged in
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">AmalKu</span>
          </div>
          <a
            href="/auth/login"
            className="px-5 py-2.5 gradient-primary text-white font-semibold rounded-xl transition hover:shadow-glow"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Ramadhan Tracker untuk Keluarga</span>
            </div>
            
            {/* Animated Icon */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 gradient-primary rounded-3xl animate-float shadow-glow"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <Moon className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Maksimalkan
              <span className="text-gradient"> Ramadhan </span>
              Bersama Keluarga
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Pantau progress ibadah, kumpulkan poin, dan berlomba-lomba dalam kebaikan bersama seluruh anggota keluarga.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/auth/login"
                className="group px-8 py-4 gradient-primary text-white font-bold rounded-2xl transition-all hover:shadow-glow-lg hover:scale-105 flex items-center gap-2"
              >
                Mulai Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Family friendly</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Gratis selamanya</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Gamifikasi seru</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Semua yang kamu butuhkan untuk menjadikan Ramadhan tahun ini lebih bermakna
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 card-hover border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Tracker Harian
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Catat semua ibadah harian dengan mudah: puasa, sholat 5 waktu, tarawih, tadarus, dan lainnya.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 card-hover border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Leaderboard Keluarga
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Berlomba-lomba dalam kebaikan! Lihat ranking dan motivasi satu sama lain.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 card-hover border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Streak & Badge
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Raih badge spesial dan jaga streak harian untuk mendapat motivasi ekstra!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cara Kerja
            </h2>
            <p className="text-slate-600">
              4 langkah mudah untuk memulai
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { step: 1, title: 'Login ke Akun', desc: 'Gunakan email dan password yang sudah didaftarkan', icon: Check },
              { step: 2, title: 'Input Ibadah Harian', desc: 'Centang ibadah yang sudah dikerjakan setiap hari', icon: CalendarCheck },
              { step: 3, title: 'Kumpulkan Poin', desc: 'Setiap ibadah memiliki poin. Kumpulkan sebanyak mungkin!', icon: Star },
              { step: 4, title: 'Pantau Progress', desc: 'Lihat kalender dan leaderboard untuk melihat kemajuan', icon: Trophy },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="flex gap-4 items-start bg-white rounded-2xl p-5 shadow-soft border border-slate-100 card-hover">
                  <div className="w-12 h-12 flex-shrink-0 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Point System */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden gradient-primary rounded-3xl p-8 md:p-12 text-white">
            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Sistem Poin
                </h2>
                <p className="text-white/80">
                  Raih poin dari setiap ibadah yang kamu lakukan
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Moon, label: 'Puasa', points: '50 poin' },
                  { icon: Star, label: 'Sholat Tarawih', points: '20 poin' },
                  { icon: Sparkles, label: 'Sholat Wajib', points: '10 poin/waktu' },
                  { icon: Heart, label: 'Sedekah', points: '10 poin' },
                  { icon: BookOpen, label: 'Tadarus', points: '2 poin/halaman' },
                  { icon: Flame, label: 'Sholat Sunnah', points: '5 poin' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.label}</p>
                      </div>
                      <span className="text-amber-300 font-bold">{item.points}</span>
                    </div>
                  )
                })}
              </div>
              
              <p className="text-center mt-8 text-white/90 text-sm">
                + Bonus badge untuk pencapaian tertentu!
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Siap memaksimalkan Ramadhan bersama keluarga?
          </h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Daftar sekarang dan mulai perjalanan ibadah yang lebih bermakna.
          </p>
          <a
            href="/auth/login"
            className="group inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white font-bold rounded-2xl transition-all hover:shadow-glow-lg hover:scale-105"
          >
            Mulai Sekarang
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Moon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-700">AmalKu</span>
          </div>
          <p className="text-sm text-slate-500">
            Dibuat dengan penuh cinta untuk keluarga Muslim Indonesia
          </p>
        </div>
      </footer>
    </div>
  )
}
