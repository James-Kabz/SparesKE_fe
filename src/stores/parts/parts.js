import { fetchWrapper } from "@/utils/helpers/fetchWrapper";
import { toast } from "@stlhorizon/vue-ui";
import { defineStore } from "pinia";


export const usePartStore = defineStore("parts", {

  state: () => ({
    part: [],
    isLoading: false,
    loading: false,
  }),

  actions: {
    // fetch vendor parts
    async fetchVendorParts() {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/vendor/parts`)
        const parts = response.data.part || response.data
        // Convert availability to boolean
        this.part = parts.map(part => ({
          ...part,
          availability: Boolean(part.availability)
        }))
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch parts'
        toast.error('Failed to fetch parts', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // fetch vendor part
    async fetchVendorPart(id) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/vendor/parts/${id}`)
        this.part = response.data.part || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch part'
        toast.error('Failed to fetch part', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },
    
    // fetch all parts
    async fetchParts() {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/parts`)
        const parts = response.data.part || response.data
        // Convert availability to boolean
        this.part = parts.map(part => ({
          ...part,
          availability: Boolean(part.availability)
        }))
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch parts'
        toast.error('Failed to fetch parts', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // fetch single part
    async fetchPart(id) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`parts/${id}`)
        this.part = response.data.part || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch part'
        toast.error('Failed to fetch part', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // create part
    async createPart(part) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.post(`vendor/parts`, part)
        this.part = response.data.part || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create part'
        toast.error('Failed to create part', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // update part
    async updatePart(id, data) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.put(`vendor/parts/${id}`, data)
        this.part = response.data.part || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update part'
        toast.error('Failed to update part', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // delete part
    async deletePart(id) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.delete(`vendor/parts/${id}`)
        this.part = response.data.part || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete part'
        toast.error('Failed to delete part', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // initialize data
    async initializeData() {
      this.loading = true

      try {
        await this.fetchParts()

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

    // set parts data (for static data or testing)
    setParts(data) {
      this.part = data
    },
  }
})
