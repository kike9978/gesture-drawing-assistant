


function hola() {

}

export default function VideoCard() {


    return (
        <button onClick={hola}>
            <img src="${item.snippet.thumbnails.high.url}" />
            <h3>${item.snippet.title}</h3>
        </button>
    )
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
}