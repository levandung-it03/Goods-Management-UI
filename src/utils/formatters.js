export const capitalizeWords = (str) =>
    str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const trimWords = (str) => str.trim();
export const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value);
export const formatTime = (time) => {
    // time là số giây
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
