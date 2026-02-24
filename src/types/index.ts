export interface User {
  id: string
  email: string
  name: string
  family_id?: string
  created_at: string
  updated_at: string
}

export interface Family {
  id: string
  name: string
  invite_code: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  user_id: string
  role: 'parent' | 'child'
  joined_at: string
}

export interface IbadahEntry {
  id: string
  user_id: string
  date: string
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
  sedekah_amount?: number
  dzikir_pagi: boolean
  dzikir_petang: boolean
  rawatib: boolean
  total_points: number
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  user_id: string
  badge_type: string
  badge_name: string
  earned_at: string
}

export interface Streak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_ibadah_date: string
}

export type IbadahType = 
  | 'puasa' 
  | 'subuh' 
  | 'dzuhur' 
  | 'ashar' 
  | 'maghrib' 
  | 'isya' 
  | 'tarawih' 
  | 'witir' 
  | 'dhuha' 
  | 'tadarus' 
  | 'sedekah' 
  | 'dzikir_pagi' 
  | 'dzikir_petang' 
  | 'rawatib'

export const IBADAH_POINTS: Record<IbadahType, number> = {
  puasa: 50,
  subuh: 10,
  dzuhur: 10,
  ashar: 10,
  maghrib: 10,
  isya: 10,
  tarawih: 20,
  witir: 10,
  dhuha: 10,
  tadarus: 2, // per halaman
  sedekah: 15,
  dzikir_pagi: 5,
  dzikir_petang: 5,
  rawatib: 5,
}
