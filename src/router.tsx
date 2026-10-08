import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AddPlacePage } from './pages/AddPlacePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RestaurantPage } from './pages/RestaurantPage'
import { SavedPage } from './pages/SavedPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/place/:id', element: <RestaurantPage /> },
      { path: '/saved', element: <SavedPage /> },
      { path: '/add', element: <AddPlacePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
