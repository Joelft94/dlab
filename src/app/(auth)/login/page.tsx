"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", formData)

    try {
      await login(formData.username, formData.password)
      // Redirect is handled in the auth hook
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A2A2A]">
      <div className="w-full max-w-md">
        <div className="bg-[#1E1E1E] p-8 rounded-lg shadow-lg">
          <div className="mb-8 flex justify-center">
            <Image width={500} height={500} src="/dtalent-logo.png" alt="dTalent" className="h-10" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="username"
                type="text"
                placeholder="Número de documento"
                value={formData.username}
                onChange={handleChange}
                className="bg-[#2A2A2A] border-0 text-white placeholder:text-gray-400 h-12"
                required
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#2A2A2A] border-0 text-white placeholder:text-gray-400 h-12"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#4880F8] hover:bg-[#4070E8] text-white h-12"
              disabled={isLoading}
            >
              {isLoading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}
            </Button>
            <div className="text-center">
              <a href="#" className="text-sm text-[#4880F8] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}