import { createContext } from "react"

export const isLoggedInContext = createContext({id: '', setId: (_value: string) => {}})