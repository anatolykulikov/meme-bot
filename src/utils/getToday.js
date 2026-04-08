/**
 * Получить текущий день
 * @return {string}
 */
export function getToday() {
    return new Date().toLocaleDateString('ru-RU');
}