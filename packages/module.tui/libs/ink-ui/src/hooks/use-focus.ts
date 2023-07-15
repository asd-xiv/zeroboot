import { useFocus as useInkFocus } from "ink"
import { useId } from "react"

type UseFocus = (
  ...props: Parameters<typeof useInkFocus>
) => { focusId: string } & ReturnType<typeof useInkFocus>

export const useFocus: UseFocus = ({ id, ...rest } = {}) => {
  const autoId = useId()
  const focusId = id ?? autoId

  return {
    focusId,
    ...useInkFocus({ id: focusId, ...rest }),
  }
}
