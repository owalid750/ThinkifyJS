export function randomizer(arr) {
    // Create a copy of the array to avoid modifying the original array
    let newArr = arr.slice(); // .slice() makes a shallow copy of the array

    // Loop through the array from the end to the beginning
    for (let i = newArr.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the random element
        [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
    }

    return newArr;
}
