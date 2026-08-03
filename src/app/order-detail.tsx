import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../constants/theme";
import { useLanguage } from "../i18n/useLanguage";
import { useTranslation } from "../i18n/useTranslation";
import { supabase } from "../lib/supabase";
import { buildQuoteViewModel } from "../presentation/quotePresentation";
import QuoteScreen from "../screens/QuoteScreen";
import { getDeliveryByOrderId } from "../services/deliveryService";
import { getActiveExchangeRate } from "../services/exchangeRateService";
import {
  cancelAcceptedOrder,
  getOrderById,
} from "../services/orderService";
import {
  acceptQuote,
  getOrderQuote,
  rejectQuote,
} from "../services/quoteService";

function extractExchangeRate(
  result: unknown,
): number | null {
  const response = result as {
    data?:
      | {
          crc_per_usd?: number | string | null;
          usd_to_crc?: number | string | null;
          rate?: number | string | null;
          value?: number | string | null;
        }
      | number
      | string
      | null;

    crc_per_usd?: number | string | null;
    usd_to_crc?: number | string | null;
    rate?: number | string | null;
    value?: number | string | null;
  };

  const nestedData =
    typeof response?.data === "object" &&
    response.data !== null
      ? response.data
      : null;

  const rawValue =
    nestedData?.crc_per_usd ??
    nestedData?.usd_to_crc ??
    nestedData?.rate ??
    nestedData?.value ??
    response?.crc_per_usd ??
    response?.usd_to_crc ??
    response?.rate ??
    response?.value ??
    response?.data ??
    result ??
    null;

  const numericValue = Number(rawValue);

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return null;
  }

  return numericValue;
}

