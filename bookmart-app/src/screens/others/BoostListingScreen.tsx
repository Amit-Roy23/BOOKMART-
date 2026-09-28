import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { router, useNavigation, useRoute } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import Header from "@/components/ui/Header";
import { api } from "@/api/clients";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { SPACING } from "@/constants/spacings";
import { rem } from "@/utils/responsive";

const { width } = Dimensions.get("window");

export interface BoostPlanItem {
  id: number;
  name: string;
  duration_days: number;
  price: string | number;
  is_active: boolean;
}

export type PaymentMethodType = "UPI" | "CARD" | "WALLET";

export type StepType = "PLAN" | "PAYMENT" | "PROCESSING" | "SUCCESS" | "FAILED";

export default function BoostListingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();

  const paramListingId = route.params?.listingId ? String(route.params.listingId) : null;

  // Wizard state
  const [step, setStep] = useState<StepType>("PLAN");
  const [selectedListingId, setSelectedListingId] = useState<string | null>(paramListingId);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("UPI");
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [processingStatusText, setProcessingStatusText] = useState<string>("Initiating secure order...");

  // 1. Fetch current user profile
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/api/v1/core/profile/me/");
      return response.data;
    },
  });

  // 2. Fetch active boost plans from backend
  const { data: boostPlansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["boost-plans"],
    queryFn: async () => {
      const response = await api.get("/api/v1/marketplace/boost-plans/");
      return response.data;
    },
  });

  // 3. Fetch user's listings
  const { data: listingsData, isLoading: isLoadingListings } = useQuery({
    queryKey: ["marketplace-listings"],
    queryFn: async () => {
      const response = await api.get("/api/v1/marketplace/listings/");
      return response.data;
    },
  });

  const plans: BoostPlanItem[] = useMemo(() => {
    if (Array.isArray(boostPlansData)) {
      return boostPlansData.filter((p: any) => p.is_active);
    }
    if (boostPlansData?.results) {
      return boostPlansData.results.filter((p: any) => p.is_active);
    }
    // Fallback default plans
    return [
      { id: 1, name: "3 Days Boost", duration_days: 3, price: "49.00", is_active: true },
      { id: 2, name: "7 Days Spotlight", duration_days: 7, price: "99.00", is_active: true },
      { id: 3, name: "30 Days Pro", duration_days: 30, price: "249.00", is_active: true },
    ];
  }, [boostPlansData]);

  // Set default selected plan
  useEffect(() => {
    if (plans.length > 0 && selectedPlanId === null) {
      const popular = plans.find((p) => p.duration_days === 7) || plans[0];
      setSelectedPlanId(popular.id);
    }
  }, [plans, selectedPlanId]);

  const myListings = useMemo(() => {
    if (!listingsData?.results || !userProfile?.user_id) return [];
    return listingsData.results
      .filter((item: any) => item.seller.id === userProfile.user_id)
      .map((item: any) => ({
        id: String(item.id),
        title: item.book.title,
        author: item.book.authors?.map((a: any) => a.name).join(", ") || "Unknown Author",
        price: parseFloat(item.price),
        coverUri:
          item.listing_images?.[0]?.image_url ||
          item.book.cover_url ||
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=440&fit=crop",
        isBoosted: item.is_boosted || false,
        boostExpiresAt: item.boost_expires_at,
      }));
  }, [listingsData, userProfile]);

  // Auto-select listing if not set
  useEffect(() => {
    if (paramListingId) {
      setSelectedListingId(paramListingId);
    } else if (myListings.length > 0 && !selectedListingId) {
      const unboosted = myListings.find((b: any) => !b.isBoosted);
      setSelectedListingId(unboosted ? unboosted.id : myListings[0].id);
    }
  }, [paramListingId, myListings, selectedListingId]);

  const activePlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  const activeListing = useMemo(() => {
    return myListings.find((l: any) => l.id === selectedListingId) || myListings[0];
  }, [myListings, selectedListingId]);

  // Handle Payment Execution
  const handleProceedToPayment = () => {
    if (!selectedListingId || !selectedPlanId) return;
    Haptics.selectionAsync();
    setStep("PAYMENT");
  };

  const handleStartPayment = async () => {
    if (!selectedListingId || !activePlan) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setStep("PROCESSING");
    setProcessingStatusText("Initiating secure order...");

    try {
      // Step 1: Call POST /api/v1/marketplace/listings/{id}/boost/initiate/
      const initiateRes = await api.post(
        `/api/v1/marketplace/listings/${selectedListingId}/boost/initiate/`,
        {
          plan_id: activePlan.id,
          payment_method: selectedPaymentMethod,
        }
      );

      const orderId = initiateRes.data.order_id;
      const gatewaySession = initiateRes.data.payment_session;

      setProcessingStatusText("Verifying payment with gateway...");

      // Step 2: Call POST /api/v1/marketplace/boost-orders/{id}/confirm/
      const confirmRes = await api.post(
        `/api/v1/marketplace/boost-orders/${orderId}/confirm/`,
        {
          gateway_transaction_id: gatewaySession?.gateway_order_id || `txn_${Date.now()}`,
        }
      );

      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      queryClient.invalidateQueries({ queryKey: ["all-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", selectedListingId] });
      queryClient.invalidateQueries({ queryKey: ["my-active-listings"] });

      setOrderResult({
        ...confirmRes.data,
        planName: activePlan.name,
        durationDays: activePlan.duration_days,
        amount: activePlan.price,
        bookTitle: activeListing?.title || "Book Listing",
        coverUri: activeListing?.coverUri,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("SUCCESS");
    } catch (err: any) {
      console.error("Boost payment process error:", err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Payment process failed. Please try again.";
      setErrorMessage(detail);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStep("FAILED");
    }
  };

  const handleDone = () => {
    Haptics.selectionAsync();
    router.back();
  };

  const formatExpiryDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // ──────────────────────────────────────────────
  // Step 1: Plan Selection View
  // ──────────────────────────────────────────────
  const renderPlanSelection = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Hero Banner */}
      <View style={styles.heroSection}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Boost Your Listing</Text>
          <Text style={styles.heroSubtitle}>
            Get 3x more visibility, reach verified campus buyers, and sell faster.
          </Text>
        </View>
        <View style={styles.heroBadgeWrap}>
          <Ionicons name="rocket" size={32} color={COLORS.primary} />
        </View>
      </View>

      {/* Select Book Card */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>1. Target Book Listing</Text>
        {myListings.length === 0 ? (
          <View style={styles.emptyBookCard}>
            <Text style={styles.emptyBookText}>No active listings found. Please list a book first.</Text>
          </View>
        ) : (
          <View style={styles.bookSelectorList}>
            {myListings.map((book: any) => {
              const isSelected = selectedListingId === book.id;
              return (
                <TouchableOpacity
                  key={book.id}
                  style={[styles.listingSelectCard, isSelected && styles.listingSelectCardActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedListingId(book.id);
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: book.coverUri }} style={styles.selectBookCover} contentFit="cover" />
                  <View style={styles.selectBookInfo}>
                    <Text style={styles.selectBookTitle} numberOfLines={1}>
                      {book.title}
                    </Text>
                    <Text style={styles.selectBookAuthor} numberOfLines={1}>
                      {book.author}
                    </Text>
                    <Text style={styles.selectBookPrice}>₹{book.price}</Text>
                  </View>

                  <View style={styles.selectRadioArea}>
                    {book.isBoosted ? (
                      <View style={styles.alreadyBoostedBadge}>
                        <Ionicons name="flash" size={12} color={COLORS.white} />
                        <Text style={styles.alreadyBoostedText}>Boosted</Text>
                      </View>
                    ) : (
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Select Boost Plan */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>2. Choose Boost Plan</Text>
        {isLoadingPlans ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.plansContainer}>
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isPopular = plan.duration_days === 7;
              const isBestValue = plan.duration_days === 30;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planCard, isSelected && styles.planCardActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedPlanId(plan.id);
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.planTopRow}>
                    <Text style={[styles.planName, isSelected && { color: COLORS.primary }]}>
                      {plan.name}
                    </Text>
                    {isPopular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                      </View>
                    )}
                    {isBestValue && (
                      <View style={[styles.popularBadge, { backgroundColor: COLORS.purple }]}>
                        <Text style={styles.popularBadgeText}>BEST VALUE</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.planDurationRow}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
                    <Text style={styles.planDurationText}>
                      Active for {plan.duration_days} day{plan.duration_days > 1 ? "s" : ""}
                    </Text>
                  </View>

                  <View style={styles.planBenefitsList}>
                    <View style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={15} color={COLORS.primary} />
                      <Text style={styles.benefitText}>Top Placement in Home & Search</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={15} color={COLORS.primary} />
                      <Text style={styles.benefitText}>Highlighted "Boosted" Badge</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={15} color={COLORS.primary} />
                      <Text style={styles.benefitText}>Priority WhatsApp Buyer Leads</Text>
                    </View>
                  </View>

                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPriceCurrency}>₹</Text>
                    <Text style={styles.planPriceValue}>{parseFloat(String(plan.price))}</Text>
                    <Text style={styles.planPricePeriod}> / total</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Bottom CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.continueButton, (!selectedListingId || activeListing?.isBoosted) && styles.disabledButton]}
          disabled={!selectedListingId || activeListing?.isBoosted}
          onPress={handleProceedToPayment}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {activeListing?.isBoosted ? "Listing Already Boosted" : `Continue to Pay ₹${activePlan ? parseFloat(String(activePlan.price)) : 0}`}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ──────────────────────────────────────────────
  // Step 2: Payment Method Selection View
  // ──────────────────────────────────────────────
  const renderPaymentSelection = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Order Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryItemRow}>
          <Image source={{ uri: activeListing?.coverUri }} style={styles.summaryCover} contentFit="cover" />
          <View style={styles.summaryBookInfo}>
            <Text style={styles.summaryBookTitle} numberOfLines={1}>
              {activeListing?.title}
            </Text>
            <Text style={styles.summaryBookAuthor} numberOfLines={1}>
              {activeListing?.author}
            </Text>
            <View style={styles.summaryPlanPill}>
              <Ionicons name="flash" size={12} color={COLORS.primary} />
              <Text style={styles.summaryPlanPillText}>{activePlan?.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryPriceRow}>
          <Text style={styles.summaryPriceLabel}>Duration</Text>
          <Text style={styles.summaryPriceVal}>{activePlan?.duration_days} Days</Text>
        </View>

        <View style={styles.summaryPriceRow}>
          <Text style={styles.summaryPriceLabel}>Total Payable</Text>
          <Text style={styles.summaryTotalVal}>₹{parseFloat(String(activePlan?.price || 0))}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* UPI Method */}
        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === "UPI" && styles.paymentMethodCardActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedPaymentMethod("UPI");
          }}
          activeOpacity={0.8}
        >
          <View style={styles.paymentMethodIconWrap}>
            <Ionicons name="phone-portrait-outline" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>UPI (Instant & Free)</Text>
            <Text style={styles.paymentMethodDesc}>Google Pay, PhonePe, Paytm, BHIM</Text>
          </View>
          <View style={[styles.radioCircle, selectedPaymentMethod === "UPI" && styles.radioCircleActive]}>
            {selectedPaymentMethod === "UPI" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Card Method */}
        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === "CARD" && styles.paymentMethodCardActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedPaymentMethod("CARD");
          }}
          activeOpacity={0.8}
        >
          <View style={styles.paymentMethodIconWrap}>
            <Ionicons name="card-outline" size={22} color={COLORS.blue} />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>Credit / Debit Card</Text>
            <Text style={styles.paymentMethodDesc}>Visa, MasterCard, RuPay</Text>
          </View>
          <View style={[styles.radioCircle, selectedPaymentMethod === "CARD" && styles.radioCircleActive]}>
            {selectedPaymentMethod === "CARD" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Wallet / NetBanking */}
        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === "WALLET" && styles.paymentMethodCardActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedPaymentMethod("WALLET");
          }}
          activeOpacity={0.8}
        >
          <View style={styles.paymentMethodIconWrap}>
            <Ionicons name="wallet-outline" size={22} color={COLORS.purple} />
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>Wallets & Net Banking</Text>
            <Text style={styles.paymentMethodDesc}>Paytm, Amazon Pay, All Major Banks</Text>
          </View>
          <View style={[styles.radioCircle, selectedPaymentMethod === "WALLET" && styles.radioCircleActive]}>
            {selectedPaymentMethod === "WALLET" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Ionicons name="shield-checkmark" size={18} color={COLORS.green} />
        <Text style={styles.securityNoteText}>
          100% Secure Transaction. Pluggable payment gateway simulation active.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleStartPayment} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>
            Pay ₹{parseFloat(String(activePlan?.price || 0))} & Activate Boost
          </Text>
          <Ionicons name="flash" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backStepButton} onPress={() => setStep("PLAN")} activeOpacity={0.7}>
          <Text style={styles.backStepButtonText}>Change Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ──────────────────────────────────────────────
  // Step 3: Processing State View
  // ──────────────────────────────────────────────
  const renderProcessing = () => (
    <View style={styles.centerContainer}>
      <View style={styles.processingCard}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginBottom: SPACING.md }} />
        <Text style={styles.processingTitle}>Processing Payment</Text>
        <Text style={styles.processingStatusText}>{processingStatusText}</Text>
        <Text style={styles.processingHelpText}>Please do not close the app or press back.</Text>
      </View>
    </View>
  );

  // ──────────────────────────────────────────────
  // Step 4: Success View
  // ──────────────────────────────────────────────
  const renderSuccess = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.successContainer}>
        {/* Success Icon */}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.green} />
        </View>

        <Text style={styles.successHeading}>Boost Activated!</Text>
        <Text style={styles.successSubheading}>
          Your book is now highlighted at the top of searches and category feeds.
        </Text>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptTopRow}>
            <Image source={{ uri: orderResult?.coverUri }} style={styles.receiptCover} contentFit="cover" />
            <View style={styles.receiptBookInfo}>
              <Text style={styles.receiptBookTitle} numberOfLines={2}>
                {orderResult?.bookTitle}
              </Text>
              <View style={styles.receiptPlanBadge}>
                <Ionicons name="flash" size={12} color={COLORS.white} />
                <Text style={styles.receiptPlanBadgeText}>{orderResult?.planName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Amount Paid</Text>
            <Text style={styles.receiptValue}>₹{parseFloat(String(orderResult?.amount || 0))}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Payment Status</Text>
            <Text style={[styles.receiptValue, { color: COLORS.green }]}>SUCCESS</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Order Reference</Text>
            <Text style={styles.receiptValue}>#{orderResult?.order?.id || "BOOST-OK"}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Boost Expires At</Text>
            <Text style={[styles.receiptValue, { fontFamily: FONTS.montserrat.bold, color: COLORS.primary }]}>
              {formatExpiryDate(orderResult?.boost_expires_at)}
            </Text>
          </View>
        </View>

        {/* Done Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleDone} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Done</Text>
          <Ionicons name="checkmark" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ──────────────────────────────────────────────
  // Step 5: Failure View
  // ──────────────────────────────────────────────
  const renderFailure = () => (
    <View style={styles.centerContainer}>
      <View style={styles.failedCard}>
        <Ionicons name="alert-circle" size={72} color={COLORS.red} style={{ marginBottom: SPACING.sm }} />
        <Text style={styles.failedTitle}>Payment Failed</Text>
        <Text style={styles.failedText}>
          {errorMessage || "We could not process your boost payment transaction. Please try again."}
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleStartPayment} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Try Again</Text>
          <Ionicons name="refresh" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backStepButton} onPress={() => setStep("PLAN")} activeOpacity={0.7}>
          <Text style={styles.backStepButtonText}>Cancel & Choose Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <Header
        title={step === "PAYMENT" ? "Payment" : "Boost Listing"}
        backButton
        onPress={() => {
          if (step === "PAYMENT") {
            setStep("PLAN");
          } else {
            navigation.goBack();
          }
        }}
      />

      {step === "PLAN" && renderPlanSelection()}
      {step === "PAYMENT" && renderPaymentSelection()}
      {step === "PROCESSING" && renderProcessing()}
      {step === "SUCCESS" && renderSuccess()}
      {step === "FAILED" && renderFailure()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary + "12",
    borderRadius: rem(1),
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + "30",
  },
  heroTextContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  heroTitle: {
    fontSize: rem(1.125),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  heroBadgeWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: rem(1),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  bookSelectorList: {
    gap: SPACING.sm,
  },
  listingSelectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: rem(0.75),
    padding: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
  },
  listingSelectCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "06",
  },
  selectBookCover: {
    width: 48,
    height: 64,
    borderRadius: 6,
    backgroundColor: COLORS.grayLight,
  },
  selectBookInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  selectBookTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
    marginBottom: 2,
  },
  selectBookAuthor: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  selectBookPrice: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  selectRadioArea: {
    paddingLeft: SPACING.sm,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  alreadyBoostedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  alreadyBoostedText: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
  },
  emptyBookCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: rem(0.75),
    alignItems: "center",
  },
  emptyBookText: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  plansContainer: {
    gap: SPACING.md,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: rem(1),
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.grayLight,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  planCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "04",
  },
  planTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  planName: {
    fontSize: rem(1.0625),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
  },
  popularBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: rem(0.625),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  planDurationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACING.sm,
  },
  planDurationText: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  planBenefitsList: {
    gap: 4,
    marginVertical: SPACING.xs,
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  benefitText: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.text,
  },
  planPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: SPACING.xs,
  },
  planPriceCurrency: {
    fontSize: rem(1),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  planPriceValue: {
    fontSize: rem(1.5),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  planPricePeriod: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  ctaContainer: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: rem(0.75),
    gap: SPACING.xs,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.grayHeavvy,
    elevation: 0,
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: rem(0.9375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
  },
  backStepButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
  },
  backStepButtonText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.textMuted,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: rem(1),
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  summaryTitle: {
    fontSize: rem(0.9375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    marginVertical: SPACING.sm,
  },
  summaryItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryCover: {
    width: 48,
    height: 64,
    borderRadius: 6,
    backgroundColor: COLORS.grayLight,
  },
  summaryBookInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  summaryBookTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
    marginBottom: 2,
  },
  summaryBookAuthor: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  summaryPlanPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  summaryPlanPillText: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  summaryPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
  },
  summaryPriceLabel: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  summaryPriceVal: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
  },
  summaryTotalVal: {
    fontSize: rem(1.125),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.primary,
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: rem(0.75),
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.grayLight,
  },
  paymentMethodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "04",
  },
  paymentMethodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
    marginBottom: 2,
  },
  paymentMethodDesc: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.green + "12",
    padding: SPACING.sm,
    borderRadius: rem(0.5),
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  securityNoteText: {
    flex: 1,
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.green,
  },
  processingCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: rem(1),
    alignItems: "center",
    width: "100%",
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  processingTitle: {
    fontSize: rem(1.125),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: 6,
  },
  processingStatusText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  processingHelpText: {
    fontSize: rem(0.75),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
    paddingTop: SPACING.lg,
  },
  successIconCircle: {
    marginBottom: SPACING.md,
  },
  successHeading: {
    fontSize: rem(1.375),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: 6,
  },
  successSubheading: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    lineHeight: 20,
  },
  receiptCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: rem(1),
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  receiptTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptCover: {
    width: 48,
    height: 64,
    borderRadius: 6,
    backgroundColor: COLORS.grayLight,
  },
  receiptBookInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  receiptBookTitle: {
    fontSize: rem(0.875),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
    marginBottom: 4,
  },
  receiptPlanBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  receiptPlanBadgeText: {
    fontSize: rem(0.6875),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.white,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  receiptLabel: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
  },
  receiptValue: {
    fontSize: rem(0.8125),
    fontFamily: FONTS.montserrat.semibold,
    color: COLORS.black,
  },
  failedCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: rem(1),
    alignItems: "center",
    width: "100%",
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  failedTitle: {
    fontSize: rem(1.25),
    fontFamily: FONTS.montserrat.bold,
    color: COLORS.black,
    marginBottom: 8,
  },
  failedText: {
    fontSize: rem(0.875),
    fontFamily: FONTS.manrope.medium,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
});
