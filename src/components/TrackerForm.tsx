'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Moon, 
  Check, 
  BookOpen, 
  Heart, 
  Sparkles,
  Save,
  Loader2,
  Star,
  Sun,
  Sunset,
  CloudSun,
  MoonStar,
  Coins
} from 'lucide-react'

interface IbadahEntry {
  puasa: boolean
  subuh: boolean
  dzuhur: boolean
  ashar: boolean
  maghrib: boolean
  isya: boolean
  tarawih: boolean
  witir: boolean
  dhuha: boolean
  tadarus_pages: number
  sedekah: boolean
  sedekah_amount: number
  dzikir_pagi: boolean
  dzikir_petang: boolean
  rawatib: boolean
}

interface TrackerFormProps {
  userId: string
  initialData?: any
  date: string
}

export default function TrackerForm({ userId, initialData, date }: TrackerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [data, setData] = useState<IbadahEntry>({
    puasa: initialData?.puasa || false,
    subuh: initialData?.subuh || false,
    dzuhur: initialData?.dzuhur || false,
    ashar: initialData?.ashar || false,
    maghrib: initialData?.maghrib || false,
    isya: initialData?.isya || false,
    tarawih: initialData?.tarawih || false,
    witir: initialData?.witir || false,
    dhuha: initialData?.dhuha || false,
    tadarus_pages: initialData?.tadarus_pages || 0,
    sedekah: initialData?.sedekah || false,
    sedekah_amount: initialData?.sedekah_amount || 0,
    dzikir_pagi: initialData?.dzikir_pagi || false,
    dzikir_petang: initialData?.dzikir_petang || false,
    rawatib: initialData?.rawatib || false,
  })

  const toggleCheck = (field: keyof IbadahEntry) => {
    if (typeof data[field] === 'boolean') {
      setData({ ...data, [field]: !data[field] })
    }
  }

  const calculatePoints = () => {
    let points = 0
    if (data.puasa) points += 50
    if (data.subuh) points += 10
    if (data.dzuhur) points += 10
    if (data.ashar) points += 10
    if (data.maghrib) points += 10
    if (data.isya) points += 10
    if (data.tarawih) points += 20
    if (data.witir) points += 5
    if (data.dhuha) points += 5
    points += data.tadarus_pages * 2
    if (data.sedekah) points += 10
    if (data.dzikir_pagi) points += 3
    if (data.dzikir_petang) points += 3
    if (data.rawatib) points += 5
    return points
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const totalPoints = calculatePoints()
      
      const response = await fetch('/api/ibadah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date,
          ...data,
          total_points: totalPoints,
        }),
      })

      if (!response.ok) throw new Error('Gagal menyimpan data')

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan')
    } finally {
      setLoading(false)
    }
  }

  const sholatWajib = [
    { key: 'subuh', label: 'Subuh', icon: Sun, time: '04:30' },
    { key: 'dzuhur', label: 'Dzuhur', icon: CloudSun, time: '12:00' },
    { key: 'ashar', label: 'Ashar', icon: Sunset, time: '15:00' },
    { key: 'maghrib', label: 'Maghrib', icon: MoonStar, time: '18:00' },
    { key: 'isya', label: 'Isya', icon: Moon, time: '19:00' },
  ]

  const sholatSunnah = [
    { key: 'tarawih', label: 'Tarawih', points: 20, desc: '8-20 rakaat' },
    { key: 'witir', label: 'Witir', points: 5, desc: '1-11 rakaat' },
    { key: 'dhuha', label: 'Dhuha', points: 5, desc: '2-12 rakaat' },
    { key: 'rawatib', label: 'Rawatib', points: 5, desc: 'Qabliyah/Ba\'diyah' },
  ]

  const totalPoints = calculatePoints()
  const maxPoints = 151
  const percentage = Math.min((totalPoints / maxPoints) * 100, 100)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold">Alhamdulillah! Data berhasil disimpan</p>
            <p className="text-emerald-100 text-sm">Kamu dapat {totalPoints} poin hari ini</p>
          </div>
        </div>
      )}

      {/* Puasa - Hero Card */}
      <div 
        onClick={() => toggleCheck('puasa')}
        className={`relative overflow-hidden p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
          data.puasa 
            ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow' 
            : 'bg-slate-100 hover:bg-slate-200'
        }`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              data.puasa ? 'bg-white/20' : 'bg-white shadow-sm'
            }`}>
              <Moon className={`w-7 h-7 ${data.puasa ? 'text-white' : 'text-primary-500'}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${data.puasa ? 'text-white' : 'text-slate-800'}`}>
                Puasa Ramadhan
              </h3>
              <p className={`text-sm ${data.puasa ? 'text-white/80' : 'text-slate-500'}`}>
                Ibadah wajib utama Ramadhan
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              data.puasa ? 'bg-white text-primary-500' : 'bg-slate-200'
            }`}>
              {data.puasa && <Check className="w-5 h-5" />}
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
              data.puasa ? 'bg-white/20' : 'bg-amber-100 text-amber-600'
            }`}>
              +50 poin
            </span>
          </div>
        </div>
        {data.puasa && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InN0YXIiIHg9IjAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTMwIDVsMi41IDcuNWg3LjVsLTYgNC41IDIuNSA3LjUtNi41LTQuNS02LjUgNC41IDIuNS03LjUtNiA0LjVoNy41eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3N0YXIpIi8+PC9zdmc+')] opacity-50" />
        )}
      </div>

      {/* Sholat Wajib */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800">Sholat Wajib</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">10 poin/sholat</span>
        </div>
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {sholatWajib.map((item) => {
            const Icon = item.icon
            const isChecked = data[item.key as keyof IbadahEntry] as boolean
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleCheck(item.key as keyof IbadahEntry)}
                className={`relative p-3 md:p-4 rounded-xl transition-all duration-200 ${
                  isChecked 
                    ? 'bg-emerald-500 text-white shadow-md scale-105' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                {isChecked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${([data.subuh, data.dzuhur, data.ashar, data.maghrib, data.isya].filter(Boolean).length / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            {[data.subuh, data.dzuhur, data.ashar, data.maghrib, data.isya].filter(Boolean).length}/5
          </span>
        </div>
      </div>

      {/* Sholat Sunnah */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Star className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800">Sholat Sunnah</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sholatSunnah.map((item) => {
            const isChecked = data[item.key as keyof IbadahEntry] as boolean
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleCheck(item.key as keyof IbadahEntry)}
                className={`p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                  isChecked 
                    ? 'bg-amber-50 border-amber-400 shadow-md' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${isChecked ? 'text-amber-700' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isChecked ? 'bg-amber-500 text-white' : 'bg-slate-100'
                  }`}>
                    {isChecked && <Check className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-xs text-slate-400">{item.desc}</p>
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                  isChecked ? 'bg-amber-200 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  +{item.points} poin
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tadarus */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Tadarus Al-Quran</h3>
            <p className="text-xs text-slate-500">2 poin per halaman</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-sm">
            <button
              type="button"
              onClick={() => setData({ ...data, tadarus_pages: Math.max(0, data.tadarus_pages - 1) })}
              className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition"
            >
              -
            </button>
            <input
              type="number"
              value={data.tadarus_pages}
              onChange={(e) => setData({ ...data, tadarus_pages: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-16 text-center text-2xl font-bold text-slate-800 bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => setData({ ...data, tadarus_pages: data.tadarus_pages + 1 })}
              className="w-10 h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-xl font-bold text-white transition"
            >
              +
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600">halaman</p>
            <p className="text-lg font-bold text-cyan-600">= {data.tadarus_pages * 2} poin</p>
          </div>
        </div>
      </div>

      {/* Dzikir */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800">Dzikir Harian</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">3 poin</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'dzikir_pagi', label: 'Dzikir Pagi', icon: Sun },
            { key: 'dzikir_petang', label: 'Dzikir Petang', icon: Sunset },
          ].map((item) => {
            const Icon = item.icon
            const isChecked = data[item.key as keyof IbadahEntry] as boolean
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleCheck(item.key as keyof IbadahEntry)}
                className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-200 border-2 ${
                  isChecked 
                    ? 'bg-purple-50 border-purple-400' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isChecked ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-semibold ${isChecked ? 'text-purple-700' : 'text-slate-600'}`}>
                  {item.label}
                </span>
                {isChecked && (
                  <Check className="w-5 h-5 text-purple-500 ml-auto" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sedekah */}
      <div 
        onClick={() => !data.sedekah && toggleCheck('sedekah')}
        className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer border-2 ${
          data.sedekah 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
            : 'bg-white border-slate-100 hover:border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              data.sedekah ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold ${data.sedekah ? 'text-green-700' : 'text-slate-700'}`}>Sedekah</h3>
              <p className="text-xs text-slate-500">Berbagi kebaikan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              data.sedekah ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}>
              +10 poin
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleCheck('sedekah')
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                data.sedekah ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {data.sedekah && <Check className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {data.sedekah && (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              type="number"
              value={data.sedekah_amount || ''}
              onChange={(e) => setData({ ...data, sedekah_amount: parseFloat(e.target.value) || 0 })}
              placeholder="Jumlah sedekah (opsional)"
              className="w-full px-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        )}
      </div>

      {/* Total Points Card */}
      <div className="sticky bottom-4 p-5 rounded-2xl gradient-primary text-white shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Total Poin Hari Ini</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{totalPoints}</p>
              <span className="text-white/60">/ {maxPoints}</span>
            </div>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${percentage * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{Math.round(percentage)}%</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {totalPoints >= 135 && (
            <p className="text-center text-sm mt-3 text-white/90 font-medium">
              🎉 Amazing! Kamu dapat badge Hari Sempurna!
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || success}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          loading || success
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'gradient-primary text-white hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Menyimpan...
          </>
        ) : success ? (
          <>
            <Check className="w-5 h-5" />
            Tersimpan!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            {initialData ? 'Update Data' : 'Simpan Data'}
          </>
        )}
      </button>
    </form>
  )
}
