"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/"); 
    } else {
      setIsChecking(false); 
    }
  }, [router]);

  if (isChecking) {
    
    return null; 
  }

  return <>{children}</>;
};

export default AuthGuard;
