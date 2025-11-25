import { fetchWrapper } from "@/utils/helpers/fetchWrapper";
import { toast } from "@stlhorizon/vue-ui";
import { defineStore } from "pinia";


export const usePickupPointStore = defineStore('pickupPoint', {
  state: () => ({
    pickupPoint: [],
    loading: false,
    isLoading: false
  }),

  actions: {
    // fetch vendor pickup points
    async fetchVendorPickupPoints() {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/vendor/pickup-points`)
        this.pickupPoint = response.data.pickupPoint || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch pickup points'
        toast.error('Failed to fetch pickup points', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // fetch all pickup points
    async fetchPickupPoints() {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/pickup-points`)
        this.pickupPoint = response.data.pickupPoint || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch pickup points'
        toast.error('Failed to fetch pickup points', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // fetch a pickup point
    async fetchPickupPoint(id) {
      this.loading = true
      try {
        const response = await fetchWrapper.get(`/pickup-points/${id}`)
        return { success: true, data: response.data }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch pickup point'
        toast.error('Failed to fetch pickup point', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // create a pickup point
    async createPickupPoint(data) {
      this.loading = true
      try {
        const response = await fetchWrapper.post(`/pickup-points`, data)
        toast.success('Pickup point created successfully')
        return { success: true, data: response.data }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create pickup point'
        toast.error('Failed to create pickup point', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // update a pickup
    async updatePickupPoint(id, data) {
      this.loading = true
      try {
        const response = await fetchWrapper.put(`/pickup-points/${id}`, data)
        toast.success('Pickup point updated successfully')
        return { success: true, data: response.data }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update pickup point'
        toast.error('Failed to update pickup point', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // delete a pickup point
    async deletePickupPoint(id) {
      this.loading = true
      try {
        const response = await fetchWrapper.delete(`/pickup-points/${id}`)
        toast.success('Pickup point deleted successfully')
        return { success: true, data: response.data }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete pickup point'
        toast.error('Failed to delete pickup point', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.loading = false
      }
    },

    // initialize data
    async initializeData() {
      this.loading = true

      try {
        await this.fetchPickupPoints()
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
    }
  }
})
