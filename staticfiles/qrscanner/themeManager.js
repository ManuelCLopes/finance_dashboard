import { COLORS } from './constants.js';

export function updatePageTheme(theme) {
    document.body.style.backgroundColor = theme === 'dark' ? COLORS.CHARCOAL : COLORS.ALABASTER;
    document.querySelectorAll('.card').forEach(card => {
        card.style.backgroundColor = theme === 'dark' ? COLORS.DARK_GRAY : COLORS.WHITE;
    });
    document.querySelectorAll('.card-header').forEach(header => {
        header.style.backgroundColor = theme === 'dark' ? COLORS.DARK_GRAY : COLORS.WHITE;
    });
    document.querySelectorAll('.card-title, .lead').forEach(text => {
        text.style.color = theme === 'dark' ? COLORS.ALABASTER : '#333';
    });
}

export function updateToggleIcons(theme, sunIcon, moonIcon) {
    if (theme === 'dark') {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
    }
}
