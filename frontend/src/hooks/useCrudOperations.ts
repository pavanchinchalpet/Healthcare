import { useMutation } from '@apollo/client'
import { useState, useCallback } from 'react'

interface CrudOptions<T extends { id: string }> {
  createMutation: any
  updateMutation: any
  deleteMutation: any
  refetchQueries: any[]
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useCrudOperations<T extends { id: string }>({
  createMutation,
  updateMutation,
  deleteMutation,
  refetchQueries,
  onSuccess,
  onError
}: CrudOptions<T>) {
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [createItem, { loading: creating }] = useMutation(createMutation, {
    refetchQueries,
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onSuccess?.(data)
      setShowForm(false)
    },
    onError: (error) => {
      onError?.(error)
    }
  })

  const [updateItem, { loading: updating }] = useMutation(updateMutation, {
    refetchQueries,
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onSuccess?.(data)
      setShowForm(false)
      setEditingItem(null)
    },
    onError: (error) => {
      onError?.(error)
    }
  })

  const [deleteItem, { loading: deleting }] = useMutation(deleteMutation, {
    refetchQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      onSuccess?.({} as T)
    },
    onError: (error) => {
      onError?.(error)
    }
  })

  const handleCreate = useCallback(async (input: any) => {
    await createItem({ variables: { input } })
  }, [createItem])

  const handleUpdate = useCallback(async (input: any) => {
    await updateItem({ variables: { input } })
  }, [updateItem])

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem({ variables: { id } })
    }
  }, [deleteItem])

  const handleEdit = useCallback((item: T) => {
    setEditingItem(item)
    setShowForm(true)
  }, [])

  const handleCancel = useCallback(() => {
    setShowForm(false)
    setEditingItem(null)
  }, [])

  const handleShowForm = useCallback(() => {
    setShowForm(true)
    setEditingItem(null)
  }, [])

  return {
    // State
    editingItem,
    showForm,
    
    // Loading states
    creating,
    updating,
    deleting,
    isLoading: creating || updating || deleting,
    
    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCancel,
    handleShowForm,
    
    // Setters
    setShowForm,
    setEditingItem
  }
}
