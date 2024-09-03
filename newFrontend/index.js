import {Initiator} from "./excelScripts/initiator.js"



function init(header,mainContainer) {

    new Initiator(header,mainContainer);

}

document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM Content Loaded")

    const header = document.getElementById('header');
    const mainContainer = document.getElementById("mainContainer");

    init(header,mainContainer);

})