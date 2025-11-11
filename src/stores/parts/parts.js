import { fetchWrapper } from "@/utils/helpers/fetchWrapper";
import { toast } from "@stlhorizon/vue-ui";
import { defineStore } from "pinia";


export const userPartStore = defineStore("parts", {

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
        this.part = response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch parts'
        toast.error('Failed to fetch parts', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },
  }
})
