/* eslint-disable react-hooks/exhaustive-deps  */

import { EffectCallback, useEffect } from "react"

type UseMount = (effect: EffectCallback) => void

export const useMount: UseMount = effect => useEffect(effect, [])
