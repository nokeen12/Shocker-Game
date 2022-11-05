$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
});
const cursor = document.getElementById("cursor");
document.onclick = e => {
    cursor.classList.add('expand');
    setTimeout(() =>{
        cursor.classList.remove('expand');
    }, 100)
}
    document.addEventListener('mousemove', e =>{
        cursor.setAttribute("style", "top: "+(e.pageY-10)+"px; left: "+(e.pageX-10)+"px;")
})