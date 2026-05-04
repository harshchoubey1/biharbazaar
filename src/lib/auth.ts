import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is not set in production. Please set it to a secure random string.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors back to login page
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string;
        const otp = credentials?.otp as string;
        if (!phone || !otp) return null;
        
        // Mock OTP: accept any 6-digit code
        if (otp.length !== 6) return null;

        let user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone,
              name: `User-${phone.slice(-4)}`,
              role: "customer",
            },
          });
        }
        return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
      },
    }),
    Credentials({
      id: "email-password",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.toLowerCase().trim();
        const password = credentials?.password as string;
        if (!email || !password) return null;

        // Hardcoded fallback for demo accounts to ensure they ALWAYS work
        const demoAccounts: Record<string, any> = {
          "admin@demo.com": { id: "demo-admin", name: "Demo Admin", email: "admin@demo.com", role: "admin", pw: "admin123" },
          "seller@demo.com": { id: "demo-seller", name: "Demo Seller", email: "seller@demo.com", role: "seller", pw: "seller123" },
          "user@demo.com": { id: "demo-user", name: "Demo User", email: "user@demo.com", role: "customer", pw: "user123" },
          "admin": { id: "demo-admin", name: "Demo Admin", email: "admin@demo.com", role: "admin", pw: "admin123" },
          "seller": { id: "demo-seller", name: "Demo Seller", email: "seller@demo.com", role: "seller", pw: "seller123" },
          "user": { id: "demo-user", name: "Demo User", email: "user@demo.com", role: "customer", pw: "user123" },
        };

        if (demoAccounts[email] && demoAccounts[email].pw === password) {
          // Check if user already exists in DB to get their real ID
          let dbUser = await prisma.user.findUnique({ where: { email: demoAccounts[email].email } });
          
          if (!dbUser) {
            // Create the demo user in the DB if it doesn't exist
            dbUser = await prisma.user.create({
              data: {
                id: demoAccounts[email].id, // Use the fixed demo ID
                email: demoAccounts[email].email,
                name: demoAccounts[email].name,
                role: demoAccounts[email].role,
                // No password needed for demo accounts in DB as they use credentials check
              }
            });
          }

          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
            role: dbUser.role
          };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
