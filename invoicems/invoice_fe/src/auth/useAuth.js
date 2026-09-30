// src/auth/useAuth.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAccessToken } from '@/lib/cookies';

const unprotectedRoutes = ['/login', '/termsAndCondition'];

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    const isUnprotected = unprotectedRoutes.includes(router.pathname);

    if (!token && !isUnprotected) {
      router.replace('/login');
    }
  }, [router, router.pathname]);
};

export default useAuth;
