import { createContext, useState, useMemo } from "react"

import { FCWithChildren } from "../../types/react.js"

type InputManagerContext = {
  activeInputId?: string
  setActiveInputId: (id: string) => void
}

export const inputManagerContext = createContext<
  InputManagerContext | undefined
>(undefined)

export const InputManagerProvider: FCWithChildren = ({ children }) => {
  const [id, setId] = useState<string | undefined>()

  const value = useMemo<InputManagerContext>(
    () => ({
      activeInputId: id,
      setActiveInputId: setId,
    }),
    [id, setId]
  )

  return (
    <inputManagerContext.Provider value={value}>
      {children}
    </inputManagerContext.Provider>
  )
}
