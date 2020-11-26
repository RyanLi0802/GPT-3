window.addEventListener("load", function() {
    $("start").addEventListener("load", function() {
        
    });

    $("start").addEventListener("click", function() {
        alert("I'm clicked");
    });

    // $("start").onclick = alert("I'm clicked again");
    // $("start").click();
    
});

function $(id) {
    return document.getElementById(id);
}