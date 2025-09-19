import { create } from 'zustand'

// Define the store shape with types (optional but recommended)
export type Store = {
  isGapiLoaded: boolean
  setIsGapiLoaded: (val: boolean) => void
  isGoogleLoaded: boolean
  setIsGoogleLoaded: (val: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (val: boolean) => void
}

const useStore = create<Store>((set) => ({
  isGapiLoaded: false,
  setIsGapiLoaded: (val) => set(() => ({ isGapiLoaded: val })),
  isGoogleLoaded: false,
  setIsGoogleLoaded: (val) => set(() => ({ isGoogleLoaded: val })),
  isAuthenticated: false,
  setIsAuthenticated: (val) => set(() => ({ isAuthenticated: val })),
}))

export default useStore;