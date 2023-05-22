export const formatDate = (seconds) => {

    //We calculate the minutes passed between two dates (post date and today)
    const calcMinPassed = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60));
    const miliSecs = seconds * 1000;
    const postDate = new Date(miliSecs)
    const minutesAgo = calcMinPassed(postDate, new Date());

    //Formating the date to render on the post item
    if(minutesAgo === 0) return `New`
    if(minutesAgo < 60) return `${minutesAgo}m`;
    if(minutesAgo > 60 && minutesAgo < 1440) return `${Math.round(minutesAgo / 60)}h`;
    if(minutesAgo >= 1440) return `${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`
}