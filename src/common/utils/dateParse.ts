import moment, { type Moment } from "moment";

export function parseDateFromNow(date: Moment | string): string {
    const replacer = [
        [" seconds", "s"],
        [" minutes", "m"],
        [" hours", "h"],
        [" days", "d"],
        [" months", "M"],
        [" years", "y"],
    ];
    let fromNow = moment(date).fromNow();
    replacer.forEach(([from, to]) => {
        fromNow = fromNow.replace(from, to);
    });

    return fromNow;
}

export function parseDate(date: Moment): string {
    return moment(date).format("MMM DD, YYYY");
}

export function parseTime(date: Moment): string {
    return moment(date).format("hh:mm A");
}

export function parseDateTime(date: Moment): string {
    return `${parseDate(date)} ${parseTime(date)}`;
}