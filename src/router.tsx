import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth } from './components/auth/RequireAuth'
import { AppShell } from './components/layout/AppShell'
import { AccountPage } from './pages/AccountPage'
import { AddPlacePage } from './pages/AddPlacePage'
import { DiscoverPage } from './pages/DiscoverPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RestaurantPage } from './pages/RestaurantPage'
import { SavedPage } from './pages/SavedPage'
import { SignupPage } from './pages/SignupPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        // Everything else needs an account
        element: <RequireAuth />,
        children: [
          { path: '/', element: <DiscoverPage /> },
          { path: '/place/:id', element: <RestaurantPage /> },
          { path: '/saved', element: <SavedPage /> },
          { path: '/add', element: <AddPlacePage /> },
          { path: '/account', element: <AccountPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
