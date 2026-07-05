export const colors = {
  background: "#F6F8F7",
  surface: "#FFFFFF",
  surfaceSoft: "#EEF3F1",

  primary: "#11B981",
  primaryDark: "#0E9F6E",
  primarySoft: "#DDF8EF",

  secondary: "#2DD4BF",
  secondarySoft: "#D9FBF7",

  text: "#10201A",
  textMuted: "#66756F",
  textSoft: "#8A9791",
  textInverse: "#FFFFFF",

  border: "#DDE5E2",

  success: "#11B981",
  successSoft: "#DDF8EF",

  warning: "#F59E0B",
  warningSoft: "#FEF3C7",

  danger: "#EF4444",
  dangerSoft: "#FEE2E2",

  info: "#3B82F6",
  infoSoft: "#DBEAFE",
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
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    color: colors.text,
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    color: colors.text,
  },

  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    color: colors.text,
  },

  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    color: colors.textMuted,
  },

  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700" as const,
    color: colors.textInverse,
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
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};