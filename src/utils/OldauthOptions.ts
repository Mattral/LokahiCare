
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

let users = [
  {
    id: 1,
    name: 'Mattral',
    email: 'minmattral@gmail.com',
    password: 'aAertyuiop@1' 
  },
  {
    id: 2,
    name: 'Min Htet Myet',
    email: 'mattralminn@gmail.com',
    password: '123456'
  }
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        const user = users.find(
          u => u.email === credentials?.email && u.password === credentials?.password
        );

        if (user) {
          // Return user object with `id` as string
          return {
            id: user.id.toString(), // Convert `id` to string
            name: user.name,
            email: user.email,
            accessToken: 'simulated-access-token', // Simulated token
          };
        } else {
          throw new Error('Invalid credentials');
        }
      }
    }),

    // Register provider
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        firstname: { name: 'firstname', label: 'Firstname', type: 'text', placeholder: 'Enter Firstname' },
        lastname: { name: 'lastname', label: 'Lastname', type: 'text', placeholder: 'Enter Lastname' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Enter Company' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        const newUser = {
          id: (users.length + 1).toString(), // Ensure id is a string
          name: `${credentials?.firstname} ${credentials?.lastname}`,
          email: credentials?.email,
          password: credentials?.password,
        };

        //users.push(newUser);

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          accessToken: 'simulated-access-token',
        };
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.id = token.id;
      session.token = token;
      return session;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
  },

  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },

  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};


