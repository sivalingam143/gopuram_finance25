import {
  MdOutlineDashboard,
  MdOutlinePerson,
  MdOutlineStorefront,
} from "react-icons/md";
import { FaSquarePlus, FaPersonCircleQuestion } from "react-icons/fa6";
import { AiFillGolden } from "react-icons/ai";
import { RiDeviceRecoverLine } from "react-icons/ri";
import { LuMousePointer2 } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { IoMdCash } from "react-icons/io";

const sidebarConfig = [
  {
    path: "/console/dashboard",
    icon: <MdOutlineDashboard />,
    text: "Dashboard",
  },
  // {
  //   path: "/console/olddata",
  //   icon: <MdOutlineDashboard />,
  //   text: "Old Record",
  // },
  {
    path: "/console/user",
    icon: <MdOutlinePerson />,
    text: "User & Access",
  },
  {
    path: "/console/company",
    icon: <MdOutlineStorefront />,
    text: "Company",
  },
  {
    text: "Master",
    icon: <FaSquarePlus />,
    subMenu: [
      {
        path: "/console/master/group",
        text: "Group",
      },
      {
        path: "/console/master/products",

        text: "Products",
      },
      {
        path: "/console/master/action",
        text: "Action",
      },
      {
        path: "/console/master/bank",
        text: "Bank",
      },
      {
        path: "/console/master/bankpledgerdetails",
        text: "Bank Pledger Details",
      },
      // {
      //   path: "/console/master/customer",

      //   text: "Customer",
      // },
      // {
      //   path: "/console/master/Street",

      //   text: "Street",
      // },
    ],
  },
  {
    path: "/console/master/customer",
    text: "customer",
    icon: <FiUsers />,
  },
  // {
  //   path: "/console/pawn/jewelpawning",
  //   text: "Loan",
  //   icon: <AiFillGolden />,
  //   subMenu: [
  //     {
  //       path: "/console/pawn/jewelpawning",
  //       icon: <AiFillGolden />,
  //       text: "Jewelry pawn",
  //     },
  //     // {
  //     //   path: "/console/pawn/jewelpawng",
  //     //   icon: <AiFillGolden />,
  //     //   text: "நகை அடகு - G",
  //     // },
  //   ],
  // },
  {
    path: "/console/pawn/bankpledge",
    text: "Bank Pledge",
    icon: <AiFillGolden />,
  },

  // {
  //   text: "Interest | Closing",
  //   icon: <IoMdCash />,
  //   subMenu: [
  //     {
  //       path: "/console/interest",
  //       text: "Interest",
  //     },
  //     {
  //       path: "/console/master/jewelrecovery",
  //       text: "Loan Closing",
  //     },
  //   ],
  // },

  {
    path: "/console/transaction",
    icon: <FaPersonCircleQuestion />,
    text: "Transaction",
  },
  {
    path: "/console/expense",
    text: "Expense",
    icon: <IoMdCash />,
  },
  {
    text: "Reports",
    icon: <FaSquarePlus />,
    subMenu: [
      {
        path: "/console/report/balancesheet",
        text: "balancesheet DayBook",
      },
      {
        path: "/console/advancereport/pawn",
        text: "Advance Report",
      },
      {
        path: "/console/report/bledge",
        text: "Bledge Report",
      },
      {
        path: "/console/report/dailyreport",
        text: "Daily Report",
      },
      {
        path: "/console/report/government",
        text: "Government Report",
      },
    ],
  },
];

export default sidebarConfig;
