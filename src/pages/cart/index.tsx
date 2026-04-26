import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useCart } from '../../contexts/CartContext';
import { Stack, useRouter } from 'expo-router';

export default function CartScreen() {
  const { cart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const categories = useMemo(() => {
    const cats = new Set(cart.map((item) => item.category));
    return Array.from(cats);
  }, [cart]);

  const filteredCart = useMemo(() => {
    if (!selectedCategory) return cart;
    return cart.filter((item) => item.category === selectedCategory);
  }, [cart, selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };

  const renderCartItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: 'https://veja.abril.com.br/wp-content/uploads/2025/07/vampeta-tvpop.jpg?crop=1&resize=1212,909' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productPrice}>
            {formatPrice(item.price * 63)} x {item.quantity}
          </Text>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const total = filteredCart.reduce((sum, item) => sum + (item.price * 63 * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Meu Carrinho',
        }}
      />

      {cart.length > 0 && categories.length > 0 && (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <TouchableOpacity
                style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
                onPress={clearFilter}
              >
                <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>Todos</Text>
              </TouchableOpacity>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === item && styles.categoryButtonActive]}
                onPress={() => handleCategorySelect(item)}
              >
                <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio!</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar às Compras</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: {formatPrice(total)}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => Alert.alert('Checkout', 'Em breve!')}>
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4e1',
  },
  filterContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffb6c1',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryButtonActive: {
    backgroundColor: '#ff1493',
  },
  categoryText: {
    color: '#ff1493',
    fontWeight: 'bold',
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#ffb6c1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#ff1493',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ff1493',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#ffb6c1',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 128, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  checkoutButton: {
    backgroundColor: '#ff1493',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
