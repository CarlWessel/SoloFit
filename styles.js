// styles.js
import { StyleSheet } from "react-native";

export const colors = {
  background: '#023047',
  primary: '#219ebc',
  accent: '#ffb703',
  textLight: '#fff',
  textDark: '#000',
  border: '#ddd',
  // I picked these two color, could be changed 
  delete: '#ff0000',
  cardBackground: '#005d8bff'
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
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.accent,
        textAlign: 'center',
    },
    headerLeft: {
        width: '20%',
        top: spacing.lg,
        bottom: 0, 
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 10
    },
    headerRight: {
        width: '20%',
        top: spacing.lg,
        bottom: 0, 
        right: 0,
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 10
    },
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startButton: {
        backgroundColor: colors.accent,
        padding: spacing.md,
        borderRadius: 10
    },
    text: {
        color: colors.textLight,
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.primary,
    },
    footerButton: {
        alignItems: 'center',
    },
    bottomButtonView: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    },
    list: {
        marginVertical: spacing.md,
        paddingHorizontal: spacing.md,
        width: '100%'
    },
    listItem: {
        backgroundColor: colors.cardBackground,
        borderRadius: 10,
        padding: spacing.md,
        marginVertical: spacing.sm,
    },
    listHeader: {
        color: colors.accent,
        fontSize: 20,
        paddingBottom: spacing.xs,
        fontWeight: '500'
    },
    listSubheader: {
        color: colors.accent,
        fontSize: 19,
        paddingBottom: spacing.xs,
        fontWeight: '500'
    },
    listText: {
        color: colors.textLight,
        fontSize: 18,
    },
    listTextHighlight: {
        color: colors.accent,
        fontSize: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacing.md,
    },
    yellowButton: {
        backgroundColor: colors.accent,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:spacing.xs
    },
    redButton: {
        backgroundColor: colors.delete,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:spacing.xs
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.textLight,
        borderRadius: 10,
        padding: spacing.md,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.md,
    },
    modalTextInput: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: colors.textDark,
        backgroundColor: colors.textLight,
        marginBottom: spacing.md,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    exerciseForm: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        margin: 10,
        backgroundColor: colors.primary,
    },
    exerciseDropdown: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 1,
        backgroundColor: colors.background,
        height: 40,
        justifyContent: "center",
    },
    setRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 5,
    },
    exerciseInput: {
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        margin: 10,
        backgroundColor: colors.primary,
    },
    titleInput: {
        height: 40,
        width: "90%",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: colors.accent,
        backgroundColor: colors.background,
    },
    noteInput: {
        color: colors.accent,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlignVertical: "top",
        backgroundColor: colors.background,
    },
});
