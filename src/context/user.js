import { createContext, useContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
const User = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem('organization',JSON.stringify(action.value))
      return { ...state, isLoggedIn: true, organization: action.value };
    }
    case "LOGOUT": {
      localStorage.removeItem('organization')
      return { ...state, isLoggedIn: false, organization: null };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

let organization = localStorage.getItem('organization') || null
if(organization) organization = JSON.parse(organization)
function UserControllerProvider({ children }) {
  const initialState = {
    isLoggedIn: !!organization,
    organization: organization,
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

const setLogin = (dispatch, value) => dispatch({ type: "LOGIN", value });
const setLogout = (dispatch) => dispatch({ type: "LOGOUT" });

export {
  UserControllerProvider,
  useUserController,
  setLogin,
  setLogout
};
