import { createContext, useContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
const User = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem('organization',JSON.stringify(action.value))
      localStorage.setItem('token',action.token)
      return { ...state, isLoggedIn: true, organization: action.value };
    }
    case "LOGOUT": {
      localStorage.removeItem('organization')
      localStorage.removeItem('token')
      return { ...state, isLoggedIn: false, organization: null };
    }
    case "LIST_BRANDS": {
      return { ...state, brands: action.value };
    }
    case "LIST_SALESMAN": {
      return { ...state, salesman: action.value };
    }
    case "LIST_SHOPS": {
      return { ...state, shops: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

let organization = localStorage.getItem('organization') || null
let token = localStorage.getItem('token') || null
if(organization) organization = JSON.parse(organization)
function UserControllerProvider({ children }) {
  const initialState = {
    isLoggedIn: !!organization && !!token,
    organization: organization,
    brands: [],
    salesman: [],
    shops: []
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <User.Provider value={value}>{children}</User.Provider>;
}

function useUserController() {
  const context = useContext(User);
  if (!context) {
    throw new Error("useUserController should be used inside the UserControllerProvider.");
  }
  return context;
}

UserControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const setLogin = (dispatch, value, token) => dispatch({ type: "LOGIN", value, token });
const setLogout = (dispatch) => dispatch({ type: "LOGOUT" });
const listBrands = (dispatch, value) => dispatch({ type: "LIST_BRANDS", value });
const listSalesman = (dispatch, value) => dispatch({ type: "LIST_SALESMAN", value });
const listShops = (dispatch, value) => dispatch({ type: "LIST_SHOPS", value });

export {
  UserControllerProvider,
  useUserController,
  setLogin,
  setLogout,
  listBrands,
  listSalesman,
  listShops
};
