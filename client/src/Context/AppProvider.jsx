import { ApiProvider } from "./ApiContext";
import { AuthProvider } from "./AuthContext";
import { ErrorProvider } from "./ErrorContext";
import { ItemsProvider } from "./ItemsContext";

const AppProvider = ({ children }) => {
    return <ErrorProvider>
        <AuthProvider>
            <ApiProvider>
                <ItemsProvider>
                    { children }
                </ItemsProvider>
            </ApiProvider>
        </AuthProvider>
    </ErrorProvider>
}

export default AppProvider;