import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { getUiLanguage, t } from "./Utils/i18n";

document.title = t("newtab_title");
const uiLanguage = getUiLanguage();
if (uiLanguage) {
    document.documentElement.lang = uiLanguage;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
