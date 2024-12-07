
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



/*
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios'; // Make sure axios is installed and imported

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    // Login provider
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const data = new FormData();
          data.append('email', credentials?.email ?? '');
          data.append('password', credentials?.password ?? '');

          // Login API call
          const response = await axios({
            method: 'post',
            url: 'https://lawonearth.co.uk/api/auth/core/login',
            headers: {
              'COMPANY-CODE': 'def-mc-admin',
              'FRONTEND-KEY': 'XXX',///process.env.FRONTEND_KEY, // Replace with your actual FRONTEND-KEY
              //'Authorization': `Bearer ${process.env.BEARER_TOKEN}` // Optional if required
            },
            data: data
          });

          // Assuming API returns user data and serviceToken
          const user = response.data.user;
          const accessToken = response.data.serviceToken;

          if (user && accessToken) {
            // Return user data along with accessToken
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              accessToken: accessToken
            };
          } else {
            throw new Error('Failed to login');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed');
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
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' },
        password_confirmation: { name: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: 'Confirm Password' }
      },
      async authorize(credentials) {
        try {
          const data = new FormData();
          data.append('pers_fName', credentials?.firstname ?? '');
          data.append('pers_lName', credentials?.lastname ?? '');
          data.append('email', credentials?.email ?? '');
          data.append('password', credentials?.password ?? '');
          data.append('password_confirmation', credentials?.password_confirmation ?? '');

          // Register API call
          const response = await axios({
            method: 'post',
      
            headers: {
              'COMPANY-CODE': 'def-mc-admin',
              'FRONTEND-KEY': 'XXX',//process.env.FRONTEND_KEY,
              //'Authorization': `Bearer ${process.env.BEARER_TOKEN}` // Optional if required
            },
            data: data
          });

          // Assuming API returns user data
          const user = response.data.user;
          const accessToken = response.data.serviceToken;

          if (user && accessToken) {
            return {
              id: user.id.toString(),
              name: `${credentials?.firstname} ${credentials?.lastname}`,
              email: user.email,
              accessToken: accessToken
            };
          } else {
            throw new Error('Failed to register');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
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
*/

