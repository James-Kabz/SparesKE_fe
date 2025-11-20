import { fetchWrapper } from "@/utils/helpers/fetchWrapper"
import { toast } from "@stlhorizon/vue-ui"
import { defineStore } from "pinia"

export const useCategoryStore = defineStore('category', {
  state: () => ({
    category: [],
    loading: false,
    isLoading: false
  }),

  actions: {
    // fetch all part categories
    async fetchCategories() {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/categories`)
        this.category = response.data.category || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch categories'
        toast.error('Failed to fetch categories', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // fetch part category by id
    async fetchCategory(id) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.get(`/categories/${id}`)
        this.category = response.data.category || response.data
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch category'
        toast.error('Failed to fetch category', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // create part
    async createCategory(category) {
      this.isLoading = true
      try {
        await fetchWrapper.post(`/categories`, category)
        await this.fetchCategories()
        toast.success('Category created successfully!')
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create category'
        toast.error('Failed to create category', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // update category
    async updateCategory(id, data) {
      this.isLoading = true
      try {
        const response = await fetchWrapper.put(`/categories/${id}`, data)
        await this.fetchCategories()
        toast.success('Category updated successfully!')
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update category'
        toast.error('Failed to update category', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // delete category
    async deleteCategory(id) {
      this.isLoading = true
      try {
        await fetchWrapper.delete(`/categories/${id}`)
        // Refetch categories after delete
        await this.fetchCategories()
        toast.success('Category deleted successfully!')
        return { success: true }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete category'
        toast.error('Failed to delete category', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    // initialize data
    async initializeData() {
      this.loading = true

      try {
        await this.fetchCategories()
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
