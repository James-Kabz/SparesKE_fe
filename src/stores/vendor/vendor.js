import { fetchWrapper } from "@/utils/helpers/fetchWrapper";
import { toast } from "@stlhorizon/vue-ui";
import { defineStore } from "pinia";

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendor: [],
    currentVendor: null,
    isLoading: false,
    loading: false
  }),

  actions: {
    // get vendor profiles
    async fetchVendors() {
      this.loading = true
      try {
        const res = await fetchWrapper.get(`/vendors`)
        this.vendor = res.data?.vendor || res.data || []
        return this.vendor
      } catch (error) {
        this.vendor = []
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch vendors', {
          description: errorMessage,
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // get vendor profile
    async fetchVendor(id) {
      try {
        const res = await fetchWrapper.get(`/vendors/${id}`)
        const vendorData = res.data?.vendor || res.data
        return { success: true, vendor: vendorData }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch vendor', {
          description: errorMessage,
        })
        return { success: false, error }
      }
    },

    // get current user's vendor profile
    async fetchMyVendor() {
      this.isLoading = true
      try {
        const res = await fetchWrapper.get(`/vendor/me`)
        // Handle both possible response structures
        const vendorData = res.data?.vendor || res.data
        this.currentVendor = vendorData

        return { success: true, vendor: vendorData }
      } catch (error) {
        this.currentVendor = null
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Something went wrong'

        toast.error('Failed to fetch vendor profile', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // create vendor profile
    async createVendor(data) {
      this.isLoading = true
      try {
        const res = await fetchWrapper.post(`/vendors`, data)
        const vendorData = res.data?.vendor || res.data
        toast.success('Vendor created successfully!')
        await this.fetchVendors()
        return { success: true, vendor: vendorData }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to create vendor', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // update vendor profile
    async updateVendor(id, data) {
      this.isLoading = true
      try {
        const res = await fetchWrapper.put(`/vendors/${id}`, data)
        const vendorData = res.data?.vendor || res.data
        toast.success('Vendor updated successfully!')
        await this.fetchVendors()
        // Update current vendor if it's the same one
        if (this.currentVendor && this.currentVendor.id === id) {
          this.currentVendor = vendorData
        }
        return { success: true, vendor: vendorData }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to update vendor', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // verify vendor profile (super-admin only)
    async verifyVendor(id) {
      this.isLoading = true
      try {
        const res = await fetchWrapper.put(`/vendors/${id}/verify`)
        const vendorData = res.data?.vendor || res.data
        toast.success('Vendor verified successfully!')
        await this.fetchVendors()
        return { success: true, vendor: vendorData }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to verify vendor', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // delete vendor profile
    async deleteVendor(id) {
      this.isLoading = true
      try {
        await fetchWrapper.delete(`/vendors/${id}`)
        toast.success('Vendor deleted successfully!')
        await this.fetchVendors()
        // Clear current vendor if it was deleted
        if (this.currentVendor && this.currentVendor.id === id) {
          this.currentVendor = null
        }
        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to delete vendor', {
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
        await this.fetchVendors()
        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to load data', {
          description: 'Please refresh the page to try again',
        })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // Clear current vendor
    clearCurrentVendor() {
      this.currentVendor = null
    }
  },

  getters: {
    // Get current vendor
    getCurrentVendor: (state) => state.currentVendor,

    // Check if current vendor is verified
    isCurrentVendorVerified: (state) => state.currentVendor?.verified || false,

    // Get all vendors
    getAllVendors: (state) => state.vendor
  }
})
