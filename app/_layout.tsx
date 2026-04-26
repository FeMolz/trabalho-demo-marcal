import { Stack } from "expo-router";
import { CartProvider } from "../src/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffb6c1', 
          },
          headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: '#ffe4e1', 
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Produtos' }} />
        <Stack.Screen name="cart" options={{ title: 'Carrinho' }} />
        <Stack.Screen name="info" options={{ title: 'Informações do Grupo' }} />
      </Stack>
    </CartProvider>
  );
}
