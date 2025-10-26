import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_ENDPOINTS } from '@/lib/constants'
import { ApiResponse, PaginatedResponse, UploadResponse } from '@/types'
import { env } from '@/lib/env'
import StorageService from './storage'

class ApiService {
  private static instance: AxiosInstance
  private static isInitialized = false

  static init(): void {
    if (this.isInitialized) return

    this.instance = axios.create({
      baseURL: env.NEXT_PUBLIC_API_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Request interceptor for authentication
    this.instance.interceptors.request.use(
      (config) => {
        const token = StorageService.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          StorageService.clearAuthToken()
          StorageService.clearUserData()
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login'
          }
        }
        return Promise.reject(this.handleError(error))
      }
    )

    this.isInitialized = true
  }

  // Authentication
  static async login(email: string, password: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    })
    return response.data
  }

  static async register(userData: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response.data
  }

  static async logout(): Promise<void> {
    this.ensureInitialized()
    try {
      await this.instance.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      StorageService.clearAuthToken()
      StorageService.clearUserData()
    }
  }

  static async refreshToken(): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.AUTH.REFRESH)
    return response.data
  }

  // User Management
  static async getUserProfile(userId?: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const endpoint = userId ? API_ENDPOINTS.USERS.GET_BY_ID(userId) : API_ENDPOINTS.USERS.PROFILE
    const response = await this.instance.get(endpoint)
    return response.data
  }

  static async updateUserProfile(data: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.put(API_ENDPOINTS.USERS.UPDATE, data)
    return response.data
  }

  static async searchUsers(query: string): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.USERS.SEARCH, {
      params: { q: query },
    })
    return response.data
  }

  // Artwork Management
  static async getArtworks(filters?: any): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.ARTWORKS.LIST, {
      params: filters,
    })
    return response.data
  }

  static async getArtworkById(id: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.ARTWORKS.GET_BY_ID(id))
    return response.data
  }

  static async createArtwork(artworkData: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.ARTWORKS.CREATE, artworkData)
    return response.data
  }

  static async updateArtwork(id: string, data: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.put(API_ENDPOINTS.ARTWORKS.UPDATE(id), data)
    return response.data
  }

  static async deleteArtwork(id: string): Promise<void> {
    this.ensureInitialized()
    await this.instance.delete(API_ENDPOINTS.ARTWORKS.DELETE(id))
  }

  // Commission Management
  static async getCommissions(filters?: any): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.COMMISSIONS.LIST, {
      params: filters,
    })
    return response.data
  }

  static async getCommissionById(id: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.COMMISSIONS.GET_BY_ID(id))
    return response.data
  }

  static async createCommission(commissionData: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.COMMISSIONS.CREATE, commissionData)
    return response.data
  }

  static async updateCommission(id: string, data: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.put(API_ENDPOINTS.COMMISSIONS.UPDATE(id), data)
    return response.data
  }

  static async updateCommissionStatus(id: string, status: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.patch(API_ENDPOINTS.COMMISSIONS.UPDATE_STATUS(id), {
      status,
    })
    return response.data
  }

  // Payment Management
  static async createPayment(paymentData: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData)
    return response.data
  }

  static async getPaymentById(id: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.PAYMENTS.GET_BY_ID(id))
    return response.data
  }

  static async processPayment(id: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.PAYMENTS.PROCESS(id))
    return response.data
  }

  static async getPaymentHistory(): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.PAYMENTS.HISTORY)
    return response.data
  }

  // Messaging
  static async getConversations(): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS)
    return response.data
  }

  static async createConversation(data: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.MESSAGES.CREATE_CONVERSATION, data)
    return response.data
  }

  static async getMessages(conversationId: string): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.MESSAGES.GET_MESSAGES(conversationId))
    return response.data
  }

  static async sendMessage(messageData: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.MESSAGES.SEND_MESSAGE, messageData)
    return response.data
  }

  static async markMessageAsRead(messageId: string): Promise<void> {
    this.ensureInitialized()
    await this.instance.patch(API_ENDPOINTS.MESSAGES.MARK_READ(messageId))
  }

  // Events
  static async getEvents(filters?: any): Promise<PaginatedResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.EVENTS.LIST, {
      params: filters,
    })
    return response.data
  }

  static async getEventById(id: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.get(API_ENDPOINTS.EVENTS.GET_BY_ID(id))
    return response.data
  }

  static async createEvent(eventData: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.EVENTS.CREATE, eventData)
    return response.data
  }

  static async updateEvent(id: string, data: any): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.put(API_ENDPOINTS.EVENTS.UPDATE(id), data)
    return response.data
  }

  static async deleteEvent(id: string): Promise<void> {
    this.ensureInitialized()
    await this.instance.delete(API_ENDPOINTS.EVENTS.DELETE(id))
  }

  static async attendEvent(id: string): Promise<ApiResponse> {
    this.ensureInitialized()
    const response = await this.instance.post(API_ENDPOINTS.EVENTS.ATTEND(id))
    return response.data
  }

  // File Upload
  static async uploadImage(file: File, type: string): Promise<UploadResponse> {
    this.ensureInitialized()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await this.instance.post(API_ENDPOINTS.UPLOAD.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  static async uploadFile(file: File): Promise<UploadResponse> {
    this.ensureInitialized()
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.instance.post(API_ENDPOINTS.UPLOAD.FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Helper methods
  private static ensureInitialized(): void {
    if (!this.isInitialized) {
      this.init()
    }
  }

  private static handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.message || 'Server error occurred'
      return new Error(`Error ${status}: ${message}`)
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your internet connection.')
    } else {
      // Other error
      return new Error('An unexpected error occurred')
    }
  }

  // Generic request method for custom endpoints
  static async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.ensureInitialized()
    return this.instance.request<T>(config)
  }
}

export default ApiService
