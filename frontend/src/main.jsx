import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  persistQueryClient
} from "@tanstack/react-query-persist-client";

import {
  createSyncStoragePersister
} from "@tanstack/query-sync-storage-persister";

import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/auth.css";
import "./styles/utilities.css";

import ErrorBoundary from "./ErrorBoundary";

/* ================= QUERY CLIENT ================= */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutes fresh
      cacheTime: 1000 * 60 * 30,    // 30 minutes cache
      refetchOnWindowFocus: false
    }
  }
});

/* ================= CACHE PERSISTENCE ================= */

const persister = createSyncStoragePersister({
  storage: window.localStorage
});

persistQueryClient({
  queryClient,
  persister
});

/* ================= APP RENDER ================= */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>

      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>

    </QueryClientProvider>
  </React.StrictMode>
);