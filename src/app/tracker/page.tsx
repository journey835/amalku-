import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrackerForm from '@/components/TrackerForm'
import Navbar from '@/components/Navbar'
import { Calendar, Sparkles } from 'lucide-react'

export default async function TrackerPage() {
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

  // Get today's entry if exists
  const today = new Date().toISOString().split('T')[0]
  const { data: todayEntry } = await supabase
    .from('ibadah_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Navbar userName={profile?.name} />
      
      {/* Main Content */}
      <main className="pt-36 md:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="mb-6 p-6 rounded-2xl gradient-primary text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Input Harian</span>
              </div>
              <h1 className="text-2xl font-bold">Tracker Ibadah</h1>
              <p className="text-white/80 text-sm">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 md:p-8">
          <TrackerForm 
            userId={user.id}
            initialData={todayEntry}
            date={today}
          />
        </div>
      </main>
    </div>
  )
}
