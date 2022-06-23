const AddBtn = document.getElementById("add")
const Bar = document.getElementById("bar")
const Resize = document.getElementById("resize")
const Create = document.getElementById("create")
const Container = document.querySelector(".create")
const Postites = document.querySelector(".list")
const Background = document.querySelector(".background")
const Scroll = document.getElementById("scroll")
const ColorBar = document.getElementById("color")

//Abrir e Fechar Barra Arrastando
let starty
let y

function ycheck(e) {
    y = e.clientY
}
function resizeBar() {
    let height = Bar.offsetHeight
    let width = AddBtn.offsetWidth

    if (starty > y) {
        Bar.style.height = `${height + 8}px`
        AddBtn.style.width = `${width - 6}px`
        displayPostites()
    } else if (starty < y) {
        Bar.style.height = `${height - 8}px`
        AddBtn.style.width = `${width + 6}px`
        displayPostites()
    }
    if (height > 350) {
        document.removeEventListener("mousemove", ycheck)
        document.removeEventListener("mousemove", resizeBar)
        Bar.style.height = "350px"
        AddBtn.style.width = "70px"
    } else if (height < 50) {
        document.removeEventListener("mousemove", ycheck)
        document.removeEventListener("mousemove", resizeBar)
        Bar.style.height = "50px"
        AddBtn.style.width = "300px"
    }
}

//Abrir e Fechar Automaticamente
function autoResize() {
    let height = Bar.offsetHeight
    let width = AddBtn.offsetWidth
    let id = null
    if (height >= 175) {
        function resize() {
            clearInterval(id)
            id = setInterval(frame, 1)
            function frame() {
                if (height >= 350) {
                    displayPostites()
                    clearInterval(id)
                    function resize() {
                        clearInterval(id)
                        id = setInterval(frame, 1)
                        function frame() {
                            if (width <= 70) {
                                clearInterval(id)
                            } else {
                                width--
                                AddBtn.style.width = width + "px"
                            }
                        }
                    }
                    resize()
                } else {
                    height++
                    Bar.style.height = height + "px"
                }
            }
        }
    } else {
        function resize() {
            clearInterval(id)
            id = setInterval(frame, 1)
            function frame() {
                if (height <= 50) {
                    displayPostites()
                    clearInterval(id)
                    function resize() {
                        clearInterval(id)
                        id = setInterval(frame, 1)
                        function frame() {
                            if (width >= 300) {
                                clearInterval(id)
                            } else {
                                width++
                                AddBtn.style.width = width + "px"
                            }
                        }
                    }
                    resize()
                } else {
                    height--
                    Bar.style.height = height + "px"
                }
            }
        }
    }
    resize()
}

function displayPostites() {
    const display = document.querySelector(".postites")
    let height = Bar.offsetHeight
    if (height >= 350) {
        display.style.display = "block"
        Bar.style.overflow = "hidden"
        Scroll.style.display = "block"
    } else {
        display.style.display = "none"
        Bar.style.overflow = "visible"
        Scroll.style.display = "none"
    }
}

Resize.addEventListener("mousedown", (e) => {
    starty = e.clientY
    document.addEventListener("mousemove", ycheck)
    document.addEventListener("mousemove", resizeBar)
    document.addEventListener("mouseup", () => {
        autoResize()
        document.removeEventListener("mousemove", ycheck)
        document.removeEventListener("mousemove", resizeBar)
    })
})

//Abre e Fecha AddBtn

