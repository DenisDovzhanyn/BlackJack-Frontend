import { createContext } from "react"

export const isLoggedInContext = createContext({cookie: '', setCookie: (_value: string) => {}})