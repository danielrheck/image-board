function checkNewImages() {
    setTimeout(() => {
        console.log("Count");
        checkNewImages();
    }, 5000);
}

checkNewImages();
