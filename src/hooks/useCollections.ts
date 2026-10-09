import { collectionService } from '../services'
import { useAsync } from './useAsync'

export function useCollections() {
  return useAsync('collections', () => collectionService.listCollections())
}
