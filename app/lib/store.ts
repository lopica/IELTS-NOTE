import { create } from 'zustand'

// Define the store shape with types (optional but recommended)
export type Store = {
  tokenClient: any | null
  setTokenClient: (val: object) => void
  gapi: any | null
  setGapi: (val: object) => void
  google: any | null
  setGoogle: (val: object) => void
}

const useStore = create<Store>((set) => ({
  tokenClient: null,
  setTokenClient: (val) => set(() => ({ tokenClient: val })),
  gapi: null,
  setGapi: (val) => set(() => ({ gapi: val })),
  google: null,
  setGoogle: (val) => set(() => ({ google: val })),
}))

export default useStore;