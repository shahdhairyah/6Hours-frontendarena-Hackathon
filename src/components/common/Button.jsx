import React from 'react'
import { useSound } from '../../hooks/useSound.js'

/**
 * @typedef {'primary' | 'secondary' | 'ghost' | 'danger' | 'amber'} ButtonVariant
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {ButtonVariant} [props.variant='secondary']
 * @param {ButtonSize} [props.size='md']
 * @param {string} [props.className='']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.sound=true]
 * @param {React.ReactNode} [props.icon]
 * @param {Function} [props.onClick]
 * @param {string} [props.type='button']
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled = false,
  sound = true,
  icon,
  onClick,
  type = 'button',
  ...props
}) {
  const { playTypewriter } = useSound()

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-mono font-medium rounded-lg transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]'

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-xs md:text-sm px-3.5 py-2',
    lg: 'text-sm md:text-base px-5 py-2.5',
  }

  const variantStyles = {
    primary:
      'bg-amber-400 text-zinc-950 hover:bg-amber-300 font-semibold shadow-md shadow-amber-400/20 border border-amber-300/40',
    secondary:
      'bg-zinc-900/80 text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500/80',
    ghost:
      'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent',
    danger:
      'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-500/30',
    amber:
      'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-500/30',
  }

  const handleClick = (e) => {
    if (disabled) return
    if (sound) playTypewriter()
    if (onClick) onClick(e)
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.secondary
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
