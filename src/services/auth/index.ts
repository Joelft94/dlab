import type { LoginResponse } from "@/types/api"
import axiosInstance from "../config/axios"
import { ENDPOINTS } from "../config/endpoints"
import Cookies from 'js-cookie'

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log("Making login request...")
    const response = await axiosInstance.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    })
    
    console.log("Login response:", response.data)
    
    if (response.data.token) {
      // Set both cookie and localStorage
      Cookies.set('token', response.data.token, { secure: true, sameSite: 'lax' })
      localStorage.setItem("token", response.data.token)
      axiosInstance.defaults.headers.common["Authorization"] = `Token ${response.data.token}`
    }
    
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const logout = () => {
  Cookies.remove('token')
  localStorage.removeItem('token')
  delete axiosInstance.defaults.headers.common["Authorization"]
}