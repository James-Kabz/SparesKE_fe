import { fetchWrapper } from '@/utils/helpers/fetchWrapper'
import { toast } from '@stlhorizon/vue-ui'
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [],
    loading: false,
    isLoading: false,
  }),

  actions: {
    // fetch permissions
    async fetchPermissions() {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get('/permissions')
        this.permissions = response.data?.permission || []
      } catch (error) {
        console.error('Error fetching permissions:', error)
        this.permissions = []
      } finally {
        this.isLoading = false
      }
    },
    // fetch permission
    async fetchPermission(id) {
      try {
        const response = await fetchWrapper.get(`/permissions/${id}`)
        this.permissions = response.data?.permissions || []
        return this.users
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch permissions', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // create permission
    async createPermission(data) {
      this.isLoading = true
      try {
        await fetchWrapper.post(`/permissions`, data)
        toast.success('Permission created successfully!')
        await this.fetchPermissions()
        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to create permission', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // update permission
    async updatePermission(id, data) {
      this.isLoading = true
      try {
        await fetchWrapper.put(`/permissions/${id}`, data)
        toast.success('Permission updated successfully!')
        await this.fetchPermissions()
        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to update permission', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // delete permission
    async deletePermission(id) {
      this.isLoading = true
      try {
        await fetchWrapper.delete(`/permissions/${id}`)
        toast.success('Permission deleted successfully!')
        await this.fetchPermissions()
        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to delete permission', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // initialize data
    async initializeData() {
      this.loading = true
      try {
        await this.fetchPermissions()

        return { success: true }
      } catch (error) {
        console.error('Error initializing data:', error)
        error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to load data', {
          description: 'Please refresh the page to try again',
        })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },
  },
})