AddBtn.addEventListener("click", () => {
    let height = Bar.offsetHeight

    if (height >= 175) {
        Create.style.left = "70px"
        Create.style.borderTopLeftRadius = "0px"
        Create.style.borderBottomRightRadius = "10px"
        Create.style.height = "350px"
        Create.style.bottom = "0px"
        ColorBar.style.top = "300px"
        AddBtn.style.zIndex = "3"
    } else {
        Create.style.left = "0px"
        Create.style.borderTopLeftRadius = ""
        Create.style.borderBottomRightRadius = ""
        Create.style.height = "300px"
        Create.style.bottom = "50px"
        ColorBar.style.top = "-50px"
        AddBtn.style.zIndex = "4"
    }

    Resize.addEventListener("mousedown", () => {
        Create.classList.add("displaynone")
        AddBtn.classList.add("btnborder")
    })
    Create.classList.toggle("displaynone")
    AddBtn.classList.toggle("btnborder")
})

//Escolher Cor Postite
const radioButtons = document.querySelectorAll("input[name='color']")
Create.style.backgroundColor = "var(--redbutton)"
Create.style.boxShadow = "5px 0px var(--redbuttonshadow)"
AddBtn.style.backgroundColor = "var(--redbutton)"
AddBtn.style.boxShadow = "5px 0px var(--redbuttonshadow)"
//Postites

const bucket = document.getElementById("bucket")
const trash = document.getElementById("trash")

getPostites().forEach((postites) => {

    const postite = document.createElement("div")
    postite.classList.add("postite")
    postite.classList.add("draggable")
    postite.setAttribute("draggable", "true")
    const title = document.createElement("div")
    title.classList.add("title")
    const head = document.createElement("input")
    head.value = postites.header
    head.maxLength = "20"
    const body = document.createElement("textarea")
    body.value = postites.content
    body.maxLength = "348"
    title.style.backgroundColor = postites.color
    const alertbox = document.createElement("div")
    alertbox.classList.add("alertbox")
    const color = document.createElement("button")
    color.classList.add("changecolor")
    const deleted = document.createElement("button")
    deleted.classList.add("delete")

    head.addEventListener("input", () => {
        updatePostiteHead(postites.id, head.value)
    })

    body.addEventListener("input", () => {
        updatePostiteBody(postites.id, body.value)
    })
    let pressed
    postite.addEventListener("dblclick", () => {
        if (title.classList != "title new") {
            alertbox.style.display = "flex"
            color.appendChild(bucket)
            deleted.appendChild(trash)
            color.style.backgroundColor = title.style.backgroundColor
        }

        deleted.addEventListener("click", remove)
    })
    color.addEventListener("click", () => { chooseColor(title, postites, color) })
    function remove() {
        Background.appendChild(alertbox)
        alertbox.style.display = "none"
        deletePostite(postites.id, postite, title, head, body)
        deleted.removeEventListener("click", remove)
    }

    alertbox.addEventListener("click", () => {
        pressed = true

    })

    document.body.addEventListener("click", () => {
        if (!pressed) {
            alertbox.style.display = "none"
        }

        pressed = false
    })
    Postites.appendChild(postite)
    postite.appendChild(title)
    postite.appendChild(body)
    title.appendChild(head)

    alertbox.appendChild(color)
    alertbox.appendChild(deleted)
    postite.insertBefore(alertbox, title)

})

function getPostites() {
    return JSON.parse(localStorage.getItem("postite-storage") || "[]")
}

function savePostites(postite) {
    localStorage.setItem("postite-storage", JSON.stringify(postite))
}

