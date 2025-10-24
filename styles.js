// styles.js
import { StyleSheet } from "react-native";

export const colors = {
  background: "#023047",
  primary: "#219ebc",
  accent: "#ffb703",
  textLight: "#fff",
  textDark: "#000",
  border: "#ddd",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.accent,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: 10,
  },
  startText: {
    color: colors.textLight,
    fontSize: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.primary,
  },
  footerButton: {
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginHorizontal: 5,
    paddingHorizontal: 8,
    color: colors.accent,
    backgroundColor: colors.background,
  },
});
