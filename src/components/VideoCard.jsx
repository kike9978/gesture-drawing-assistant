
export default function VideoCard() {
    return (
        <button onClick={hola}>
            <img src="${item.snippet.thumbnails.high.url}" />
            <h3>${item.snippet.title}</h3>
        </button>
    )
}