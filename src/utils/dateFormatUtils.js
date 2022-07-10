import moment from "moment";

function dateToHHMM(date) {
    var d = new Date(date);
    return moment(d).format("HH:mm");
}

export {
    dateToHHMM
}