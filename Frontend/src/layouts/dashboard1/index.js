/* eslint-disable react/prop-types */
import React from "react";
import EcommerceMetrics from "components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "components/ecommerce/MonthlySalesChart";
import StatisticsChart from "components/ecommerce/StatisticsChart";
import MonthlyTarget from "components/ecommerce/MonthlyTarget";
import RecentOrders from "components/ecommerce/RecentOrders";
import DemographicCard from "components/ecommerce/DemographicCard";
import PageMeta from "components/common/PageMeta";

// Layout dari Material Dashboard
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export default function Dashboard1() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageMeta
        title="Manage Company Dashboard"
        description="Dashboard utama untuk mengelola data project dan user"
      />
      <div className="p-6 grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}
