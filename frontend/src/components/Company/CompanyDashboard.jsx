import React from 'react'
import { CompanyNavbar } from './CompanyNavbar'

export const CompanyDashboard = ({sidebarToggle,setSidebarToggle}) => {
  return (
    <div className={`${sidebarToggle? "ml-64":""} w-full d-flex`}>
        <CompanyNavbar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        />
    </div>
  )
}
