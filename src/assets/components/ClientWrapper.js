"use client"; // Mark this as a client component

import { ReduxProvider } from "@/redux/provider";
import Header from "@/assets/components/Header"; // Adjust the path as needed
import { usePathname } from 'next/navigation'; // Hook to get current path

const ClientWrapper = ({ children }) => {
  const pathname = usePathname(); // Get current path

  return (
    <ReduxProvider>
      {!pathname.startsWith('/auth') && <Header />}
      {children}
    </ReduxProvider>
  );
};

export default ClientWrapper;
