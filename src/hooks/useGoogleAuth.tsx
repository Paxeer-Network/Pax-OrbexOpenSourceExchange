import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import { useGoogleLogin } from "@react-oauth/google";
import $fetch from "@/utils/api";

export const googleClientId = process.env
  .NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";

export const useGoogleAuth = () => {
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      const { data, error } = await $fetch({
        url: "/api/auth/login/google",
        method: "POST",
        body: { token: access_token },
      });

      if (data && !error) {
        useDashboardStore.getState().setIsFetched(false);

        // Trigger profile fetch after successful login
        await useDashboardStore.getState().fetchProfile();
        const returnUrl = (router.query.return as string) || defaultUserPath;
        router.push(returnUrl);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login failed", errorResponse);
    },
  });

  return {
    handleGoogleLogin,
  };
};