let selectedColor = "red"
function addPostite() {
    const postites = getPostites()
    const postiteObject = {
        id: (Math.random() * 100000),
        header: "",
        content: "",
        color: `var(--${selectedColor})`
    }

    const postite = document.createElement("div")
    postite.classList.add("postite")
    postite.classList.add("draggable")
    postite.setAttribute("draggable", "true")
    postite.classList.add("new")
    const title = document.createElement("div")
    title.classList.add("title")
    title.style.backgroundColor = postiteObject.color
    const head = document.createElement("input")
    head.value = postiteObject.header
    head.maxLength = "20"
    const body = document.createElement("textarea")
    body.value = postiteObject.content
    body.maxLength = "348"
    const alertbox = document.createElement("div")
    alertbox.classList.add("alertbox")
    const color = document.createElement("button")
    color.classList.add("changecolor")
    const deleted = document.createElement("button")
    deleted.classList.add("delete")

    radioButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.checked) {
                selectedColor = btn.value
                postiteObject.color = `var(--${selectedColor})`
            }
            Create.style.backgroundColor = "var(--" + selectedColor + "button)"
            Create.style.boxShadow = " 5px 0px var(--" + selectedColor + "buttonshadow)"
            AddBtn.style.backgroundColor = "var(--" + selectedColor + "button)"
            AddBtn.style.boxShadow = " 5px 0px var(--" + selectedColor + "buttonshadow)"

            if (postite.classList[2] == "new") {
                title.style.backgroundColor = postiteObject.color
            }
            savePostites(postites)
        })
    })
    let pressed
    postite.addEventListener("dblclick", () => {
        if (postite.classList[2] != "new") {
            alertbox.style.display = "flex"
            color.appendChild(bucket)
            deleted.appendChild(trash)
            color.style.backgroundColor = title.style.backgroundColor
            postite.insertBefore(alertbox, title)
        }

        deleted.addEventListener("click", remove)
    })
    color.addEventListener("click", () => { chooseColor(title, postiteObject, color) })
    function remove() {
        Background.appendChild(alertbox)
        alertbox.style.display = "none"
        deletePostite(postiteObject.id, postite, title, head, body)
        deleted.removeEventListener("click", remove)
    }
    alertbox.addEventListener("click", () => {
        pressed = true

    })

    document.body.addEventListener("click", () => {
        if (!pressed) {
            alertbox.style.display = "none"
        }
        pressed = false
    })


    postite.addEventListener("dragstart", () => {
        AddBtn.classList.toggle("btnborder")
        setTimeout(() => { Create.classList.add("displaynone") }, 0)
        postite.addEventListener("dragend", () => {
            updatePostiteHead(postiteObject.id, head.value)
            updatePostiteBody(postiteObject.id, body.value)
        })
    })

    AddBtn.removeEventListener("click", addPostite)

    head.addEventListener("input", () => {
        updatePostiteHead(postiteObject.id, head.value)

    })

    body.addEventListener("input", () => {
        updatePostiteBody(postiteObject.id, body.value)
    })

    Container.appendChild(postite)
    postite.appendChild(title)
    postite.appendChild(body)
    title.appendChild(head)

    alertbox.appendChild(color)
    alertbox.appendChild(deleted)
    postite.insertBefore(alertbox, title)

    beDraggable()
    postites.push(postiteObject)
    savePostites(postites)
}

function updatePostiteHead(id, newContent) {
    const postites = getPostites();
    const targetPostite = postites.filter((postite) => postite.id == id)[0];

    targetPostite.header = newContent;
    savePostites(postites);
}

function updatePostiteBody(id, newContent) {
    const postites = getPostites();
    const targetPostite = postites.filter((postite) => postite.id == id)[0];

    targetPostite.content = newContent;
    savePostites(postites);
}

function deletePostite(id, postite, title, head, body) {
    const postites = getPostites().filter((postite) => postite.id != id);
    title.removeChild(head);
    postite.removeChild(body);
    postite.removeChild(title);
    Background.removeChild(postite);
    Postites.style.width = adjustWidth()
    savePostites(postites);
}

function updateColor(id, newColor) {
    const postites = getPostites();
    const targetPostite = postites.filter((postite) => postite.id == id)[0];

    targetPostite.color = newColor;
    savePostites(postites);
}

