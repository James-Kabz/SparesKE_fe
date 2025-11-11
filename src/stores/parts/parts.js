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
    // set parts data (for static data or testing)
    setParts(data) {
      this.part = data
    },
  }
})
