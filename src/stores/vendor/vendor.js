import { defineStore } from "pinia";

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendor: [],
    isLoading: false,
    loading: false
  }),

  actions: {
    // get vendor profiles
    async fetchVendors() {
      this.loading = true
      try {
        const res = await fetchWrapper.get(`/vendors`)
        this.vendor = res.data?.vendor
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
        return { success: true, vendor: res.data }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch vendor', {
          description: errorMessage,
        })
        return { success: false, error }
      }
    },

    // create vendor profile
    async createVendor(data) {
      this.isLoading = true
      try {
        const res = await fetchWrapper.post(`/vendors`, data)
        toast.success('Vendor created successfully!')
        await this.fetchVendors()
        return { success: true, vendor: res.data }
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
        toast.success('Vendor updated successfully!')
        await this.fetchVendors()
        return { success: true, vendor: res.data }
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
        toast.success('Vendor verified successfully!')
        await this.fetchVendors()
        return { success: true, vendor: res.data }
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
        error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to load data', {
          description: 'Please refresh the page to try again',
        })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },
  }
})
