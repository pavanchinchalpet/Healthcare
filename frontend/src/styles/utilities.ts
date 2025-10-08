// Optimized CSS utilities and component styles
// This file contains reusable CSS classes and optimized styling patterns

export const styles = {
  // Layout utilities
  container: 'max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16',
  section: 'mb-6 md:mb-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  grid3: 'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6',
  
  // Typography
  heading: 'text-3xl md:text-4xl font-semibold text-pretty',
  headingLarge: 'text-3xl md:text-5xl font-semibold text-pretty',
  subtitle: 'mt-3 text-muted-foreground leading-relaxed',
  subtitleLarge: 'mt-3 md:mt-4 text-muted-foreground text-pretty leading-relaxed',
  
  // Form styles
  formField: 'space-y-2',
  formFieldFull: 'md:col-span-2 space-y-2',
  formActions: 'md:col-span-2 flex gap-2',
  
  // Table styles
  tableContainer: 'overflow-x-auto',
  table: 'w-full',
  tableHeader: 'border-b',
  tableHeaderCell: 'text-left p-2 font-medium',
  tableRow: 'border-b hover:bg-muted/50',
  tableCell: 'p-2',
  tableCellMedium: 'p-2 font-medium',
  tableCellMuted: 'p-2 text-muted-foreground',
  tableCellTruncate: 'p-2 text-muted-foreground max-w-xs truncate',
  
  // Status badges
  statusBadge: 'px-2 py-1 text-xs rounded-full',
  statusScheduled: 'bg-gray-100 text-gray-800',
  statusCompleted: 'bg-black text-white',
  statusCancelled: 'bg-gray-200 text-gray-800',
  statusRescheduled: 'bg-gray-100 text-gray-800',
  
  // Button groups
  buttonGroup: 'flex gap-2',
  buttonGroupActions: 'flex gap-2',
  
  // Loading and empty states
  loadingContainer: 'text-center py-8',
  emptyContainer: 'text-center py-12',
  emptyText: 'text-muted-foreground',
  
  // Error states
  errorContainer: 'text-center text-destructive',
  
  // Responsive utilities
  responsiveGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  responsiveText: 'text-sm md:text-base',
  responsivePadding: 'p-4 md:p-6',
  
  // Focus and interaction states
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  hoverTransition: 'transition-colors hover:bg-muted/50',
  
  // Accessibility
  srOnly: 'sr-only',
  srOnlyFocus: 'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-1 focus:rounded-md'
} as const

// Status badge helper function
export const getStatusBadgeClass = (status: string): string => {
  const baseClass = styles.statusBadge
  switch (status) {
    case 'Scheduled':
      return `${baseClass} ${styles.statusScheduled}`
    case 'Completed':
      return `${baseClass} ${styles.statusCompleted}`
    case 'Cancelled':
      return `${baseClass} ${styles.statusCancelled}`
    case 'Rescheduled':
      return `${baseClass} ${styles.statusRescheduled}`
    default:
      return `${baseClass} ${styles.statusScheduled}`
  }
}

// Responsive breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

// Animation utilities
export const animations = {
  fadeIn: 'animate-in fade-in-0',
  slideIn: 'animate-in slide-in-from-top-2',
  zoomIn: 'animate-in zoom-in-95',
  duration: {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300'
  }
} as const