function chooseColor(title, postites, color) {
    switch (title.style.backgroundColor) {
        case "var(--red)":
            postites.color = "var(--blue)"
            break;
        case "var(--blue)":
            postites.color = "var(--green)"
            break;
        case "var(--green)":
            postites.color = "var(--purple)"
            break;
        case "var(--purple)":
            postites.color = "var(--yellow)"
            break;
        case "var(--yellow)":
            postites.color = "var(--orange)"
            break;
        default:
            postites.color = "var(--red)"
            break;
    }
    title.style.backgroundColor = postites.color
    color.style.backgroundColor = postites.color
    updateColor(postites.id, postites.color)
}

AddBtn.addEventListener("click", addPostite)

//Arrastar Postites

function beDraggable() {
    const Draggables = document.querySelectorAll(".draggable")
    const Spaces = document.querySelectorAll(".container")
    let postiteX
    let postiteY
    Draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", (e) => {
            draggable.classList.add("dragging")

            let img = new Image();
            e.dataTransfer.setDragImage(img, 0, 0);

            postiteX = e.offsetX
            postiteY = e.offsetY
        })

        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging")
            Postites.style.width = adjustWidth()
        })
    })

    Spaces.forEach(space => {
        space.addEventListener("dragover", e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(space, e.clientX)
            const draggable = document.querySelector(".dragging")
            if (afterElement == null) {
                space.appendChild(draggable)
                if (draggable.classList[2] == "new") {
                    AddBtn.addEventListener("click", addPostite)
                    draggable.classList.remove("new")
                }
            } else {
                space.insertBefore(draggable, afterElement)
                if (draggable.classList[2] == "new") {
                    AddBtn.addEventListener("click", addPostite)
                    draggable.classList.remove("new")
                }
            }
            if (space.classList[0] == "background") {
                getPosition(e, draggable, postiteX, postiteY)
                draggable.style.position = "absolute"
            } else {
                draggable.style.position = "relative"
                draggable.style.left = "0"
                draggable.style.top = "0"
                draggable.style.transform = "translate(0)"
            }
        })
    })

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = x - box.left - box.width / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
}

beDraggable()

//Posicionar Postites

function getPosition(e, postite, postX, postY) {
    let x = e.clientX
    let y = e.clientY
    postite.style.left = x + "px"
    postite.style.top = y + "px"
    postite.style.transform = `translate(-${postX}px, -${postY}px)`
}

//Botões Arrastar Direita e Esquerda

const Right = document.querySelector(".rightbuttom")
const Left = document.querySelector(".leftbuttom")
const view = document.querySelector(".postites")
let left = 0


Right.addEventListener("mouseover", () => {

    move(Right, "right")
})

Left.addEventListener("mouseover", () => {
    move(Left, "left")
})

function move(element, direction) {
    let id = null
    let over = true
    let displaywidth = document.querySelector(".postites").offsetWidth
    clearInterval(id)
    id = setInterval(move, 1)
    element.addEventListener("mouseleave", () => { over = false })
    if (Postites.offsetWidth < displaywidth) {
        Postites.style.width = "auto"
    }
    function move() {
        if (!over || Postites.offsetWidth < displaywidth) {
            clearInterval(id)
            element.removeEventListener("mouseleave", () => { over = false })
        } else {
            if (direction == "right") {
                left -= 4
                margin = left * -1 + view.offsetWidth - 70
                Postites.style.left = left + "px"
                if (margin >= Postites.offsetWidth) {
                    left = Postites.offsetWidth * -1 + view.offsetWidth - 70
                    element.removeEventListener("mouseleave", () => { over = false })
                }
            } else if (direction == "left") {
                left += 4
                Postites.style.left = left + "px"
                if (left > 0) {
                    left = 0
                    element.removeEventListener("mouseleave", () => { over = false })
                }
            }
        }
    }
}

function adjustWidth() {
    const postite = document.querySelectorAll(".list .postite")
    const postitearray = []
    postite.forEach(postite => {
        postitearray.push(postite)
    })
    let length = postitearray.length
    let totallength = `${length * 290}px`
    if(length >= 5){
    return totallength
    }
}
Postites.style.width = adjustWidth()