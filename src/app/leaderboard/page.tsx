import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Calendar, 
  Target, 
  Award,
  ChevronUp,
  Sparkles,
  TrendingUp
} from 'lucide-react'

export default async function LeaderboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  // Get all entries for this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  const startOfMonthStr = startOfMonth.toISOString().split('T')[0]

  const { data: allEntries } = await supabase
    .from('ibadah_entries')
    .select('*')
    .gte('date', startOfMonthStr)

  // Get all streaks
  const { data: streaks } = await supabase
    .from('streaks')
    .select('*')

  // Get all badges
  const { data: badges } = await supabase
    .from('badges')
    .select('*')

  // Calculate leaderboard data
  const leaderboardData = profiles?.map((profile: any) => {
    const userEntries = allEntries?.filter(e => e.user_id === profile.id) || []
    const totalPoints = userEntries.reduce((sum, e) => sum + (e.total_points || 0), 0)
    const daysCompleted = userEntries.length
    const avgPoints = daysCompleted > 0 ? Math.round(totalPoints / daysCompleted) : 0
    
    const userStreak = streaks?.find(s => s.user_id === profile.id)
    const currentStreak = userStreak?.current_streak || 0
    
    const userBadges = badges?.filter(b => b.user_id === profile.id) || []
    const badgeCount = userBadges.length

    return {
      ...profile,
      totalPoints,
      daysCompleted,
      avgPoints,
      currentStreak,
      badgeCount,
      userBadges,
    }
  }).sort((a, b) => b.totalPoints - a.totalPoints) || []

  // User's rank
  const userRank = leaderboardData.findIndex(item => item.id === user.id) + 1
  const userStats = leaderboardData.find(item => item.id === user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <Navbar userName={currentProfile?.name} />
      
      {/* Header */}
      <div className="pt-36 md:pt-24 pb-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-warm p-6 md:p-8 text-white">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
                  <p className="text-white/80">
                    {startOfMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-3">
                <div className="text-center">
                  <p className="text-xs text-white/70">Peringkatmu</p>
                  <p className="text-3xl font-bold">#{userRank}</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-xs text-white/70">Total Poin</p>
                  <p className="text-2xl font-bold">{userStats?.totalPoints || 0}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 pb-32">
        {/* Top 3 Podium */}
        {leaderboardData.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8 items-end">
            {/* 2nd Place */}
            <div className="text-center group">
              <div className="bg-gradient-to-b from-slate-200 to-slate-300 rounded-t-2xl p-4 pt-6 transition-transform group-hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
                <div className="relative">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
                    <Medal className="w-7 h-7 text-slate-500" />
                  </div>
                  <p className="font-bold text-slate-700 truncate">{leaderboardData[1].name}</p>
                  <p className="text-2xl font-bold text-slate-600 mt-1">{leaderboardData[1].totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">poin</p>
                </div>
              </div>
              <div className="bg-slate-400 rounded-b-xl py-2 text-white font-bold shadow-lg">
                <span className="flex items-center justify-center gap-1">
                  <span>#2</span>
                </span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center group">
              <div className="bg-gradient-to-b from-amber-300 to-amber-400 rounded-t-2xl p-4 pt-8 pb-6 transition-transform group-hover:scale-105 relative overflow-hidden shadow-glow">
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/30" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                  <Sparkles className="w-5 h-5 text-yellow-600 animate-pulse" />
                </div>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-2 ring-4 ring-amber-200">
                    <Crown className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="font-bold text-amber-900 text-lg truncate">{leaderboardData[0].name}</p>
                  <p className="text-3xl font-bold text-amber-800 mt-1">{leaderboardData[0].totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-amber-700">poin</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-b-xl py-2.5 text-white font-bold shadow-lg">
                <span className="flex items-center justify-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span>#1</span>
                </span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center group">
              <div className="bg-gradient-to-b from-orange-200 to-orange-300 rounded-t-2xl p-4 pt-5 transition-transform group-hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
                <div className="relative">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-orange-500" />
                  </div>
                  <p className="font-bold text-orange-800 truncate">{leaderboardData[2].name}</p>
                  <p className="text-xl font-bold text-orange-700 mt-1">{leaderboardData[2].totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-orange-600">poin</p>
                </div>
              </div>
              <div className="bg-orange-400 rounded-b-xl py-2 text-white font-bold shadow-lg">
                <span className="flex items-center justify-center gap-1">
                  <span>#3</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Semua Anggota</h2>
                <p className="text-sm text-slate-500">{leaderboardData.length} anggota keluarga</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-50">
            {leaderboardData.map((member: any, idx: number) => {
              const isCurrentUser = member.id === user.id
              const rankColors = ['text-amber-500', 'text-slate-400', 'text-orange-400']
              
              return (
                <div
                  key={member.id}
                  className={`flex items-center gap-4 p-4 md:p-5 transition-all ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 border-l-4 border-primary-500' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex flex-col items-center min-w-[48px]">
                    {idx < 3 ? (
                      <div className={`text-2xl ${rankColors[idx]}`}>
                        {idx === 0 ? <Crown className="w-7 h-7" /> : idx === 1 ? <Medal className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-400">#{idx + 1}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-800 truncate">{member.name}</p>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 gradient-primary text-white text-xs rounded-full font-medium">
                          Kamu
                        </span>
                      )}
                      {member.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {member.daysCompleted}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Target className="w-3 h-3" /> {member.avgPoints}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" /> {member.currentStreak}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" /> {member.badgeCount}
                      </span>
                    </div>
                    
                    {/* Badges */}
                    {member.userBadges.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {member.userBadges.slice(0, 3).map((badge: any) => (
                          <span
                            key={badge.id}
                            className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full font-medium"
                          >
                            {badge.badge_name}
                          </span>
                        ))}
                        {member.userBadges.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                            +{member.userBadges.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Points */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-gradient">{member.totalPoints.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">poin</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivational Card */}
        <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 border border-emerald-100 rounded-2xl p-6 text-center">
          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-white flex items-center justify-center mb-4 shadow-lg">
              <ChevronUp className="w-7 h-7" />
            </div>
            <p className="text-xl font-bold text-slate-800 mb-2">
              Tetap Semangat!
            </p>
            <p className="text-slate-600 max-w-md mx-auto">
              Kompetisi yang sehat membuat kita semakin baik. 
              Mari berlomba-lomba dalam kebaikan!
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-200/30 rounded-full blur-2xl" />
        </div>
      </main>
    </div>
  )
}
