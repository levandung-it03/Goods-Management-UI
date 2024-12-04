export const capitalizeWords = (str) =>
    str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export const trimWords = (str) => str.trim();
export const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN").format(Number(value));
export const formatTime = (time) => {
    // time là số giây
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

// arrayOfTimeL [2024, 11, 30, 17, 25, 50]
export const formatArrayToTime = (arrayOfTime) => {
    const day = +arrayOfTime[2] < 10 ? `0${arrayOfTime[2]}` : `${arrayOfTime[2]}`
    const month = +arrayOfTime[1] < 10 ? `0${arrayOfTime[1]}` : `${arrayOfTime[1]}`
    const hour = +arrayOfTime[3] < 10 ? `0${arrayOfTime[3]}` : `${arrayOfTime[3]}`
    const minute = +arrayOfTime[4] < 10 ? `0${arrayOfTime[4]}` : `${arrayOfTime[4]}`
    const second = +arrayOfTime[5] < 10 ? `0${arrayOfTime[5]}` : `${arrayOfTime[5]}`
    return `${day}/${month}/${arrayOfTime[0]} ${hour}:${minute}:${second}`;
};

export const formatArrayToDate = (dateArray) => {
    if (!dateArray) return "";
    const day = +dateArray[2] < 10 ? `0${dateArray[2]}` : `${dateArray[2]}`
    const month = +dateArray[1] < 10 ? `0${dateArray[1]}` : `${dateArray[1]}`
    return `${day}/${month}/${dateArray[0]}`
}