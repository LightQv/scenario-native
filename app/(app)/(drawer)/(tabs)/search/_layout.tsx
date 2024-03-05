import { SearchHistoryProvider } from "@/app/context/SearchHistoryContext";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <SearchHistoryProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerTitle: "", headerTransparent: true }}
        />
        <Stack.Screen
          name="query"
          options={{
            headerTitle: "",
            header: () => null,
          }}
        />
      </Stack>
    </SearchHistoryProvider>
  );
}
