import { restaurantService } from '../services'
import { useAsync } from './useAsync'

export function useRestaurant(id: string) {
  return useAsync(`restaurant:${id}`, () => restaurantService.getRestaurant(id))
}
