/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import Brands from "./layouts/brands";
import Billing from "./layouts/billing";
import Profile from "./layouts/profile";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";

// Soft UI Dashboard React icons
import Shop from "./examples/Icons/Shop";
import Office from "./examples/Icons/Office";
import Document from "./examples/Icons/Document";
import SpaceShip from "./examples/Icons/SpaceShip";
import CustomerSupport from "./examples/Icons/CustomerSupport";
import CreditCard from "./examples/Icons/CreditCard";
import Salesman from "./layouts/salesman";
import ShopPage from "./layouts/shop";
import SuperStocker from "./layouts/superstocker";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AppsIcon from '@mui/icons-material/Apps';
import Products from "./layouts/products";
import Purchase from "./layouts/purchase";
import Shop2Icon from '@mui/icons-material/Shop2';
import Sales from "./layouts/sales";
import SellIcon from '@mui/icons-material/Sell';

const routes = [
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   privateroute: "/dashboard",
  //   icon: <Shop size="12px" />,
  //   component: <Dashboard />,
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Brands",
    key: "brands",
    route: "/brands",
    icon: <AccountTreeIcon size="12px" />,
    component: <Brands />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Salesman",
    key: "salesman",
    route: "/salesman",
    icon: <DirectionsRunIcon size="12px" />,
    component: <Salesman />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Shop",
    key: "shop",
    route: "/shop",
    icon: <ShoppingBasketIcon size="12px" />,
    component: <ShopPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Super Stocker",
    key: "super-stocker",
    route: "/super-stocker",
    icon: <Inventory2Icon size="12px" />,
    component: <SuperStocker />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Products",
    key: "products",
    route: "/products",
    icon: <AppsIcon size="12px" />,
    component: <Products />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Purchase",
    key: "purchase",
    route: "/purchase",
    icon: <Shop2Icon size="12px" />,
    component: <Purchase />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sales",
    key: "sales",
    route: "/sales",
    icon: <SellIcon size="12px" />,
    component: <Sales />,
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   route: "/tables",
  //   icon: <Office size="12px" />,
  //   component: <Tables />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   route: "/billing",
  //   icon: <CreditCard size="12px" />,
  //   component: <Billing />,
  //   noCollapse: true,
  // },
  { type: "title", title: "Account Pages", key: "account-pages" },
  { type: "logout", title: "Logout", key: "logout" },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   route: "/profile",
  //   icon: <CustomerSupport size="12px" />,
  //   component: <Profile />,
  //   noCollapse: true,
  // },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    authprivateroute: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    authprivateroute: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;
