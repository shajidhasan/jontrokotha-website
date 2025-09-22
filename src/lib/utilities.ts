export const slugify = (text: string) => {
    return text.toLowerCase().replace(/ /g, '-');
}

export const choice = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
}
