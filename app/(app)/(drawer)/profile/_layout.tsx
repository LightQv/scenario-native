import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="[type]"
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerTitle: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="(modals)/banner"
        options={{
          presentation: "modal",
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="(modals)/email"
        options={{
          presentation: "modal",
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="(modals)/password"
        options={{
          presentation: "modal",
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="(modals)/delete"
        options={{
          presentation: "modal",
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
