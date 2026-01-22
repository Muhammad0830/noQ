import { supabase } from "../config/supabase.js";

export async function authMiddleware(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = data.user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth middleware error" });
  }
}
