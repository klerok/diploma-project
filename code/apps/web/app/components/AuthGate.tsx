"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "../lib/api";
import { hasClientSession } from "../lib/auth";
import { LoginPrompt } from "./LoginPrompt";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      if (hasClientSession()) {
        setAuthed(true);
        return;
      }

      try {
        await getMe();
        setAuthed(true);
      } catch {
        setAuthed(false);
      }
    })();
  }, [pathname]);

  if (authed === null) {
    return <p className="container tab-panel-meta">Загрузка…</p>;
  }

  if (!authed) {
    return (
      <div className="container">
        <LoginPrompt from={pathname} />
      </div>
    );
  }

  return <>{children}</>;
}
