import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Flame, 
  Star,
  Moon,
  BookOpen,
  ChevronRight
} from 'lucide-react'

export default async function ProgressPage() {
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

  // Get all entries for this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  const startOfMonthStr = startOfMonth.toISOString().split('T')[0]

  const { data: entries } = await supabase
    .from('ibadah_entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startOfMonthStr)
    .order('date', { ascending: true })

  // Create calendar data for this month
  const daysInMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getDate()
  const calendarDays = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), day)
    const dateStr = date.toISOString().split('T')[0]
    const entry = entries?.find(e => e.date === dateStr)
    
    calendarDays.push({
      date: dateStr,
      day,
      entry,
      isFuture: date > new Date(),
    })
  }

  // Calculate stats
  const totalPoints = entries?.reduce((sum, e) => sum + (e.total_points || 0), 0) || 0
  const avgPoints = entries && entries.length > 0 ? Math.round(totalPoints / entries.length) : 0
  const daysCompleted = entries?.length || 0

  // Calculate streak
  let currentStreak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    const hasEntry = entries?.find(e => e.date === dateStr)
    if (hasEntry) {
      currentStreak++
    } else if (i > 0) {
      break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Navbar userName={profile?.name} />
      
      {/* Header */}
      <div className="pt-36 md:pt-24 pb-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-cool p-6 md:p-8 text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Progress Ramadhan</h1>
                  <p className="text-white/80">Pantau perjalanan ibadahmu</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 pb-32">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-soft card-hover">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3">
              <Star className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Poin</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{totalPoints.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-soft card-hover">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Rata-rata/Hari</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{avgPoints}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-soft card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Hari Selesai</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{daysCompleted}<span className="text-lg text-slate-400">/{daysInMonth}</span></p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-soft card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500 mb-1">Streak</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{currentStreak} <span className="text-lg text-slate-400">hari</span></p>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8">
          <div className="p-5 md:p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Kalender Ibadah</h2>
                  <p className="text-sm text-slate-500">
                    {startOfMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((dayData) => {
                const points = dayData.entry?.total_points || 0
                let bgStyle = 'bg-slate-50 text-slate-400'
                let ringStyle = ''
                
                if (dayData.isFuture) {
                  bgStyle = 'bg-slate-50/50 text-slate-300'
                } else if (dayData.entry) {
                  if (points >= 120) {
                    bgStyle = 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md'
                  } else if (points >= 80) {
                    bgStyle = 'bg-gradient-to-br from-emerald-200 to-emerald-300 text-emerald-800'
                  } else if (points >= 40) {
                    bgStyle = 'bg-gradient-to-br from-amber-200 to-amber-300 text-amber-800'
                  } else {
                    bgStyle = 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800'
                  }
                } else {
                  bgStyle = 'bg-red-50 text-red-400 border-2 border-dashed border-red-200'
                }

                const isToday = dayData.date === new Date().toISOString().split('T')[0]
                if (isToday) {
                  ringStyle = 'ring-2 ring-primary-500 ring-offset-2'
                }

                return (
                  <div
                    key={dayData.date}
                    className={`${bgStyle} ${ringStyle} rounded-xl p-1.5 md:p-2 aspect-square flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer relative group`}
                  >
                    <div className="text-xs md:text-sm font-bold">{dayData.day}</div>
                    {dayData.entry && (
                      <div className="text-[10px] md:text-xs font-medium opacity-80 hidden md:block">
                        {points}
                      </div>
                    )}
                    
                    {/* Tooltip */}
                    {dayData.entry && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="font-bold">{points} poin</div>
                        <div className="text-slate-300">
                          {new Date(dayData.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3 justify-center">
              {[
                { color: 'from-emerald-400 to-emerald-500', label: '120+', desc: 'Sempurna' },
                { color: 'from-emerald-200 to-emerald-300', label: '80-119', desc: 'Baik' },
                { color: 'from-amber-200 to-amber-300', label: '40-79', desc: 'Cukup' },
                { color: 'from-orange-200 to-orange-300', label: '1-39', desc: 'Kurang' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${item.color}`}></div>
                  <span className="text-xs text-slate-600">
                    <span className="font-semibold">{item.label}</span> {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        {entries && entries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-5 md:p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Riwayat Terbaru</h2>
                  <p className="text-sm text-slate-500">7 hari terakhir</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {entries.slice(-7).reverse().map((entry: any) => (
                <div key={entry.id} className="p-4 md:p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {new Date(entry.date).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {entry.puasa && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">
                            <Moon className="w-3 h-3" /> Puasa
                          </span>
                        )}
                        {entry.subuh && entry.dzuhur && entry.ashar && entry.maghrib && entry.isya && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                            <Star className="w-3 h-3" /> 5 Waktu
                          </span>
                        )}
                        {entry.tadarus_pages > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full font-medium">
                            <BookOpen className="w-3 h-3" /> {entry.tadarus_pages} hal
                          </span>
                        )}
                        {entry.tarawih && (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                            Tarawih
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gradient">{entry.total_points}</p>
                        <p className="text-xs text-slate-400">poin</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
