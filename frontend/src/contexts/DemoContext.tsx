"use client";

import { createContext, useContext, useState } from "react";
import { DEMO_EMPLOYER, DEMO_EMPLOYEE } from "@/lib/demoAccounts";

type Role = "employer" | "employee" | null;

interface DemoContextValue {
  role: Role;
  address: `0x${string}` | undefined;
  setRole: (role: Role) => void;
  disconnect: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);

  const address =
    role === "employer"
      ? DEMO_EMPLOYER.address
      : role === "employee"
      ? DEMO_EMPLOYEE.address
      : undefined;

  const setRole = (r: Role) => setRoleState(r);
  const disconnect = () => setRoleState(null);

  return (
    <DemoContext.Provider value={{ role, address, setRole, disconnect }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoWallet() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoWallet must be used within DemoProvider");
  return ctx;
}
