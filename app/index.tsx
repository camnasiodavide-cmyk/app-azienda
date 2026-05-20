import { Stack } from "expo-router";
import { useState } from "react";
import Home from "./home";
import Login from "./login";

export default function Index() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />

      {user 
        ? <Home user={user} setUser={setUser} /> 
        : <Login setUser={setUser} />
      }
    </>
  );
}
