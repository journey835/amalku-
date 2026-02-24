import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { 
  Star, 
  Flame, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  CalendarCheck,
  TrendingUp,
  Trophy,
  Sparkles
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get total points this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  const startOfMonthStr = startOfMonth.toISOString().split('T')[0]

  const { data: entries } = await supabase
    .from('ibadah_entries')
    .select('total_points')
    .eq('user_id', user.id)
    .gte('date', startOfMonthStr)

  const totalPoints = entries?.reduce((sum, entry) => sum + (entry.total_points || 0), 0) || 0

  // Get current streak
  const { data: streak } = await supabase
    .from('streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .single()

  // Get badges count
  const { data: badges, count: badgeCount } = await supabase
    .from('badges')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)

  // Get today's entry
  const today = new Date().toISOString().split('T')[0]
  const { data: todayEntry } = await supabase
    .from('ibadah_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  // Get all family members' points this month
  const { data: allEntries } = await supabase
    .from('ibadah_entries')
    .select('user_id, total_points, profiles(name)')
    .gte('date', startOfMonthStr)

  // Group by user and sum points
  const userPoints = allEntries?.reduce((acc: any, entry: any) => {
    const userId = entry.user_id
    if (!acc[userId]) {
      acc[userId] = {
        name: entry.profiles?.name || 'Unknown',
        points: 0
      }
    }
    acc[userId].points += entry.total_points || 0
    return acc
  }, {})

  const leaderboard = Object.values(userPoints || {})
    .sort((a: any, b: any) => b.points - a.points)
    .slice(0, 5)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Selamat Pagi' : currentHour < 18 ? 'Selamat Siang' : 'Selamat Malam'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Navbar userName={profile?.name} />
      
      {/* Main Content */}
      <main className="pt-36 md:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{greeting}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Halo, <span className="text-gradient">{profile?.name || 'User'}</span>! 
          </h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Today's Status Card */}
        {todayEntry ? (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg card-hover">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-lg">Alhamdulillah, sudah input hari ini!</p>
                  <p className="text-emerald-100">Kamu mendapat <span className="font-bold text-white">{todayEntry.total_points} poin</span></p>
                </div>
              </div>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-md"
              >
                Edit Data
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg card-hover animate-pulse-slow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-lg">Yuk, catat ibadahmu hari ini!</p>
                  <p className="text-amber-100">Jangan sampai terlewat ya</p>
                </div>
              </div>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-all shadow-md"
              >
                Input Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <div className="group p-6 rounded-2xl bg-white shadow-soft card-hover border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">Bulan Ini</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Poin</p>
            <p className="text-4xl font-bold text-slate-800">{totalPoints.toLocaleString()}</p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalPoints / 3000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="group p-6 rounded-2xl bg-white shadow-soft card-hover border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Streak</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Hari Berturut</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-800">{streak?.current_streak || 0}</p>
              <span className="text-slate-400">hari</span>
            </div>
            {(streak?.current_streak || 0) >= 7 && (
              <p className="mt-3 text-xs text-amber-600 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3" /> On Fire! Pertahankan!
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="group p-6 rounded-2xl bg-white shadow-soft card-hover border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Collected</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Badge Diraih</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-800">{badgeCount || 0}</p>
              <span className="text-slate-400">badge</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {(badgeCount || 0) === 0 ? 'Raih badge pertamamu!' : 'Terus kumpulkan!'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/tracker" className="group p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary-300 hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 mb-1">Input Ibadah</p>
              <p className="text-sm text-slate-500">Catat ibadah hari ini</p>
            </Link>

            <Link href="/progress" className="group p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-cyan-300 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 mb-1">Lihat Progress</p>
              <p className="text-sm text-slate-500">Kalender 30 hari</p>
            </Link>

            <Link href="/leaderboard" className="group p-5 rounded-2xl bg-white border-2 border-slate-100 hover:border-amber-300 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 mb-1">Leaderboard</p>
              <p className="text-sm text-slate-500">Ranking keluarga</p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard Preview */}
          <div className="p-6 rounded-2xl bg-white shadow-soft border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Keluarga
              </h2>
              <Link href="/leaderboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                      idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                      idx === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-600' :
                      'bg-slate-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{item.points}</p>
                      <p className="text-xs text-slate-400">poin</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Belum ada data</p>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="p-6 rounded-2xl bg-white shadow-soft border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-emerald-500" />
              Badge Collection
            </h2>
            {badges && badges.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {badges.map((badge: any) => (
                  <div
                    key={badge.id}
                    className="px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold shadow-glow animate-float"
                    style={{ animationDelay: `${Math.random() * 2}s` }}
                  >
                    {badge.badge_name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="mb-2">Belum ada badge</p>
                <p className="text-xs">Kumpulkan 135+ poin dalam sehari untuk badge pertamamu!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
