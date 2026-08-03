export const colors = {
primary: "#F75F2A",
primaryDark: "#D3481C",
primarySoft: "#FFF0E9",

  // Backgrounds
  white: "#FFFFFF",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSoft: "#F5F1EF",

  // Text
  dark: "#111827",
  muted: "#6B7280",
  textSoft: "#8A9791",

  // Borders
  border: "#E5E7EB",

  // Semantic
  success: "#16A34A",
  successSoft: "#DCFCE7",

  warning: "#F59E0B",
  warningSoft: "#FEF3C7",

  danger: "#EF4444",
  dangerSoft: "#FEE2E2",

  info: "#2563EB",
  infoSoft: "#DBEAFE",

// Compatibility aliases
brand: "#F75F2A",
brandDark: "#D3481C",
brandSoft: "#FFF0E9",

  text: "#111827",
  textMuted: "#6B7280",
  textInverse: "#FFFFFF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const typography = {
  pageTitle: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900" as const,
    color: colors.dark,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    color: colors.dark,
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900" as const,
    color: colors.dark,
  },

  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "400" as const,
    color: colors.muted,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    color: colors.dark,
  },

  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700" as const,
    color: colors.dark,
  },

  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    color: colors.muted,
  },

  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900" as const,
    color: colors.white,
  },

  backButton: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800" as const,
    color: colors.primary,
  },
};

export const shadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  md: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  brand: {
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};