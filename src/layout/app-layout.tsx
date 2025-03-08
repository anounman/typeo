import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <div className="m-4 ">
      <Outlet />
      </div>
  )
}

export default AppLayout