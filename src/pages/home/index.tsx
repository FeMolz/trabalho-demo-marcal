import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';

const RANDOM_STORIES = [
  "Numa terra distante, um dragão ancestral forjou este produto com as chamas sagradas de Eldoria, abençoado por fadas mágicas em uma noite de lua cheia.",
  "As lendas dizem que fadas cristalinas teceram este item com fios de luz estelar, enquanto dragões dourados guardavam os segredos de sua criação.",
  "Diz-se que quem possui este artefato ganha o favor das fadas do bosque e a proteção impenetrável das escamas de um dragão ancião."
];

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [story, setStory] = useState('');

  const { addToCart, cart } = useCart();

  const fetchProducts = async (category?: string) => {
    setLoading(true);
    try {
      const url = category
        ? `https://fakestoreapi.com/products/category/${category}`
        : 'https://fakestoreapi.com/products';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar produtos');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('Erro', 'se ferrou');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://fakestoreapi.com/products/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    fetchProducts();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };

  const openProductDetails = async (id: number) => {
    setModalVisible(true);
    setLoadingDetails(true);
    const randomStory = RANDOM_STORIES[Math.floor(Math.random() * RANDOM_STORIES.length)];
    setStory(randomStory);

    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!res.ok) throw new Error('Erro na API');
      const data = await res.json();
      setSelectedProduct(data);
    } catch (error) {
      Alert.alert('Erro', 'se ferrou');
      setModalVisible(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBuy = () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
      setModalVisible(false);
      router.push('/cart');
    }
  };

  const closeProductDetails = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => openProductDetails(item.id)}>
      <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Produtos',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Logout</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => router.push('/cart')} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Carrinho ({cart.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/info')} style={styles.headerButton}>
                <Text style={styles.headerButtonText}>Info</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ff1493" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeProductDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <TouchableOpacity style={styles.closeButton} onPress={closeProductDetails}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {loadingDetails ? (
              <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 20 }} />
            ) : selectedProduct ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: 'https://veja.abril.com.br/wp-content/uploads/2025/07/vampeta-tvpop.jpg?crop=1&resize=1212,909' }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{selectedProduct.category}</Text>
                </View>

                <Text style={styles.modalPrice}>{formatPrice(selectedProduct.price * 63)}</Text>

                <Text style={styles.descriptionTitle}>A Lenda Mágica do Produto:</Text>
                <Text style={styles.description}>{story}</Text>

                <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                  <Text style={styles.buyButtonText}>Comprar</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4e1',
  },
  headerButton: {
    padding: 10,
    marginHorizontal: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff1493',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffe4e1',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff1493',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff1493',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 128, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  categoryBadgeText: {
    color: '#ff1493',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  modalPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff1493',
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'justify',
  },
  buyButton: {
    backgroundColor: '#ff1493',
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});
