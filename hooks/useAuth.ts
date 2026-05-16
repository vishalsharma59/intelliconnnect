'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState, AppDispatch } from '@store/index'
import { login, register, logout, getCurrentUser } from '@store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, loading, error, accessToken } = useSelector(
    (state: RootState) => state.auth
  )

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null

    if (token && !user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, user])

  const handleLogin = (email: string, password: string) => {
    return dispatch(login({ email, password }))
  }

  const handleRegister = (userData: {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
  }) => {
    return dispatch(register(userData))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    accessToken,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}
