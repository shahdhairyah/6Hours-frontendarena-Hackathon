import { fmtDate, fmtDateShort, fmtMonth } from './preprocess.js'

const q = (s) => `“${s}”`

const inHour = (r, lo, hi) => r.hour >= lo && r.hour < hi

const pick = (recs, pred) => recs.find(pred) || null

export function buildNarrative(receipts, chapters, stats, threads) {
  const first = receipts[0]
  const last = receipts[receipts.length - 1]

  // ---- prologue ----------------------------------------------------------
  const firstMessage = pick(receipts, (r) => r.type === 'message')
  const prologue = {
    opening: `This is the ledger of a life as told by its own paper trail. ${stats.total} small moments between ${fmtMonth(first.dt)} and ${fmtMonth(last.dt)} — a song at a certain hour, a receipt, a photograph, a sentence left in a note you never showed anyone.`,
    thesis: `Individually, a receipt is nothing. A coffee. A map search. A film watched alone at midnight. But laid side by side, in order, they stop being things you did and start being a person you were becoming. ${stats.nightRatio > 0.35 ? `Somewhere in this paper trail the hours went dark, and somewhere after that they came back again.` : `Somewhere in this paper trail a stranger appears, and slowly stops being one.`}`,
    beats: [first.id, last.id, firstMessage ? firstMessage.id : null].filter(Boolean),
  }

  // ---- chapter prose ------------------------------------------------------
  const chapterNarrative = chapters.map((ch, idx) => {
    const [p1, p2, p3] = chapterProse(ch, receipts, idx, stats)
    return { ...ch, paragraphs: [p1, p2, p3].filter(Boolean), beats: chapterBeats(ch) }
  })

  // ---- insights (the "what does it all mean" layer) -------------------------
  const insights = buildInsights(receipts, chapters, stats, threads)

  // ---- epilogue -----------------------------------------------------------
  const epilogue = {
    text: `The receipts end there — not because the life ends, but because the story has somewhere to go next. ${last.heading}. ${q(last.body)}`,
    beats: [last.id, ...(threads.moments[0]?.ids.slice(0, 3) || [])],
  }

  return { prologue, chapters: chapterNarrative, insights, epilogue }
}

