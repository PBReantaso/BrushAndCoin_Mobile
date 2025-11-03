import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    user_type: string;
    is_verified: boolean;
    profile_image_url?: string;
    bio?: string;
    location_address?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      username?: string;
      user_type: string;
      is_verified: boolean;
      profile_image_url?: string;
      bio?: string;
      location_address?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    first_name: string;
    last_name: string;
    username?: string;
    user_type: string;
    is_verified: boolean;
    profile_image_url?: string;
    bio?: string;
    location_address?: string;
  }
}