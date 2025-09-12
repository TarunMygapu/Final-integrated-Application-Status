import React from "react";
import { NavLink } from "react-router-dom";

import AssetsManagement from "../../Asserts/Sidebar/AssetsManagement.svg";
import Cctv from "../../Asserts/Sidebar/Cctv.svg";
import Dashboard from "../../Asserts/Sidebar/Dashboard.svg";
import Employee from "../../Asserts/Sidebar/Employee.svg";
import Fleet from "../../Asserts/Sidebar/Fleet.svg";
import HRMS from "../../Asserts/Sidebar/HRMS.svg";
import Masters from "../../Asserts/Sidebar/Masters.svg";
import PaymentService from "../../Asserts/Sidebar/Payment Services.svg";
import Questionbank from "../../Asserts/Sidebar/QuestionBank.svg";
import Sms from "../../Asserts/Sidebar/Sms.svg";
import Student from "../../Asserts/Sidebar/Student.svg";
import WareHouse from "../../Asserts/Sidebar/Warehouse.svg";

import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { id: 1, title: "Dashboard", icon: Dashboard, path: "/dashboard" },
    { id: 2, title: "Students", icon: Student, path: "/students" },
    { id: 3, title: "Application", icon: Questionbank, path: "/application" },
    { id: 4, title: "Employee", icon: Employee, path: "/employee" },
    { id: 5, title: "Fleet", icon: Fleet, path: "/fleet" },
    { id: 6, title: "Warehouse", icon: WareHouse, path: "/warehouse" },
    { id: 7, title: "SMS", icon: Sms, path: "/sms" },
    { id: 8, title: "Question Bank", icon: Questionbank, path: "/question-bank" },
    { id: 9, title: "Assets Management", icon: AssetsManagement, path: "/assets" },
    { id: 10, title: "Payment Services", icon: PaymentService, path: "/payments" },
    { id: 11, title: "CCTV", icon: Cctv, path: "/cctv" },
    { id: 12, title: "HRMS", icon: HRMS, path: "/hrms" },
    { id: 13, title: "Masters", icon: Masters, path: "/masters" },
  ];

  return (
    <aside className="sidebar mt-5">
      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.id} className="menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <figure className="icon-wrapper">
                <img src={item.icon} alt={item.title} className="icon" />
              </figure>
              <span className="title">{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
