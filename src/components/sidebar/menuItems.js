import { MdSpaceDashboard } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { BsBuildings, BsBarChartFill,BsBank } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { PiUsersThreeBold } from "react-icons/pi";
import { TbArrowsShuffle } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { GiSettingsKnobs } from "react-icons/gi";
import { FaCogs, FaBoxes,FaHandshake } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { RiFileList3Line,RiBankFill  } from "react-icons/ri";
import { AiOutlineCalendar } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";

const sidebarConfig = [
  {
    path: "/console/dashboard",
    icon: <MdSpaceDashboard />,
    text: "Dashboard",
  },
  // {
  //   path: "/console/olddata",
  //   icon: <MdOutlineDashboard />,
  //   text: "Old Record",
  // },
  {
    path: "/console/user",
    icon: <FiUsers />,
    text: "User & Access",
  },
  {
    path: "/console/company",
    icon: <BsBuildings />,
    text: "Company",
  },
  {
    text: "Master",
    icon: <FaCogs />,
    subMenu: [
      {
        path: "/console/master/group",
        text: "Group",
        icon: <MdCategory />,
      },
      {
        path: "/console/master/products",
        icon: <FaBoxes />,
        text: "Products",
      },
      {
        path: "/console/master/action",
        icon: <GiSettingsKnobs />,
        text: "Action",
      },
      {
        path: "/console/master/bank",
        text: "Bank",
        icon: <RiBankFill />,
      },
      {
        path: "/console/master/bankpledgerdetails",
        text: "Bank Pledger Details",
        icon:<FaHandshake/>,
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
    icon: <PiUsersThreeBold />,
    text: "Customer",
  },
  {
    path: "/console/master/bankpledger",
    text: "Bank Pledger",
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

  // {
  //   path: "/console/pawn/bankpledge",
  //   text: "Bank Pledge",
  //   icon: <RiBankLine />,
  // },

  // {
  //   path: "/console/pawn/bankpledge",
  //   text: "Bank Pledge",
  //   icon: <AiFillGolden />,
  // },

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
    icon: <TbArrowsShuffle />,
    text: "Transaction",
  },
  {
    path: "/console/expense",
    text: "Expense",
    icon: <FaMoneyBillTrendUp />,
  },
  {
    text: "Reports",
    icon: <BsBarChartFill />,
    subMenu: [
      {
        path: "/console/report/balancesheet",
        text: "Balancesheet DayBook",
        icon: <MdOutlineDashboard />,
      },
      {
        path: "/console/advancereport/pawn",
        text: "Advance Report",
        icon: <FaChartLine />,
      },
      {
        path: "/console/report/bledge",
        text: "Bledge Report",
        icon: <RiFileList3Line />,
      },
      {
        path: "/console/report/dailyreport",
        text: "Daily Report",
        icon: <AiOutlineCalendar />,
      },
      {
        path: "/console/report/government",
        text: "Government Report",
        icon: <HiOutlineDocumentText />,
      },
    ],
  },
];

export default sidebarConfig;
