import { cafeService } from '../services'
import { useAsync } from './useAsync'

export function useCafe(id: string) {
  return useAsync(`cafe:${id}`, () => cafeService.getCafe(id))
}
