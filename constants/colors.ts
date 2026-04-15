export const colors = {
    // primary (blues)
    darkNavy: '#090057',
    lightNavy: '#072478',
    cobaltBlue: '#0000aa',
    lightBlue: '#4c75af',

    // Amber accents
    amber: '#b86f00',
    amberLight: '#ffbe10',

    // neutral
    white: '#FFFFFF',
    offWhite: '#F8FAFC',
    gray: '#94A3B8',
    grayDark: '#64748B',

    // Common assignments
    background: '#090057',
    surface: '#072478',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
    primary: '#0000aa',
    accent: '#F59E0B',

    error: '#EF4444',
    success: '#22C55E',
} as const;

// Use:
// import { colors } from '@/constants/colors';
// const primary = useThemeColor('primary');