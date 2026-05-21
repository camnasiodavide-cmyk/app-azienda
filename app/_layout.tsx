import { UserProvider, useUser } from "@/context/UserContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

function AuthGuard() {
  const { user } = useUser();
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/home");
    }
  }, [user, segments, ready]);

  return <Slot />;
}

export default function Layout() {
  return (
    <UserProvider>
      <AuthGuard />
    </UserProvider>
  );
}