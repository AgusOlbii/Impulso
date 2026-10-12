
export function currentDay(){
    const today = new Date();

    const nameDay = today.toLocaleDateString('es-ES', { weekday: 'long' });
    const numberDay = today.getDate();
    const nameMonth = today.toLocaleDateString('es-ES', { month: 'long' });

    const capitalDay = nameDay.charAt(0).toUpperCase() + nameDay.slice(1);
    const capitalMonth = nameMonth.charAt(0).toUpperCase() + nameMonth.slice(1);

    return{
        nameDay: capitalDay,
        numberDay,
        nameMonth: capitalMonth,
        eyebrowText: `${capitalDay}, ${numberDay} de ${capitalMonth}`
        }
}