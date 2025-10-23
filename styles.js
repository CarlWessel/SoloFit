// styles.js
import { StyleSheet } from 'react-native';

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
        borderRadius: 10,
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
    listText: {
        color: colors.textLight,
        fontSize: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    editButton: {
        backgroundColor: colors.accent,
        padding: spacing.sm,
        width: 100,
        borderRadius: 10,
        alignItems: 'center'
    },
    deleteButton: {
        backgroundColor: colors.delete,
        padding: spacing.sm,
        width: 100,
        borderRadius: 10,
        alignItems: 'center'
    },
});
