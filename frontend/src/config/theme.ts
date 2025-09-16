/**
 * Flex Living Theme Configuration
 * Centralized theme management for the entire application
 */

export const theme = {
  colors: {
    // Primary Brand Colors
    primary: '#D4F872',
    primaryHover: '#B8E082',
    primaryForeground: '#293122',
    
    // Secondary Colors
    secondary: '#F5F3EF',
    secondaryForeground: '#323927',
    
    // Neutral Colors
    background: '#ffffff',
    foreground: '#293122',
    muted: '#F5F3EF',
    mutedForeground: '#6c757d',
    
    // Accent Colors
    accent: '#e9ecef',
    accentForeground: '#323927',
    
    // Status Colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    
    // Border and Input
    border: '#e9ecef',
    input: '#e9ecef',
    ring: '#D4F872',
    
    // Additional Brand Colors
    lime: '#D4F872',
    darkGreen: '#293122',
    printemps: '#323927',
    mousse: '#F5F3EF',
    white: '#ffffff',
    black: '#000000',
    grayLight: '#f8f9fa',
    grayMedium: '#6c757d',
    grayDark: '#495057',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(212, 248, 114, 0.3)',
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
} as const

export type Theme = typeof theme
export type ThemeColors = typeof theme.colors
export type ThemeSpacing = typeof theme.spacing
export type ThemeBreakpoints = typeof theme.breakpoints
