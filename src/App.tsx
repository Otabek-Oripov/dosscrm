import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { AppShell } from "@/layout/AppShell"
import { Landing } from "@/pages/Landing"
import { Login } from "@/pages/Login"
import { NotFound } from "@/pages/NotFound"
import { Dashboard } from "@/pages/Dashboard"
import { Orders } from "@/pages/Orders"
import { Customers } from "@/pages/Customers"
import { Products } from "@/pages/Products"
import { Inventory } from "@/pages/Inventory"
import { Users } from "@/pages/Users"
import { ActivityPage } from "@/pages/Activity"
import { Reports } from "@/pages/Reports"
import { Settings } from "@/pages/Settings"
import { Profile } from "@/pages/Profile"

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <Landing />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ActivityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
