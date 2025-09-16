import { useState, useEffect, useCallback } from 'react'
import { Property } from '@/types'
import { useApi } from './useApi'

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const api = useApi<Property[]>()

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/properties')
      if (response.success) {
        setProperties(response.data || [])
      }
    } catch (err) {
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchProperties()
  }, [])

  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(property => property.id === id)
  }

  const getActiveProperties = (): Property[] => {
    return properties.filter(property => property.isActive)
  }

  return {
    properties,
    loading,
    error,
    getPropertyById,
    getActiveProperties,
    refetch: fetchProperties
  }
}
