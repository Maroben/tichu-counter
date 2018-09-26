$(document).ready(() => {
    $('button').click((event) => {
        if (event.target.classList[0] == "box3") {            
            getNextClass3(event.target);
        }
        else if (event.target.classList[0] == "box2") {
            getNextClass2(event.target);
        }
    });
});

function getNextClass2(target) {
    switch (target.classList[1]) {
        case "icon-minus":
             $(target).removeClass("icon-minus").addClass("icon-plus");
            break;
        case "icon-plus":
             $(target).removeClass("icon-plus").addClass("icon-minus");
            break;
        default:
            console.log("Wrong target or class");
            break;
    }
}

function getNextClass3(target) {
    switch (target.classList[1]) {
        case "icon-cross":
            $(target).removeClass("icon-cross").addClass("icon-minus");
            break;
        case "icon-minus":
             $(target).removeClass("icon-minus").addClass("icon-plus");
            break;
        case "icon-plus":
             $(target).removeClass("icon-plus").addClass("icon-cross");
            break;
        default:
            console.log("Wrong target or class");
            break;
    }
}