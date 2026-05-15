import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "./constants";

export async function hasServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(TOKEN_COOKIE)?.value);
}
