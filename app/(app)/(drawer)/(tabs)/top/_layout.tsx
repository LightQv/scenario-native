import { Stack } from "expo-router";

export default function TopLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerTitle: "", headerTransparent: true }}
      />
    </Stack>
  );
}