// ---------------------------------------------------------------------------
function chapterProse(ch, _receipts, _idx, _stats) {
  const recs = ch.recs
  const force = (n) => String(n).toLocaleString('en-GB')

  const paras = []

  if (ch.theme === 'wander') {
    const flight = pick(recs, (r) => r.tags.includes('travel') && r.type === 'purchase')
    const fado = pick(recs, (r) => r.heading.includes('Fado'))
    paras.push(
      `It begins the way change usually does: with a search box. ${q(pick(recs, (r) => r.type === 'search')?.heading || '"…"')}, followed a month later by a receipt for a backpack. The chapter is composed in ${force(recs.length)} receipts — places stamping in from Lisbon, Porto and the Alps, photographs taken from windows and trams, purchases made in a currency you had to think about.`
    )
    paras.push(
      `You were not running away from a place. The receipts make that clear — they show someone carrying a version of themselves to new cities and setting it down to see if it could walk. ${flight ? `The earliest purchase in this chapter is ${q(flight.heading)}. It is, in hindsight, a perfect metaphor.` : ''}`
    )
    if (fado) paras.push(`Halfway through, ${q(fado.heading)}, you wrote a line that a whole chapter believes: ${q(pick(recs, (r) => r.type === 'note')?.body || '…')}`)
    return paras
  }

  if (ch.theme === 'night') {
    const twoAm = recs.filter((r) => inHour(r, 0, 4))
    const songsNight = twoAm.filter((r) => r.type === 'music')
    paras.push(
      `Somewhere in here the receipts change clothes. The hours between midnight and 4am — ${force(twoAm.length)} of the ${force(recs.length)} moments in this chapter — start keeping their own ledger. Songs arrive at 2am (${songsNight.length} of them). Films are chosen for being sad the right way. One note admits: ${q(pick(recs, (r) => r.body.includes('mug'))?.body || pick(recs, (r) => r.type === 'note')?.body || '…')}`
    )
    paras.push(
      `The searches track the tide: ${q('why can\'t i sleep')}, ${q('how long can insomnia last')}, ${q('name for the feeling of being homesick for a place you never left')}. Each one a small hand reaching out of the dark and leaving no address. The night ratio of this chapter is ${Math.round(ch.nightRatio * 100)}% — the highest of your whole recorded life.`
    )
    const turn = pick(recs, (r) => r.tags.includes('dawn-turn') || r.tags.includes('dawn'))
    if (turn) paras.push(`And then the turn — disguised as a purchase. ${q(turn.heading || turn.body)}. Receipts are honest about turning points because they have no sense of drama: one day you buy a sunrise alarm clock, and the story, quietly, changes its schedule.`)
    return paras
  }

  if (ch.theme === 'anchor') {
    const kiln = pick(recs, (r) => r.tags.includes('the-kiln'))
    paras.push(
      `Into the ledger walks ${q('from Maya')} — a message that begins with a festival and ends, eighteen receipts later, with two flat whites and a shared table. The data can't tell you how it felt. But it can tell you the shape of it: messages become a conversation, purchases become pairs (${recs.filter((r) => r.tags.includes('together') || r.tags.includes('pair')).length} of them), and the photographs start including ${q('hers')} in the caption.`
    )
    paras.push(
      `Look at the mood line: where the previous chapter sits low and watery, this one averages ${Math.round(ch.moodMean * 10) / 10} — climbing steadily through September to December. You stopped keeping the hours, the receipts suggest. A place called ${q('The Kiln')} starts appearing like a bookmark.${kiln ? ' The first of many.' : ''}`
    )
    paras.push(
      `The truest receipt is the one you don't frame as romance: the gift of a camera strap, bought mid-walk, ${q('dark green')}. Small torque on the lever of a life. By winter, ${q('Six months ago the nights were the only thing that stayed. Now I have a table at the Kiln that knows my order.')}`
    )
    return paras
  }

  if (ch.theme === 'maker') {
    const cam = pick(recs, (r) => r.tags.includes('camera'))
    const show = pick(recs, (r) => r.heading.includes('Opening night'))
    const note = pick(recs, (r) => r.tags.includes('idea'))
    paras.push(
      `The final chapter changes register the way a film does between acts: the dawn hours take over, and ${q('the making-hours')} begin to recur. ${note ? q(note.body) : 'The notes stop being laments and start being blueprints.'} ${cam ? `A second-hand camera appears as a receipt, then rolls of Portra, then a drying rack for prints.` : ''}`
    )
    paras.push(
      `The mansion of the story has multiple rooms, but this is the sentence you were building all along: ${q(ch.name)} applies to the things you make, not just the life you keep. ${force(recs.filter((r) => r.tags.includes('dawn')).length)} dawn receipts. ${force(recs.filter((r) => r.type === 'photo').length)} photographs. In ${ch.span}, ${show ? q(show.heading) : 'a showing'} happens, and a stranger buys the doorway.` +
        (note ? ` The note buried three weeks earlier: ${q(note.body)}.` : '')
    )
    paras.push(
      `And in the final leaf of the ledger, a callback: two tickets to Lisbon — the same place this whole story opened. Heading: ${q(pick(recs, (r) => r.tags.includes('callback'))?.heading || 'Two tickets — Lisbon')}. You left alone in February. You return for two.`
    )
    return paras
  }

  // transition / default
  paras.push(
    `A quieter stretch of the ledger — ${force(recs.length)} receipts across ${force(ch.days)} days. Less is recorded, more is decided. The dominant texture: ${ch.dominant.slice(0, 3).map(dom).join(', ')}.`
  )
  paras.push(`These are the months where the receipts thin out and the reasons thicken. Neither happy nor sad in the usual way — just a person assembling, the way a chapter assembles.`)
  return paras
}

function chapterBeats(ch) {
  if (ch.theme === 'wander') {
    return ch.recs.filter((r) => r.tags.includes('travel') || r.tags.includes('lisbon') || r.tags.includes('window') || r.type === 'event').slice(0, 5).map((r) => r.id)
  }
  if (ch.theme === 'night') {
    return ch.recs.filter((r) => inHour(r, 0, 4) || r.tags.includes('dawn')).slice(0, 5).map((r) => r.id)
  }
  if (ch.theme === 'anchor') {
    return ch.recs.filter((r) => r.tags.includes('maya') || r.tags.includes('the-kiln') || r.tags.includes('together')).slice(0, 5).map((r) => r.id)
  }
  if (ch.theme === 'maker') {
    return ch.recs.filter((r) => r.tags.includes('making') || r.tags.includes('show')).slice(0, 5).map((r) => r.id)
  }
  return ch.ids.slice(0, 5)
}

