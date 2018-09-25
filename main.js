$(document).ready(() => {
    $('button').click((event) => {
        $(this).addClass('hidden');
        if (event.target.classList[0] == "box") {
            getNextClass(this, event.target);
            
        }
    });
});

function getNextClass(element, target) {
    let current = target.classList[1];
    console.log(current);
    console.log($(element).children);
//    switch (current) {
//        case "icon-cross":
//            $(`#${id}`).removeClass("icon-cross").addClass("icon-minus");
//            break;
//        case "icon-minus":
//            $(`#${id}`).removeClass("icon-minus").addClass("icon-plus");
//            break;
//        case "icon-plus":
//            $(`#${id}`).removeClass("icon-plus").addClass("icon-cross");
//            break;
//        default:
//            console.err("Wrong target or class");
//            break;
//    }
}
