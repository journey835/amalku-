import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, date, ...ibadahData } = body

    // Verify user can only save their own data
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if entry exists
    const { data: existing } = await supabase
      .from('ibadah_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    let result

    if (existing) {
      // Update existing entry
      result = await supabase
        .from('ibadah_entries')
        .update({
          ...ibadahData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      // Insert new entry
      result = await supabase
        .from('ibadah_entries')
        .insert({
          user_id: userId,
          date,
          ...ibadahData,
        })
        .select()
        .single()
    }

    if (result.error) throw result.error

    // Update streak
    await updateStreak(supabase, userId, date)

    // Check and award badges
    await checkBadges(supabase, userId, ibadahData.total_points)

    return NextResponse.json({ success: true, data: result.data })
  } catch (error: any) {
    console.error('Error saving ibadah:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

async function updateStreak(supabase: any, userId: string, date: string) {
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  const today = new Date(date)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (!streak) {
    // Create new streak
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_ibadah_date: date,
    })
  } else {
    // Update streak
    let newStreak = 1
    if (streak.last_ibadah_date === yesterdayStr) {
      newStreak = streak.current_streak + 1
    }

    const longestStreak = Math.max(newStreak, streak.longest_streak)

    await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_ibadah_date: date,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
  }
}

async function checkBadges(supabase: any, userId: string, points: number) {
  // Check for perfect day badge (135+ points)
  if (points >= 135) {
    const { data: existing } = await supabase
      .from('badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_type', 'perfect_day')
      .single()

    if (!existing) {
      await supabase.from('badges').insert({
        user_id: userId,
        badge_type: 'perfect_day',
        badge_name: 'Hari Sempurna 💯',
      })
    }
  }

  // Check for streak badges
  const { data: streak } = await supabase
    .from('streaks')
    .select('current_streak')
    .eq('user_id', userId)
    .single()

  if (streak) {
    const streakMilestones = [7, 14, 21, 30]
    for (const milestone of streakMilestones) {
      if (streak.current_streak === milestone) {
        const badgeType = `streak_${milestone}`
        const { data: existing } = await supabase
          .from('badges')
          .select('id')
          .eq('user_id', userId)
          .eq('badge_type', badgeType)
          .single()

        if (!existing) {
          await supabase.from('badges').insert({
            user_id: userId,
            badge_type: badgeType,
            badge_name: `${milestone} Hari Streak 🔥`,
          })
        }
      }
    }
  }
}
