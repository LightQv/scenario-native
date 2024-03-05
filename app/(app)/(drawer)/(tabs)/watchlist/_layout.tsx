import { Stack } from "expo-router";

export default function WatchlistLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="[id]"
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="(modals)/create"
        options={{
          presentation: "modal",
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="(modals)/modify"
        options={{
          presentation: "modal",
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
