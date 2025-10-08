// Performance monitoring and optimization utilities

import React from 'react'

interface PerformanceMetrics {
  componentRenderTime: number
  queryExecutionTime: number
  mutationExecutionTime: number
  totalPageLoadTime: number
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private timers: Map<string, number> = new Map()

  // Start timing a performance metric
  startTimer(label: string): void {
    this.timers.set(label, performance.now())
  }

  // End timing and record the metric
  endTimer(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      console.warn(`Timer ${label} was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(label)
    
    // Record the metric
    this.metrics[label as keyof PerformanceMetrics] = duration
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  // Get all recorded metrics
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = {}
    this.timers.clear()
  }

  // Log performance summary
  logSummary(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('📊 Performance Summary')
      Object.entries(this.metrics).forEach(([key, value]) => {
        console.log(`${key}: ${value?.toFixed(2)}ms`)
      })
      console.groupEnd()
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for component performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startTime = performance.now()

  React.useEffect(() => {
    const renderTime = performance.now() - startTime
    performanceMonitor.startTimer(`${componentName}-render`)
    performanceMonitor.endTimer(`${componentName}-render`)
    
    return () => {
      // Cleanup if needed
    }
  }, [componentName, startTime])
}

// GraphQL query performance wrapper
export function withQueryPerformance<T>(
  queryFn: () => Promise<T>,
  queryName: string
): Promise<T> {
  performanceMonitor.startTimer(`${queryName}-query`)
  
  return queryFn()
    .then((result) => {
      performanceMonitor.endTimer(`${queryName}-query`)
      return result
    })
    .catch((error) => {
      performanceMonitor.endTimer(`${queryName}-query`)
      throw error
    })
}

// GraphQL mutation performance wrapper
export function withMutationPerformance<T>(
  mutationFn: () => Promise<T>,
  mutationName: string
): Promise<T> {
  performanceMonitor.startTimer(`${mutationName}-mutation`)
  
  return mutationFn()
    .then((result) => {
      performanceMonitor.endTimer(`${mutationName}-mutation`)
      return result
    })
    .catch((error) => {
      performanceMonitor.endTimer(`${mutationName}-mutation`)
      throw error
    })
}

// Debounced search utility for performance
export function createDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout

  return (query: string): Promise<T[]> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        const results = await searchFn(query)
        resolve(results)
      }, delay)
    })
  }
}

// Memory usage monitoring
export function logMemoryUsage(): void {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log('🧠 Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    })
  }
}

// Bundle size optimization utilities
export const bundleOptimizations = {
  // Lazy load components
  lazyLoad: (importFn: () => Promise<any>) => {
    return React.lazy(importFn)
  },
  
  // Code splitting utilities
  splitCode: (chunkName: string) => {
    return (importFn: () => Promise<any>) => {
      return importFn().then(module => {
        // Add chunk name for better caching
        return module
      })
    }
  }
}

// Image optimization utilities
export const imageOptimizations = {
  // Generate responsive image sizes
  generateSizes: (baseSize: number) => {
    return [baseSize, baseSize * 2, baseSize * 3]
  },
  
  // Generate srcSet for responsive images
  generateSrcSet: (baseUrl: string, sizes: number[]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ')
  }
}

// Export performance utilities
export {
  PerformanceMonitor,
  type PerformanceMetrics
}
