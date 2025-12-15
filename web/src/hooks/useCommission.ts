'use client'

import { Commission, CommissionStatus } from '@/types/commission'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE = '/api/commissions'

export const commissionKeys = {
  all: ['commissions'],
  lists: () => [...commissionKeys.all, 'list'],
  list: (type: string, status?: string) => [...commissionKeys.lists(), { type, status }],
  details: () => [...commissionKeys.all, 'detail'],
  detail: (id: string) => [...commissionKeys.details(), id],
}

// GET commissions
export const useCommissions = (type: string = 'all', status?: string) => {
  return useQuery({
    queryKey: commissionKeys.list(type, status),
    queryFn: async () => {
      const params = new URLSearchParams({ type })
      if (status) params.append('status', status)

      const res = await fetch(`${API_BASE}?${params}`)
      if (!res.ok) throw new Error('Failed to fetch commissions')
      const data = await res.json()
      return data.commissions as Commission[]
    },
  })
}

// GET single commission
export const useCommission = (id: string) => {
  return useQuery({
    queryKey: commissionKeys.detail(id),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/${id}`)
      if (!res.ok) throw new Error('Failed to fetch commission')
      const data = await res.json()
      return data.commission as Commission
    },
    enabled: !!id,
  })
}

// CREATE commission
export const useCreateCommission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      title: string
      description: string
      category: string
      budget: number
      deadline?: string
      requirements?: string
      isUrgent?: boolean
      artistId: string
      referenceImages?: string[]
    }) => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create commission')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}

// ACCEPT commission
export const useAcceptCommission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commissionId: string) => {
      const res = await fetch(`${API_BASE}/${commissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to accept commission')
      }
      return res.json()
    },
    onSuccess: (_, commissionId) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) })
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}

// DECLINE commission
export const useDeclineCommission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commissionId: string) => {
      const res = await fetch(`${API_BASE}/${commissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to decline commission')
      }
      return res.json()
    },
    onSuccess: (_, commissionId) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) })
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}

// UPDATE commission status
export const useUpdateCommissionStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commissionId, status }: { commissionId: string; status: CommissionStatus }) => {
      const res = await fetch(`${API_BASE}/${commissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update commission')
      }
      return res.json()
    },
    onSuccess: (_, { commissionId }) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) })
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}

// COMPLETE commission
export const useCompleteCommission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commissionId: string) => {
      const res = await fetch(`${API_BASE}/${commissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to complete commission')
      }
      return res.json()
    },
    onSuccess: (_, commissionId) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) })
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}

// CANCEL commission
export const useCancelCommission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commissionId: string) => {
      const res = await fetch(`${API_BASE}/${commissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to cancel commission')
      }
      return res.json()
    },
    onSuccess: (_, commissionId) => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.detail(commissionId) })
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}

// DELETE commission
export const useDeleteCommission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commissionId: string) => {
      const res = await fetch(`${API_BASE}/${commissionId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete commission')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commissionKeys.lists() })
    },
  })
}
