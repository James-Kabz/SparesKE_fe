import router from '@/router'
import { toast } from '@stlhorizon/vue-ui'

const baseUrl = `${import.meta.env.VITE_API_URL}`

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
  postFile,
  downloadFile,
  viewFile,
}

function get(url) {
  return request('GET', url)
}

function post(url, body) {
  return request('POST', url, body)
}

function put(url, body) {
  return request('PUT', url, body)
}

function _delete(url) {
  return request('DELETE', url)
}

function postFile(url, formData) {
  return requestFile('POST', url, formData)
}

function downloadFile(url, filename = null) {
  return requestBlob('GET', url, filename, true)
}

function viewFile(url) {
  return requestBlob('GET', url, null, false)
}

async function request(method, url, body) {
  const requestOptions = {
    method,
    headers: authHeader(url),
  }

  if (body) {
    requestOptions.headers['Content-Type'] = 'application/json'
    requestOptions.body = JSON.stringify(body)
  }

  const response = await fetch(`${baseUrl}${url}`, requestOptions)
  let data

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const status = response.status

    switch (status) {
      case 401: // Unauthorized
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // toast.error("Session expired", { description: "Please login again." })
        router.push('/')
        break

      case 403: // Forbidden → no role/permission
        toast.error('Cannot Access')
        router.push('/not-found')
        break

      case 404: // Not Found
        toast.error('Not Found', { description: 'Resource not found.' })
        router.push('/not-found')
        break

      case 409: {
        const conflictMsg = data?.message || 'Conflict Error'
        toast.error('Conflict Error', { description: conflictMsg })
        break
      }

      case 422: {
        const validationMsg =
          data?.errors && Object.values(data.errors)[0]?.[0]
            ? Object.values(data.errors)[0][0]
            : data?.message || 'Validation failed.'
        toast.error('Validation Error', { description: validationMsg })
        break
      }

      case 500: // Server error
        toast.error('Server Error', {
          description: 'Something went wrong. Please try again later.',
        })
        router.push('/server-error')
        break

      default:
        toast.error('Error', {
          description: data?.message || response.statusText,
        })
        router.push('/service-unavailable')
        break
    }

    return Promise.reject({
      response: {
        status,
        data: data || { message: response.statusText },
      },
    })
  }

  return data
}

async function requestFile(method, url, formData) {
  const requestOptions = {
    method,
    headers: authHeader(url),
    body: formData, // FormData handles its own Content-Type with boundary
  }

  // Don't set Content-Type for FormData - browser sets it automatically with boundary
  // This is critical for multipart/form-data to work correctly

  const response = await fetch(`${baseUrl}${url}`, requestOptions)
  let data

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const status = response.status

    switch (status) {
      case 401: // Unauthorized
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/')
        break

      case 403: // Forbidden → no role/permission
        toast.error('Cannot Access')
        router.push('/not-found')
        break

      case 404: // Not Found
        toast.error('Not Found', { description: 'Resource not found.' })
        router.push('/not-found')
        break

      case 409: {
        const conflictMsg = data?.message || 'Conflict Error'
        toast.error('Conflict Error', { description: conflictMsg })
        break
      }

      case 422: {
        const validationMsg =
          data?.errors && Object.values(data.errors)[0]?.[0]
            ? Object.values(data.errors)[0][0]
            : data?.message || 'Validation failed.'
        toast.error('Validation Error', { description: validationMsg })
        break
      }

      case 413: // Payload Too Large
        toast.error('File Too Large', {
          description: 'The file you are trying to upload is too large.',
        })
        break

      case 415: // Unsupported Media Type
        toast.error('Invalid File Type', {
          description: 'The file type you are trying to upload is not supported.',
        })
        break

      case 500: // Server error
        toast.error('Server Error', {
          description: 'Something went wrong. Please try again later.',
        })
        router.push('/server-error')
        break

      default:
        toast.error('Error', {
          description: data?.message || response.statusText,
        })
        router.push('/service-unavailable')
        break
    }

    return Promise.reject({
      response: {
        status,
        data: data || { message: response.statusText },
      },
    })
  }

  return data
}

async function requestBlob(method, url, filename = null, download = false) {
  const requestOptions = {
    method,
    headers: authHeader(url),
  }

  const response = await fetch(`${baseUrl}${url}`, requestOptions)

  if (!response.ok) {
    let data
    try {
      data = await response.json()
    } catch {
      data = null
    }

    const status = response.status

    switch (status) {
      case 401: // Unauthorized
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/')
        break

      case 403: // Forbidden → no role/permission
        toast.error('Cannot Access')
        router.push('/not-found')
        break

      case 404: // Not Found
        toast.error('Not Found', { description: 'Resource not found.' })
        router.push('/not-found')
        break

      default:
        toast.error('Error', {
          description: data?.message || response.statusText,
        })
        break
    }

    return Promise.reject({
      response: {
        status,
        data: data || { message: response.statusText },
      },
    })
  }

  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)

  if (download) {
    // Create download link
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } else {
    // Open in new tab for viewing
    window.open(blobUrl, '_blank')
  }

  return { success: true, blobUrl }
}

function authHeader(url) {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token
  const isApiUrl = url.startsWith('/')

  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}
