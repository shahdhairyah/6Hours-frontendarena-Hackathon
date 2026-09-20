import React from 'react'

/**
 * @typedef {'default' | 'amber' | 'rose' | 'indigo' | 'emerald' | 'cyan' | 'neutral'} BadgeVariant
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {BadgeVariant} [props.variant='default']
 * @param {string} [props.className='']
 * @param {boolean} [props.dot=false]
 * @param {string} [props.dotColor]
 * @param {string} [props.title]
 */
export function Badge({
  children,
  variant = 'default',
  className = '',
  dot = false,
  dotColor,
  title,
  ...props
}) {
  const variantStyles = {
    default: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-950/40 text-rose-300 border-rose-500/30',
    indigo: 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
    cyan: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30',
    neutral: 'bg-zinc-900/60 text-zinc-400 border-zinc-800',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium border backdrop-blur-xs transition-colors ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      title={title}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor || 'bg-current opacity-80'}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
