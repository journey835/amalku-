import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { 
  BookOpen, 
  Moon, 
  Sun, 
  UtensilsCrossed,
  Sparkles,
  Heart,
  Star,
  Clock
} from 'lucide-react'

const doaList = [
 
  {
    id: 'buka-puasa',
    category: 'Puasa',
    title: 'Doa Berbuka Puasa',
    arabic: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    latin: 'Dzahaba adh-dhamaau wabtallatil-urooq wa tsabata al-ajru in syaa Allah',
    arti: 'Telah hilang dahaga, urat-urat telah basah, dan pahala telah tetap, insya Allah',
    icon: UtensilsCrossed,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600'
  },

  {
    id: 'sebelum-makan',
    category: 'Harian',
    title: 'Doa Sebelum Makan',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
    latin: 'Bismillahir rahmanir rahiim',
    arti: 'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang',
    icon: UtensilsCrossed,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  },
  {
    id: 'sesudah-makan',
    category: 'Harian',
    title: 'Doa Sesudah Makan',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ',
    latin: 'Alhamdulillaahil ladzii ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin',
    arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang Muslim',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600'
  },
  {
    id: 'lailatul-qadr',
    category: 'Ramadhan',
    title: 'Doa Malam Lailatul Qadr',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    latin: 'Allahumma innaka \'afuwwun tuhibbul \'afwa fa\'fu \'annii',
    arti: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau mencintai ampunan, maka ampunilah aku',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600'
  },
  {
    id: 'setelah-witir',
    category: 'Sholat',
    title: 'Doa Setelah Witir',
    arabic: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ',
    latin: 'Subhana al-malik al-quddus',
    arti: 'Maha Suci Allah, Raja yang Maha Kudus',
    icon: Moon,
    color: 'from-slate-600 to-slate-800',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600'
  },
  {
    id: 'sebelum-tidur',
    category: 'Harian',
    title: 'Doa Sebelum Tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    latin: 'Bismika Allahumma amuutu wa ahyaa',
    arti: 'Dengan nama-Mu ya Allah, aku mati dan hidup',
    icon: Clock,
    color: 'from-blue-600 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'bangun-tidur',
    category: 'Harian',
    title: 'Doa Bangun Tidur',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdulillaahil ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin nusyuur',
    arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami kembali',
    icon: Sun,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  {
    id: 'mohon-ampunan',
    category: 'Ramadhan',
    title: 'Doa Mohon Ampunan',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي، وَتُبْ عَلَيَّ، إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيْمُ',
    latin: 'Allahumma ighfir lii, wa tub \'alayya, innaka anta at-tawwaabu ar-rahiim',
    arti: 'Ya Allah, ampunilah aku, dan terimalah taubatku, sesungguhnya Engkau Maha Penerima Taubat lagi Maha Penyayang',
    icon: Heart,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  },

  {
    id: 'qunut',
    category: 'Sholat',
    title: 'Doa Qunut',
    arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
    latin: 'Allahumma ihdinii fiiman hadait, wa \'aafinii fiiman \'aafait, wa tawallanii fiiman tawallait, wa baarik lii fiimaa a\'thait, wa qinii syarra maa qadhait, fa innaka taqdhii wa laa yuqdhii \'alaik, wa innahu laa yadzillu man waalait, wa laa ya\'izzu man aadait, tabaarakta rabbanaa wa ta\'alaait', 
    arti: 'Ya Allah, berilah aku petunjuk di antara orang-orang yang Engkau beri petunjuk, dan berilah aku keselamatan di antara orang-orang yang telah Engkau beri keselamatan, uruslah diriku di antara orang-orang yang telah Engkau urus, berkahilah untukku apa yang telah Engkau berikan kepadaku, lindungilah aku dari keburukan apa yang telah Engkau tetapkan, sesungguhnya Engkau Yang memutuskan dan tidak diputuskan kepadaku, sesungguhnya tidak akan hina orang yang telah Engkau jaga dan Engkau tolong (dan orang yang memusuhi Engkau tidak akan mulia). Engkau Maha Suci dan Maha Tinggi Engkau Rabb kami',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  }
]

export default async function DoaPage() {
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

  const categories = ['Puasa', 'Ramadhan', 'Sholat', 'Harian']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Navbar userName={profile?.name} />
      
      {/* Header */}
      <div className="pt-36 md:pt-24 pb-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 md:p-8 text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Doa Harian Ramadhan</h1>
                  <p className="text-white/80">Kumpulan doa-doa penting</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 pb-32">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <a 
            href="#semua"
            className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium whitespace-nowrap"
          >
            Semua
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="px-4 py-2 bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-full text-sm font-medium whitespace-nowrap transition-colors border border-slate-200"
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Doa Cards */}
        <div className="space-y-4">
          {doaList.map((doa) => {
            const Icon = doa.icon
            return (
              <div 
                key={doa.id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden card-hover border border-slate-100"
              >
                {/* Header */}
                <div className={`p-4 ${doa.bgColor} border-b border-slate-100`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${doa.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{doa.title}</h3>
                        <span className={`text-xs font-medium ${doa.textColor}`}>{doa.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Arabic */}
                  <div className="text-center py-4 px-6 bg-slate-50 rounded-xl">
                    <p className="text-2xl md:text-3xl leading-loose font-arabic text-slate-800" dir="rtl">
                      {doa.arabic}
                    </p>
                  </div>
                  
                  {/* Latin */}
                  <div>
                    <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Lafadz</p>
                    <p className="text-slate-600 italic">{doa.latin}</p>
                  </div>
                  
                  {/* Meaning */}
                  <div className={`p-4 rounded-xl ${doa.bgColor}`}>
                    <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Artinya</p>
                    <p className={`${doa.textColor} font-medium`}>{doa.arti}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
