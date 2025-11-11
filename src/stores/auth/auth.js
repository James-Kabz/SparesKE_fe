import { defineStore } from 'pinia'
import { fetchWrapper } from '@/utils/helpers/fetchWrapper'
import { toast } from '@stlhorizon/vue-ui'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    isLoading: false,
    lastFetched: null,
  }),

  actions: {
    // login user
    async login(email, password) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.post(`/login`, { email, password })

        this.token = response.data.token
        localStorage.setItem('token', response.data.token)

        // force fresh fetch to ensure latest roles/permissions
        await this.fetchUser(true)

        toast.success('Login successful!', {
          description: `Welcome back, ${this.user?.name || 'User'}!`,
        })

        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Login failed'
        toast.error('Login failed', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // fetch current user
    async fetchUser(force = false) {
      this.isLoading = true
      try {
        const now = Date.now()
        const cacheDuration = 5 * 60 * 1000

        if (!force && this.lastFetched && now - this.lastFetched < cacheDuration) {
          return { success: true, cached: true }
        }

        const response = await fetchWrapper.get(`/me`)

        this.user = response.data?.user || response
        if (response.data?.organisation) {
          this.user.organisations = response.data.organisation
          // Prefer organisation with 'owner' role, fallback to first
          this.user.currentOrganisation =
            response.data.organisation.find((org) => org.role === 'owner') ||
            response.data.organisation[0] ||
            null
          // Fetch organisation details if organisation_id exists
          if (this.user.currentOrganisation?.organisation_id) {
            try {
              const orgResponse = await fetchWrapper.get(
                `/organisations/${this.user.currentOrganisation.organisation_id}`,
              )
              this.user.currentOrganisation = { ...this.user.currentOrganisation, ...orgResponse.data }
            } catch (error) {
              console.error('Failed to fetch organisation details:', error)
            }
          }
        }
        this.token = localStorage.getItem('token')

        localStorage.setItem('user', JSON.stringify(this.user))

        // update timestamp
        this.lastFetched = now

        return { success: true, cached: false }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Failed to fetch user data'
        toast.error('Failed to fetch user', { description: errorMessage })
        if (error?.response?.status === 401) {
          await this.logout()
        }
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // logout user
    async logout() {
      this.isLoading = true
      try {
        this.user = null
        this.token = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')

        toast.success('Logged out successfully!')

        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Logout failed'
        toast.error('Logout failed', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // Switch organisation
    async switchOrganisation(organisation) {
      if (!organisation || !organisation.organisation_id) return { success: false, error: 'Invalid organisation' }

      try {
        // Update the current organisation in user state
        this.user.currentOrganisation = organisation

        // Optionally, persist the change to localStorage
        localStorage.setItem('user', JSON.stringify(this.user))

        toast.success('Organisation switched!', {
          description: `Now viewing ${organisation.organisation_name}`,
        })

        return { success: true }
      } catch (error) {
        const errorMessage = error?.message || 'Failed to switch organisation'
        toast.error('Switch failed', { description: errorMessage })
        return { success: false, error }
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userRoles: (state) => state.user?.roles || [],
    userPermissions: (state) => state.user?.permissions || [],
    userName: (state) => state.user?.name || state.user?.email,
  },
})
