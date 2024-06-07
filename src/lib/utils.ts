import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import colors from '@/constants/Colors'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapColor (colorName: string) {
  return colors[colorName]
}
