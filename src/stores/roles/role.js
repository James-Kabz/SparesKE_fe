import { fetchWrapper } from '@/utils/helpers/fetchWrapper'
import { defineStore } from 'pinia'
import { toast } from '@stlhorizon/vue-ui'
import { usePermissionStore } from '../permissions/permission'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [],
    rolePermissions: [],
    loading: false,
    isLoading: false,
  }),

  actions: {
    async fetchRoles() {
      this.loading = true
      try {
        const res = await fetchWrapper.get(`/roles`)
        this.roles = res.data?.role
        return this.roles
      } catch (error) {
        this.roles = []
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch roles', {
          description: errorMessage,
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async createRole(data) {
      this.isLoading = true
      try {
        const res = await fetchWrapper.post(`/roles`, data)
        toast.success('Role created successfully!')
        await this.fetchRoles()
        return { success: true, role: res.data }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to create role', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    async updateRole(id, data) {
      this.isLoading = true
      try {
        const res = await fetchWrapper.put(`/roles/${id}`, data)
        toast.success('Role updated successfully!')
        await this.fetchRoles()
        return { success: true, role: res.data }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to update role', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteRole(id) {
      this.isLoading = true
      try {
        await fetchWrapper.delete(`/roles/${id}`)
        toast.success('Role deleted successfully!')
        await this.fetchRoles()
        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to delete role', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    async fetchRole(id) {
      try {
        const res = await fetchWrapper.get(`/roles/${id}`)
        return { success: true, role: res.data }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch role', {
          description: errorMessage,
        })
        return { success: false, error }
      }
    },

    async fetchRolePermissions(id) {
      try {
        const res = await fetchWrapper.get(`/roles/${id}/permissions`)
        this.rolePermissions = res.data?.role?.permissions || []
        return { success: true, permissions: this.rolePermissions }
      } catch (error) {
        this.rolePermissions = []
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to fetch role permissions', {
          description: errorMessage,
        })
        return { success: false, error }
      }
    },

    async assignPermissionToRole(roleId, permissionId) {
      this.isLoading = true
      try {
        await fetchWrapper.post(`/roles/${roleId}/permissions/${permissionId}`, permissionId)
        toast.success('Permission assigned successfully!')

        await Promise.all([this.fetchRolePermissions(roleId), this.fetchRoles()])

        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to assign permission', {
          description: errorMessage,
        })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    async revokePermissionFromRole(roleId, permissionId) {
      this.isLoading = true
      try {
        await fetchWrapper.delete(`/roles/${roleId}/permissions/${permissionId}`)
        toast.success('Permission revoked successfully!')

        await Promise.all([this.fetchRolePermissions(roleId), this.fetchRoles()])

        return { success: true }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Something went wrong'
        toast.error('Failed to revoke permission', { description: errorMessage })
        return { success: false, error }
      } finally {
        this.isLoading = false
      }
    },

    async initializeData() {
      this.loading = true
      const permissionStore = usePermissionStore()
      try {
        await Promise.all([this.fetchRoles(), permissionStore.fetchPermissions()])
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
  },
})
