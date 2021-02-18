export function mergeSort(
    array,
    start,
    end,
    workArray,
    anims
) {
    if (start == end) {
        return
    }
    const initialStart = start
    const initialEnd = end
    const middle = Math.floor((start + end) / 2)
    anims.push({ type: "split", left: [start, middle], right: [middle + 1, end], middle: [middle, middle + 1] })//initial split
    mergeSort(workArray, start, middle, array, anims);
    mergeSort(workArray, middle + 1, end, array, anims);
    anims.push({ type: "merge", start: start, end : end, last: (initialStart == start && initialEnd == end) })// TODO: add last merge checking
    merge(array, start, middle, end, workArray, anims);
}
function merge(
    array,
    start,
    middle,
    end,
    workArray,
    anims
) {

    let k = start
    let i = start
    let j = middle + 1
    //perform the merge in sort order
    while (i <= middle && j <= end) {
        //compare
        anims.push({ type: "compare", vals: [i, j, (workArray[i] <= workArray[j]) ? i : j] })
        if (workArray[i] <= workArray[j]) {
            anims.push({ type: "change", vals: [k, workArray[i]] });
            array[k++] = workArray[i++];
        } else {
            anims.push({ type: "change", vals: [k, workArray[j]] });
            array[k++] = workArray[j++];
        }
    }


    //pick up the last element(s)
    while (i <= middle) {
        anims.push({ type: "change", vals: [k, workArray[i], i] });
        array[k++] = workArray[i++];
    }
    while (j <= end) {
        anims.push({ type: "change", vals: [k, workArray[j], j] });
        array[k++] = workArray[j++];
    }
}