
"use strict";

function getCurrentSlideName() {
    return slideshow.getSlides()[slideshow.getCurrentSlideIndex()].properties["name"];
}


function copyCodeOnClick(element) {
    "use strict";
    const text = element.innerText;
    const textArea = document.createElement('textarea');
    textArea.textContent = text;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

// Return the titles of all slides from `firstIdx` to `secondIdx`
function getAllSlideTitlesAndNumbers(firstIdx, secondIdx) {
    let arr = document.querySelectorAll(".remark-slide-content h1:first-child");

    let array = [];
    for(let i = 0; i < arr.length; i++) {
        let text = arr[i].textContent;
        if (array[array.length-1] !== text) {
            array.push([text, i]);
        }
    }
    return array.slice(firstIdx, secondIdx);
}
