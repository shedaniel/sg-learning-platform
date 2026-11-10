package app.sgstudy.logic

data class ReviewSchedule(val intervalDays: Double, val ease: Double, val reps: Int, val lapses: Int)

/**
 * SM-2 style scheduling, identical to the web app.
 * grade: 0 = wrong (lapse), 1 = hard, 2 = good, 3 = easy.
 */
fun nextSchedule(existing: ReviewSchedule?, grade: Int): ReviewSchedule {
    val prev = existing ?: ReviewSchedule(0.0, 2.5, 0, 0)
    var ease = prev.ease
    var interval = prev.intervalDays
    var reps = prev.reps
    var lapses = prev.lapses
    when (grade) {
        0 -> { lapses += 1; reps = 0; ease = maxOf(1.3, ease - 0.2); interval = 0.0 }
        1 -> { ease = maxOf(1.3, ease - 0.15); interval = if (interval <= 0) 1.0 else maxOf(1.0, interval * 1.2); reps = minOf(reps + 1, 3) }
        2 -> { interval = if (interval <= 0) 1.0 else interval * ease; reps = minOf(reps + 1, 3) }
        else -> { ease = minOf(3.0, ease + 0.15); interval = if (interval <= 0) 2.0 else interval * ease * 1.3; reps = minOf(reps + 1, 3) }
    }
    return ReviewSchedule(
        intervalDays = minOf(180.0, Math.round(interval * 10) / 10.0),
        ease = Math.round(ease * 100) / 100.0,
        reps = reps,
        lapses = lapses,
    )
}
