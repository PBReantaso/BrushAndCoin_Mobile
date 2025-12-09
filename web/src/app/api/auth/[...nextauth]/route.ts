import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔧 authorize called with:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('🔧 Missing credentials');
          return null;
        }

        // Check if database is available
        const hasDatabase = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';
        
        // Mock authentication for development when database is not available
        if (process.env.NODE_ENV === 'development' && !hasDatabase) {
          console.log('🔧 Using mock authentication (no database configured)');
          
          // Mock users for development
          const mockUsers = [
            {
              email: 'test@example.com',
              password: 'password123', // Plain text for mock
              first_name: 'Test',
              last_name: 'User',
              username: 'testuser',
              user_type: 'artist',
            },
            {
              email: 'admin@example.com',
              password: 'admin123',
              first_name: 'Admin',
              last_name: 'User',
              username: 'admin',
              user_type: 'admin',
            },
            {
              email: 'client@example.com',
              password: 'client123',
              first_name: 'Client',
              last_name: 'User',
              username: 'client',
              user_type: 'client',
            }
          ];

          const mockUser = mockUsers.find(u => u.email === credentials.email);
          
          if (mockUser && mockUser.password === credentials.password) {
            console.log('🔧 Mock authentication successful');
            return {
              id: '1',
              email: mockUser.email,
              name: `${mockUser.first_name} ${mockUser.last_name}`,
              first_name: mockUser.first_name,
              last_name: mockUser.last_name,
              username: mockUser.username,
              user_type: mockUser.user_type,
              is_verified: true,
              profile_image_url: null,
              bio: null,
              location_address: null,
            };
          }
          
          console.log('🔧 Mock authentication failed - invalid credentials');
          return null;
        }

        try {
          // Query user from your existing users table
          const result = await query(
            `SELECT id, email, password, first_name, last_name, username, 
                    user_type, is_verified, profile_image_url, bio, 
                    location_address, created_at 
             FROM users 
             WHERE email = $1 AND is_active = true`,
            [credentials.email]
          );

          const user = result.rows[0];
          console.log('🔧 User found:', !!user);

          if (!user) {
            console.log('🔧 No user found with this email');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('🔧 Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('🔧 Invalid password');
            return null;
          }

          // Return user object without password
          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            user_type: user.user_type,
            is_verified: user.is_verified,
            profile_image_url: user.profile_image_url,
            bio: user.bio,
            location_address: user.location_address,
          };
        } catch (error) {
          console.error('🔧 Auth error:', error);
          // Fall back to mock auth in development if database fails
          if (process.env.NODE_ENV === 'development') {
            console.log('🔧 Database error, falling back to mock authentication');
            const mockUsers = [
              {
                email: 'test@example.com',
                password: 'password123',
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser',
                user_type: 'artist',
              }
            ];
            const mockUser = mockUsers.find(u => u.email === credentials.email);
            if (mockUser && mockUser.password === credentials.password) {
              return {
                id: '1',
                email: mockUser.email,
                name: `${mockUser.first_name} ${mockUser.last_name}`,
                first_name: mockUser.first_name,
                last_name: mockUser.last_name,
                username: mockUser.username,
                user_type: mockUser.user_type,
                is_verified: true,
                profile_image_url: null,
                bio: null,
                location_address: null,
              };
            }
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  callbacks: {
  async jwt({ token, user }) {
    console.log('🔧 JWT callback - user:', user);
    
    if (user) {
      token.id = user.id;
      token.first_name = user.first_name;
      token.last_name = user.last_name;
      token.username = user.username;
      token.user_type = user.user_type;
      token.is_verified = user.is_verified;
      token.profile_image_url = user.profile_image_url;
      token.bio = user.bio;
      token.location_address = user.location_address;
    }
    
    return token;
  },
  
  async session({ session, token }) {
    console.log('🔧 Session callback - token:', token);
    
    if (token) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        first_name: token.first_name as string,
        last_name: token.last_name as string,
        username: token.username as string,
        user_type: token.user_type as string,
        is_verified: token.is_verified as boolean,
        profile_image_url: token.profile_image_url as string,
        bio: token.bio as string,
        location_address: token.location_address as string,
      };
    }
    return session;
  },
},
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
