import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import ApiContext from "../Context/ApiContext";
import ItemsContext from "../Context/ItemsContext";
import ErrorContext from "../Context/ErrorContext";

const useAuthContext = () => { return useContext(AuthContext) }
const useApiContext = () => { return useContext(ApiContext) }
const useItemsContext = () => { return useContext(ItemsContext) }
const useErrorContext = () => { return useContext(ErrorContext) }

export { useAuthContext, useApiContext, useItemsContext, useErrorContext }