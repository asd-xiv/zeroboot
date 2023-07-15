import { FC, ReactNode } from "react"

export type FCWithChildren<T = unknown> = FC<T & { children?: ReactNode }>