export default function OrderDetailScreen() {
  const params = useLocalSearchParams<{
    orderId?: string | string[];
  }>();

  const orderId = useMemo(() => {
    if (Array.isArray(params.orderId)) {
      return params.orderId[0]?.trim() ?? "";
    }

    return params.orderId?.trim() ?? "";
  }, [params.orderId]);

  const [order, setOrder] = useState<any>(null);
  const [quote, setQuote] = useState<any>(null);
  const [delivery, setDelivery] =
    useState<any>(null);

  const [exchangeRate, setExchangeRate] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadingRequestRef = useRef(false);
  const initialLoadCompletedRef =
    useRef(false);

  const { t } = useTranslation();
  const { language } = useLanguage();

  const loadOrderDetail = useCallback(
    async (showFullLoader = false) => {
      if (
        !orderId ||
        loadingRequestRef.current
      ) {
        if (!orderId) {
          setLoading(false);
        }

        return;
      }

      loadingRequestRef.current = true;

      if (
        showFullLoader ||
        !initialLoadCompletedRef.current
      ) {
        setLoading(true);
      }

      try {
        const {
          data: orderData,
          error: orderError,
        } = await getOrderById(orderId);

        console.log(
          "ORDER DETAIL DATABASE RESULT:",
          {
            orderId,
            status: orderData?.status,
            order: orderData,
          },
        );

        if (orderError) {
          console.error(
            "ORDER DETAIL: Error loading order:",
            orderError,
          );

          setOrder(null);
          setQuote(null);
          setDelivery(null);
          setExchangeRate(null);

          return;
        }

        const [
          quoteResult,
          deliveryResult,
          exchangeRateResult,
        ] = await Promise.all([
          getOrderQuote(orderId),
          getDeliveryByOrderId(orderId),
          getActiveExchangeRate(),
        ]);

        const nextQuote =
          quoteResult.error
            ? null
            : quoteResult.data;

        const nextDelivery =
          deliveryResult.error
            ? null
            : deliveryResult.data ?? null;

        const nextExchangeRate =
          extractExchangeRate(
            exchangeRateResult,
          );

        /*
         * Reportamos errores sin aplicar
         * estados parciales a la pantalla.
         */
        if (quoteResult.error) {
          console.log(
            "ORDER DETAIL: This order does not have a quote yet:",
            quoteResult.error,
          );
        }

        if (deliveryResult.error) {
          console.error(
            "ORDER DETAIL: Error loading delivery:",
            deliveryResult.error,
          );
        }

        if (
          nextExchangeRate === null
        ) {
          console.warn(
            "ORDER DETAIL: Invalid exchange rate response:",
            exchangeRateResult,
          );
        } else {
          console.log(
            "ORDER DETAIL EXCHANGE RATE:",
            nextExchangeRate,
          );
        }

        /*
         * IMPORTANTE:
         *
         * Actualizamos order, quote,
         * delivery y exchange rate
         * después de terminar todas
         * las consultas.
         *
         * Esto evita aplicar primero
         * una order nueva mientras
         * delivery todavía conserva
         * el valor anterior.
         */
        setOrder(orderData);
        setQuote(nextQuote);
        setDelivery(nextDelivery);
        setExchangeRate(
          nextExchangeRate,
        );
      } catch (error) {
        console.error(
          "ORDER DETAIL: Unexpected loading error:",
          error,
        );

        setOrder(null);
        setQuote(null);
        setDelivery(null);
        setExchangeRate(null);
      } finally {
        loadingRequestRef.current =
          false;

        initialLoadCompletedRef.current =
          true;

        setLoading(false);
      }
    },
    [orderId],
  );

  /*
   * Carga inicial.
   */
  useEffect(() => {
    initialLoadCompletedRef.current =
      false;

    void loadOrderDetail(true);
  }, [loadOrderDetail]);

  /*
   * Recarga cuando la persona
   * vuelve a enfocar esta pantalla.
   */
  useFocusEffect(
    useCallback(() => {
      if (
        initialLoadCompletedRef.current
      ) {
        void loadOrderDetail(false);
      }
    }, [loadOrderDetail]),
  );

  /*
   * Supabase Realtime.
   *
   * Escucha:
   * - orders
   * - quotes
   * - deliveries
   */
  useEffect(() => {
    if (!orderId) {
      return;
    }

    const channel = supabase
      .channel(
        `order-detail-${orderId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log(
            "ORDER DETAIL REALTIME ORDER:",
            payload,
          );

          void loadOrderDetail(false);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quotes",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          console.log(
            "ORDER DETAIL REALTIME QUOTE:",
            payload,
          );

          void loadOrderDetail(false);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deliveries",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          console.log(
            "ORDER DETAIL REALTIME DELIVERY:",
            payload,
          );

          void loadOrderDetail(false);
        },
      )
      .subscribe((status) => {
        console.log(
          "ORDER DETAIL REALTIME STATUS:",
          status,
        );
      });

    return () => {
      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    loadOrderDetail,
    orderId,
  ]);

  async function handleAcceptQuote() {
    if (
      !quote ||
      actionLoading
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const { error } =
        await acceptQuote(
          quote.id,
        );

      if (error) {
        console.error(
          "Error accepting quote:",
          error,
        );

        Alert.alert(
          t("common.error"),
          t(
            "orderDetail.acceptError",
          ),
        );

        return;
      }

      Alert.alert(
        t(
          "orderDetail.quoteAcceptedTitle",
        ),
        t(
          "orderDetail.quoteAcceptedMessage",
        ),
      );

      /*
       * Realtime debe detectar
       * el cambio, pero hacemos
       * recarga de respaldo.
       */
      await loadOrderDetail(false);
    } catch (error) {
      console.error(
        "Unexpected error accepting quote:",
        error,
      );

      Alert.alert(
        t("common.error"),
        t(
          "orderDetail.acceptError",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRejectQuote() {
    if (
      !quote ||
      actionLoading
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const { error } =
        await rejectQuote(
          quote.id,
        );

      if (error) {
        console.error(
          "Error rejecting quote:",
          error,
        );

        Alert.alert(
          t("common.error"),
          t(
            "orderDetail.rejectError",
          ),
        );

        return;
      }

      Alert.alert(
        t(
          "orderDetail.quoteRejectedTitle",
        ),
        t(
          "orderDetail.quoteRejectedMessage",
        ),
      );

      await loadOrderDetail(false);
    } catch (error) {
      console.error(
        "Unexpected error rejecting quote:",
        error,
      );

      Alert.alert(
        t("common.error"),
        t(
          "orderDetail.rejectError",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  }

  function handleCancelOrder() {
    if (
      !order ||
      !delivery ||
      actionLoading
    ) {
      return;
    }

    Alert.alert(
      "Cancelar pedido",
      "¿Seguro que deseas cancelar este pedido?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(
                true,
              );

              const { error } =
                await cancelAcceptedOrder(
                  order.id,
                );

              if (error) {
                Alert.alert(
                  "No se pudo cancelar",
                  error.message,
                );

                return;
              }

              Alert.alert(
                "Pedido cancelado",
                "Tu pedido fue cancelado correctamente.",
              );

              await loadOrderDetail(
                false,
              );
            } catch (error) {
              console.error(
                "ORDER DETAIL CANCEL ERROR:",
                error,
              );

              Alert.alert(
                "Error",
                "No se pudo cancelar el pedido.",
              );
            } finally {
              setActionLoading(
                false,
              );
            }
          },
        },
      ],
    );
  }

  function handleBackToOrders() {
    router.replace(
      "/orders" as never,
    );
  }

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={colors.brand}
        />

        <Text
          style={
            styles.loadingText
          }
        >
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Ionicons
          name="alert-circle-outline"
          size={42}
          color={colors.brand}
        />

        <Text
          style={
            styles.emptyText
          }
        >
          {t(
            "orderDetail.notFound",
          )}
        </Text>

        <Pressable
          style={styles.button}
          onPress={
            handleBackToOrders
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            {t(
              "orderDetail.backOrders",
            )}
          </Text>
        </Pressable>
      </View>
    );
  }

  const canDecideQuote =
    String(
      quote?.status,
    ).toUpperCase() ===
    "PENDING";

  if (quote) {
    console.log(
      "ORDER DETAIL STATUS BEFORE VIEW MODEL:",
      order?.status,
    );

    /*
     * Para presentación usamos
     * delivery.status cuando
     * exista una delivery activa
     * o completada.
     */
    const displayOrder = {
      ...order,
      status:
        delivery?.status ??
        order.status,
    };

    const quoteViewModel =
      buildQuoteViewModel({
        order: displayOrder,
        quote,
        language,
        exchangeRate,
      });

    console.log(
      "ORDER DETAIL STATUS AFTER VIEW MODEL:",
      quoteViewModel.service
        .statusType,
    );

    const normalizedQuoteViewModel =
      {
        ...quoteViewModel,

        actions: {
          ...quoteViewModel.actions,
          canRespond:
            canDecideQuote,
        },
      };

    const canCancelOrder =
      String(order?.status)
        .trim()
        .toUpperCase() ===
        "ACCEPTED" &&
      String(
        delivery?.status,
      )
        .trim()
        .toUpperCase() ===
        "PENDING";

    return (
      <QuoteScreen
        quote={
          normalizedQuoteViewModel
        }
        deliveryId={
          delivery?.id ?? null
        }
        onAccept={
          handleAcceptQuote
        }
        onReject={
          handleRejectQuote
        }
        onCancelOrder={
          handleCancelOrder
        }
        canCancelOrder={
          canCancelOrder
        }
        isSubmitting={
          actionLoading
        }
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <Pressable
        style={
          styles.backButton
        }
        onPress={
          handleBackToOrders
        }
        hitSlop={10}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.brand}
        />

        <Text
          style={
            styles.backButtonText
          }
        >
          {t("common.back")}
        </Text>
      </Pressable>

      <View
        style={
          styles.waitingBox
        }
      >
        <Ionicons
          name="time-outline"
          size={38}
          color={colors.brand}
        />

        <Text
          style={
            styles.waitingTitle
          }
        >
          {t(
            "orderDetail.waitingTitle",
          )}
        </Text>

        <Text
          style={
            styles.waitingText
          }
        >
          {t(
            "orderDetail.waitingQuote",
          )}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={
          handleBackToOrders
        }
      >
        <Text
          style={
            styles.buttonText
          }
        >
          {t(
            "orderDetail.backOrders",
          )}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      flexGrow: 1,
      padding: spacing.xl,
      paddingTop: 60,
      paddingBottom:
        spacing.xxl,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      paddingHorizontal:
        spacing.xl,
      backgroundColor:
        colors.background,
    },

    loadingText: {
      ...typography.body,
      marginTop: spacing.md,
      color: colors.textMuted,
    },

    emptyText: {
      ...typography.body,
      marginTop: spacing.md,
      marginBottom:
        spacing.xl,
      color: colors.textMuted,
      textAlign: "center",
    },

    backButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: spacing.sm,
      marginBottom:
        spacing.xl,
    },

    backButtonText: {
      ...typography.body,
      color: colors.brand,
      fontWeight: "800",
    },

    waitingBox: {
      alignItems: "center",
      padding: spacing.xl,
      borderRadius:
        radius.xl,
      backgroundColor:
        colors.surfaceSoft,
      marginBottom:
        spacing.lg,
    },

    waitingTitle: {
      ...typography.subtitle,
      color: colors.text,
      marginTop:
        spacing.md,
      textAlign: "center",
    },

    waitingText: {
      ...typography.body,
      color: colors.textMuted,
      marginTop:
        spacing.sm,
      textAlign: "center",
    },

    button: {
      width: "100%",
      minHeight: 58,
      paddingHorizontal:
        spacing.lg,
      borderRadius:
        radius.lg,
      backgroundColor:
        colors.brand,
      alignItems: "center",
      justifyContent:
        "center",
    },

    buttonText: {
      ...typography.button,
      color:
        colors.textInverse,
      textAlign: "center",
    },
  });