// ---------------------------------------------------------------------------
function buildInsights(receipts, chapters, stats, _threads) {
  const nightCh = chapters.find((c) => c.theme === 'night')
  const insight = (no, title, body, ids) => ({ no, title, body, ids: ids.slice(0, 6) })

  const out = []
  let no = 1

  // 1 — The 2am curve
  const rest = chapters.filter((c) => c.theme !== 'night')
  const nightDeep = nightCh ? nightCh.recs.filter((r) => inHour(r, 0, 4)) : []
  const restDeep = rest.flatMap((c) => c.recs).filter((r) => inHour(r, 0, 4))
  if (nightDeep.length) {
    out.push(
      insight(
        no++,
        'The 2 a.m. curve',
        `Between ${nightCh.span}, ${nightDeep.length} receipts were left between midnight and 4 a.m. — in the other ${rest.length} chapters of this life, combined, there are ${restDeep.length}. The dark was not where you lived. It was where something worked on you.`,
        nightDeep.map((r) => r.id)
      )
    )
  }

  // 2 — The longest silence
  if (stats.silence > 6) {
    const sorted = [...receipts].sort((a, b) => a.dt - b.dt)
    let start = null
    let end = null
    let best = 0
    for (let i = 1; i < sorted.length; i++) {
      const gap = (sorted[i].dt - sorted[i - 1].dt) / 86400000
      if (gap > best) {
        best = gap
        start = sorted[i - 1]
        end = sorted[i]
      }
    }
    out.push(
      insight(
        no++,
        'The quiet stretch',
        `The single longest time this ledger went silent was ${Math.round(best)} days — from ${fmtDate(start.dt)} to ${fmtDate(end.dt)}. Receipts are honest about absence too. Nothing was recorded. ${q('Robin messaged 4 days ago…')} suggests something was being avoided in the meantime.`,
        [start.id, end.id]
      )
    )
  }

  // 3 — The visitor effect
  const mayaMsg = receipts.find((r) => r.counterpart === 'Maya')
  if (mayaMsg) {
    const before = receipts.filter((r) => r.dt < mayaMsg.dt)
    const after = receipts.filter((r) => r.dt >= mayaMsg.dt)
    const beforeNight = before.filter((r) => r.isNight).length / before.length
    const afterNight = after.filter((r) => r.isNight).length / after.length
    out.push(
      insight(
        no++,
        'The person who changed the clock',
        `The first message from ${q('Maya')} lands Sep 1, 22:14. Before that moment, ${Math.round(beforeNight * 100)}% of your receipts came from the dark hours. After it: ${Math.round(afterNight * 100)}%. A life moved its schedule because someone was waiting in the daylight.`,
        [mayaMsg.id, ...receipts.filter((r) => r.counterpart === 'Maya').slice(-2).map((r) => r.id)]
      )
    )
  }

  // 4 — The Kiln, running theme
  const kilnIds = receipts.filter((r) => r.tags.includes('the-kiln') || (r.merchant || '').toLowerCase().includes('kiln')).map((r) => r.id)
  const firstKiln = receipts.find((r) => r.tags.includes('the-kiln'))
  if (kilnIds.length >= 3 && firstKiln) {
    out.push(
      insight(
        no++,
        'A place that started functioning as home',
        `${kilnIds.length} receipts share one address: ${q('The Kiln')}. First sighting ${fmtDateShort(firstKiln.dt)} as a single purchase — by the end, as two. Places stop being locations when you start having a table.`,
        kilnIds
      )
    )
  }

  // 5 — The two trips to Lisbon
  const lis = receipts.filter((r) => r.tags.includes('lisbon') || (r.tags || []).includes('callback'))
  if (lis.length) {
    const firstL = receipts.find((r) => r.tags.includes('lisbon'))
    const callbacks = receipts.filter((r) => r.tags.includes('callback')).sort((a, b) => a.dt - b.dt)
    const lastL = callbacks.filter((r) => r.type === 'purchase').pop() || callbacks.pop()
    if (firstL && lastL) {
      out.push(
        insight(
          no++,
          'Same city, different self',
          `Lisbon holds the opening and closing of this story. ${fmtDateShort(firstL.dt)}: a single ticket, a backpack, a question mark. ${fmtDateShort(lastL.dt)}: two tickets, and a note that finally answers it: ${q('Not to leave this time. To show her the tram.')}`,
          [firstL.id, lastL.id]
        )
      )
    }
  }

  // 6 — recurring artists tell a sub-story
  const artists = stats.artists.slice(0, 3)
  if (artists.length >= 2) {
    const top = artists[0]
    const topIds = receipts.filter((r) => r.artist === top.label).slice(0, 6).map((r) => r.id)
    out.push(
      insight(
        no++,
        'The artists you kept rerouting home',
        `Three names recur most: ${artists.map((a) => a.label).join(', ')}. Soundtracks are receipts for feelings that can't be photographed — and when the dark chapter bottomed out, ${top.label} appeared ${top.n} times${topIds.length ? '' : '. That is companionship of a desk, of a person.'}.`,
        topIds
      )
    )
  }

  return out
}