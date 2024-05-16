const videoSection = document.querySelector("section")
function diversion(query) {

    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAQryODzfyqnVja2PMHtD2g5KEicoSKZqM&maxResults=10`)
        .then(res => res.json())
        .then(data => {
            console.log(data.items[0])
            data.items.forEach(item => {
                const button = document.createElement("button")
                button.innerHTML += `
                <button>
                
                <img src="${item.snippet.thumbnails.high.url}" />
                <h3>${item.snippet.title}</h3>
                </button>
                `
                console.log(item.id.videoId)
                videoSection.appendChild(button)

                button.addEventListener("click", () => {
                    cleanVideoSection()
                    videoSection.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    `
                })
            })
        }
        )

}

const form = document.querySelector("form")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    cleanVideoSection()

    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)

    console.log(formObj)

    diversion(formObj.query)
})

function cleanVideoSection() {
    videoSection.innerHTML = ""
}
