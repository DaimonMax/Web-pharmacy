'use client';

import React, { useState, useEffect } from 'react';

import { AuthProvider, useAuth } from '@/context/authContext';
import { CartProvider, useCart } from '@/context/cartContext';
import { WishlistProvider, useWishlist } from '@/context/wishlistContext';
import { PrescriptionsProvider, usePrescriptions } from '@/context/prescriptionContext';
import { CatalogProvider, useCatalog } from '@/context/catalogContext';
import { OrdersProvider, useOrders } from '@/context/ordersContext';
import { ThemeProvider } from '@/context/themeContext';

import { useDeletePrescription } from '@/hooks/useDeletePrescription';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';

import { Header } from '@/components/major/header';
import { Footer } from '@/components/major/footer';
import { MainContent } from '@/components/major/mainContent';
import { Toast } from '@/components/toast';

import { CartSidebar } from '@/components/modals/cartSideBar';
import { ProductModal } from '@/components/modals/product';
import { AccountModal } from '@/components/modals/account';
import { AttachRecipeModal } from '@/components/modals/attachRecipe';
import { CheckoutModal } from '@/components/modals/checkout';
import { OrdersModal } from '@/components/modals/orders';
import { AdminOrdersModal } from '@/components/modals/adminPanel';
import { RecipeModal } from '@/components/modals/recipe';

import { Product } from '@/shared/types/product';
import { PrescriptionWithAttachment } from '@/shared/types/prescription';
import { CartPeekTab } from '@/components/additional_markup/cartPeekTab';

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <PrescriptionsProvider>
              <CatalogProvider>
                <OrdersProvider>
                  <HomeContent />
                </OrdersProvider>
              </CatalogProvider>
            </PrescriptionsProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

type ActiveModal =
  | 'cart'
  | 'product'
  | 'account'
  | 'attachRecipe'
  | 'checkout'
  | 'orders'
  | 'admin'
  | 'recipe'
  | null;

function HomeContent() {
  const { user, login, register, logout } = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();
  const prescriptions = usePrescriptions();
  const catalog = useCatalog();
  const orders = useOrders();

  const deletePrescription = useDeletePrescription();
  const placeOrder = usePlaceOrder();

  const [currentView, setCurrentView] = useState<'meds' | 'advice' | 'wishlist' | 'kids'>('meds');

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [attachRecipeProduct, setAttachRecipeProduct] = useState<Product | null>(null);
  const [hasCartOpenedOnce, setHasCartOpenedOnce] = useState(false);

  const closeModal = () => setActiveModal(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveModal('product');
  };

  const requireRecipe = (product: Product) => {
    setAttachRecipeProduct(product);
    setActiveModal('attachRecipe');
  };

  const requireAuth = () => {
    setActiveModal('account');
    showToast('Увійдіть, щоб продовжити');
  };

  useEffect(() => {
    if (activeModal === 'orders') orders.refreshMyOrders();
    if (activeModal === 'admin') orders.refreshAdminOrders();
  }, [activeModal]); 

  const recipesWithAttachment: PrescriptionWithAttachment[] = prescriptions.prescriptions.map((rx) => {
    const entry = Object.entries(prescriptions.attachedPrescriptions).find(([, rxId]) => rxId === rx.id);
    const attachedProductId = entry ? Number(entry[0]) : null;
    const attachedProductName =
      attachedProductId != null ? catalog.getLoadedProductById(attachedProductId)?.name ?? null : null;
    return { ...rx, attachedProductId, attachedProductName };
  });

  const cartTotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Header
        onOpenCart={() => { setActiveModal('cart'); setHasCartOpenedOnce(true);}}
        onOpenAccount={() => setActiveModal('account')}
        onOpenOrders={() => setActiveModal('orders')}
        onOpenAdmin={() => setActiveModal('admin')}
        onOpenRecipeUpload={() => setActiveModal('recipe')}
        onRequireAuth={requireAuth}
        onNavigateToView={setCurrentView}
      />

      <MainContent
        currentView={currentView}
        onNavigateToCatalog={() => setCurrentView('meds')}
        onOpenProduct={openProduct}
        onRequireRecipe={requireRecipe}
        onRequireAuth={requireAuth}
      />

      <Footer />

      <CartSidebar
        isOpen={activeModal === 'cart'}
        onClose={closeModal}
        onCheckout={() => setActiveModal('checkout')}
      />

      <ProductModal
        isOpen={activeModal === 'product'}
        onClose={closeModal}
        product={selectedProduct}
        onRequireRecipe={requireRecipe}
        onRequireAuth={requireAuth}
      />

      <AccountModal
        isOpen={activeModal === 'account'}
        onClose={closeModal}
        user={user}
        onLogin={async (credentials) => {
          await login(credentials);
          showToast('Ласкаво просимо!');
          closeModal();
        }}
        onRegister={async (data) => {
          await register(data);
          showToast(`Реєстрація успішна! Вітаємо, ${data.name}`);
          closeModal();
        }}
        onLogout={() => {
          logout();
          catalog.clearSearch();
          showToast('Ви вийшли з акаунту');
        }}
      />

      <AttachRecipeModal
        isOpen={activeModal === 'attachRecipe'}
        onClose={closeModal}
        productId={attachRecipeProduct?.id}
        productName={attachRecipeProduct?.name}
        recipes={recipesWithAttachment}
        attachedRecipeId={
          attachRecipeProduct ? prescriptions.getAttachedPrescriptionId(attachRecipeProduct.id) ?? null : null
        }
        onSelectRecipe={(recipeId) => {
          if (!attachRecipeProduct) return;
          prescriptions.attach(attachRecipeProduct.id, recipeId);
          showToast('Рецепт прикріплено');
          closeModal();
        }}
        onOpenUploadModal={() => setActiveModal('recipe')}
      />

      <CheckoutModal
        isOpen={activeModal === 'checkout'}
        onClose={closeModal}
        totalAmount={cartTotal}
        onOrderComplete={async ({ city, street, house }) => {
          await placeOrder(`${city}, ${street}, ${house}`);
          showToast('Замовлення успішно створено!');
        }}
      />

      <OrdersModal
        isOpen={activeModal === 'orders'}
        onClose={closeModal}
        orders={orders.myOrders}
        isAdmin={false}
      />

      <AdminOrdersModal
        isOpen={activeModal === 'admin'}
        onClose={closeModal}
        orders={orders.adminOrders}
        isLoading={orders.isAdminOrdersLoading}
        onUpdateStatus={orders.updateStatus}
        onUpdateAddress={orders.updateAddress}
        onDeleteItem={orders.removeItem}
      />

      <RecipeModal
        isOpen={activeModal === 'recipe'}
        onClose={closeModal}
        existingRecipes={recipesWithAttachment}
        onSaveRecipe={async ({ title, file }) => {
          await prescriptions.upload(title, file);
          showToast('Рецепт збережено');
        }}
        onDeleteRecipe={async (id) => {
          await deletePrescription(id);
          showToast('Рецепт видалено');
        }}
      />

      <Toast message={toastMessage} isVisible={toastVisible} />

      <CartPeekTab
        visible={hasCartOpenedOnce && activeModal !== 'cart'}
        onHover={() => setActiveModal('cart')}
      />
    </>
  );
}