import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Network,
  Sparkles,
  Zap,
  Users,
  Music,
  MapPin,
  Coffee,
  Moon,
  ChevronRight,
  Info,
  Maximize2,
  Filter
} from 'lucide-react'
import { TYPE_META, MOOD_META } from '../engine/types'
import { fmtDate, fmtDateShort, fmtTime } from '../utils/formatters'
import { sound } from '../audio/soundEngine'

export default function ConstellationView({
  receipts,
  chapters,
  threads,
  onSelectReceipt
}) {
  const [selectedClusterTheme, setSelectedClusterTheme] = useState('all')
  const [hoveredNode, setHoveredNode] = useState(null)
  const canvasRef = useRef(null)

  const filterThemes = [
    { id: 'all', label: 'All Life Filaments', icon: Sparkles, color: '#f59e0b' },
    { id: 'maya', label: 'Maya & Connection', icon: Users, color: '#fb7185' },
    { id: 'the-kiln', label: 'The Kiln Anchor', icon: Coffee, color: '#facc15' },
    { id: '2am-curve', label: 'The 2 AM Insomnia', icon: Moon, color: '#818cf8' },
    { id: 'music', label: 'Soundtracks & Vinyl', icon: Music, color: '#34d399' },
    { id: 'travel', label: 'Lisbon & Travel', icon: MapPin, color: '#38bdf8' },
  ]

  // Filter moments
  const filteredMoments = useMemo(() => {
    if (!threads.moments) return []
    if (selectedClusterTheme === 'all') return threads.moments.slice(0, 10)

    return threads.moments.filter((m) => {
      const recs = m.ids.map((id) => threads.byId.get(id)).filter(Boolean)
      if (selectedClusterTheme === 'maya') {
        return recs.some((r) => r.counterpart === 'Maya' || r.tags.includes('maya'))
      }
      if (selectedClusterTheme === 'the-kiln') {
        return recs.some((r) => r.tags.includes('the-kiln') || r.heading.includes('Kiln') || r.body.includes('Kiln'))
      }
      if (selectedClusterTheme === '2am-curve') {
        return recs.some((r) => r.isNight || r.tags.includes('2am-curve'))
      }
      if (selectedClusterTheme === 'music') {
        return recs.some((r) => r.type === 'music')
      }
      if (selectedClusterTheme === 'travel') {
        return recs.some((r) => r.city === 'Lisbon' || r.tags.includes('travel'))
      }
      return true
    })
  }, [threads, selectedClusterTheme])

  // Celestial Canvas Network
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const width = (canvas.width = canvas.parentElement.clientWidth)
    const height = (canvas.height = 460)

    // Select 50 representative nodes
    const sampleNodes = receipts.slice(0, 52).map((r, i) => {
      const angle = (i / 52) * Math.PI * 2
      const radius = 130 + ((i * 47) % 90)
      return {
        ...r,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * (radius * 0.7),
        baseX: width / 2 + Math.cos(angle) * radius,
        baseY: height / 2 + Math.sin(angle) * (radius * 0.7),
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.008,
      }
    })

    // Background cosmic dust particles
    const stars = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      alpha: 0.1 + Math.random() * 0.4,
    }))

    let t = 0
    const render = () => {
      t += 0.015
      ctx.clearRect(0, 0, width, height)

      // Draw starry background
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`
        ctx.fillRect(s.x, s.y, s.size, s.size)
      })

      // Radial central cosmic nebula
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 280)
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.06)')
      grad.addColorStop(0.4, 'rgba(244, 63, 94, 0.03)')
      grad.addColorStop(0.8, 'rgba(99, 102, 241, 0.02)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Update positions
      sampleNodes.forEach((node, i) => {
        node.x = node.baseX + Math.sin(t * node.speed * 40 + node.phase) * 8
        node.y = node.baseY + Math.cos(t * node.speed * 40 + node.phase) * 8
      })

      // Draw connection filaments
      ctx.lineWidth = 1
      for (let i = 0; i < sampleNodes.length; i++) {
        for (let j = i + 1; j < sampleNodes.length; j++) {
          const a = sampleNodes[i]
          const b = sampleNodes[j]
          const isConnected = threads.adjacency.get(a.id)?.some((edge) => edge.toId === b.id)

          if (isConnected || (Math.abs(i - j) <= 2 && Math.random() > 0.45)) {
            const isHighlighted = hoveredNode && (hoveredNode.id === a.id || hoveredNode.id === b.id)

            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = isHighlighted
              ? 'rgba(245, 158, 11, 0.85)'
              : 'rgba(129, 140, 248, 0.14)'
            ctx.lineWidth = isHighlighted ? 2 : 0.8
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      sampleNodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id
        const meta = TYPE_META[node.type] || { color: '#f59e0b' }

        // Glow halo
        if (isHovered) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, 14, 0, Math.PI * 2)
          ctx.fillStyle = `${meta.color}44`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, isHovered ? 6 : 3.5, 0, Math.PI * 2)
        ctx.fillStyle = meta.color
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animId)
  }, [receipts, threads, hoveredNode])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono-receipt text-[#f59e0b]">
          <Network className="w-3.5 h-3.5" />
          <span className="tracking-wider">CELESTIAL GRAPH & ECHO MATRIX</span>
        </div>

        <h1 className="font-serif-story text-3xl sm:text-5xl text-[#fbf9f5] font-normal tracking-tight">
          How Unrelated Fragments Connect To Form A Life
        </h1>

        <p className="font-sans-ui text-sm sm:text-base text-[#9da5b8] max-w-3xl leading-relaxed">
          A song played at 2 AM in January echoes with a photo taken in Lisbon in June. A message from Maya correlates with a sudden shift in sleep patterns. Explore both tight time clusters (moments happening minutes apart) and long-range emotional echoes.
        </p>

        {/* Filter Themes */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          {filterThemes.map((theme) => {
            const Icon = theme.icon
            const isSelected = selectedClusterTheme === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => {
                  sound.playTick(1200)
                  setSelectedClusterTheme(theme.id)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-mono-receipt border transition-all ${
                  isSelected
                    ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#fbf9f5] font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'border-white/[0.06] bg-[#0f1118] text-[#868d9f] hover:bg-[#151722] hover:text-[#d3d8e5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: theme.color }} />
                <span>{theme.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Celestial Graph Canvas */}
      <section className="rounded-3xl border border-white/[0.08] bg-[#07080c] p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 text-xs font-mono-receipt text-[#6f7688]">
          <span className="flex items-center gap-2 text-[#fbf9f5]">
            <Sparkles className="w-4 h-4 text-[#f59e0b]" />
            <span>INTERACTIVE LIFE CONSTELLATION (52 NODES & FILAMENTS)</span>
          </span>
          <span className="text-[11px] text-[#5b6375] hidden sm:inline">
            Hover nodes to spotlight cross-temporal filaments
          </span>
        </div>

        <div className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-[#06070a] border border-white/[0.05]">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Floating Graph Legend */}
          <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl bg-[#0a0b12]/90 backdrop-blur-md border border-white/[0.08] text-[11px] font-mono-receipt space-y-1.5 text-[#8890a2] shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
              <span>Music & Vinyl Soundtracks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span>Places & Lisbon Travels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fb7185]" />
              <span>Messages & Maya Conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#818cf8]" />
              <span>2 AM Insomnia Void</span>
            </div>
          </div>
        </div>
      </section>

      {/* Synthesized Meaningful Moments (Tight Time Clusters) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono-receipt uppercase tracking-widest text-[#848c9e]">
              Synthesized Moments (Tight Time Clusters)
            </h2>
            <p className="text-xs text-[#5d6475] font-sans-ui">
              Song → Location → Photo → Purchase → Event occurring in unison
            </p>
          </div>
          <span className="text-xs font-mono-receipt text-[#f59e0b]">
            {filteredMoments.length} Cohesive Moments Identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMoments.map((moment, idx) => {
            const recs = moment.ids.map((id) => threads.byId.get(id)).filter(Boolean)
            if (!recs.length) return null

            const firstRec = recs[0]
            const typesInCluster = [...new Set(recs.map((r) => r.type))]

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-white/[0.07] bg-[#0d0f17] hover:border-[#f59e0b]/40 transition-all space-y-4 shadow-xl group hover:-translate-y-1"
              >
                {/* Cluster Header */}
                <div className="flex items-center justify-between text-xs font-mono-receipt pb-3 border-b border-white/[0.06]">
                  <span className="text-[#f59e0b] font-bold">
                    MOMENT № {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#6d7486]">
                    {fmtDate(firstRec.dt)} · {fmtTime(firstRec.dt)}
                  </span>
                </div>

                {/* Synthesis Description */}
                <div>
                  <h3 className="font-serif-story text-2xl text-[#fbf9f5] group-hover:text-[#f59e0b] transition-colors leading-snug">
                    {moment.label || `${recs.length} Moments In Concert`}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {typesInCluster.map((t) => {
                      const m = TYPE_META[t] || { label: t, color: '#f59e0b' }
                      return (
                        <span
                          key={t}
                          className="text-[10px] font-mono-receipt px-2.5 py-0.5 rounded-full border"
                          style={{
                            borderColor: `${m.color}40`,
                            backgroundColor: `${m.color}15`,
                            color: m.color
                          }}
                        >
                          {m.label}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-receipt list */}
                <div className="space-y-2 pt-2">
                  {recs.map((r) => {
                    const meta = TYPE_META[r.type] || { short: '◈', color: '#f59e0b' }
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          sound.playPaperRustle()
                          onSelectReceipt(r)
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#08090f] hover:bg-[#141622] border border-white/[0.05] text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span style={{ color: meta.color }} className="font-mono-receipt font-bold">
                            {meta.short}
                          </span>
                          <span className="font-mono-receipt text-[#d6dbe7] truncate">
                            {r.heading}
                          </span>
                        </div>
                        <span className="font-mono-receipt text-[11px] text-[#697184] shrink-0">
                          {r.timeStr}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
