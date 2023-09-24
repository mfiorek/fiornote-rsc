import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { SendVerificationRequestParams } from "next-auth/providers";
import { Resend } from "resend";
import { env } from "../env/server.mjs";
import { db } from "../db/db";

export const resend = new Resend(env.RESEND_API_KEY);

const sendVerificationRequest = async (
  params: SendVerificationRequestParams
) => {
  try {
    await resend.emails.send({
      from: "fiornote@fiorek.codes",
      to: params.identifier,
      subject: "fiornote - Login Magic Link",
      html: `Please click here to authenticate and log in: ${params.url}`,
    });
  } catch (error) {
    console.log({ error });
  }
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    // verifyRequest: "/checkyouremail",
  },
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    EmailProvider({
      name: "email",
      server: "",
      from: "fiornote@fiorek.codes",
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const u = user;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
};
