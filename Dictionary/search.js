import {URL, YOUTUBE_EMBED_URL, YOUTUBE_WATCH_URL} from "../credentials";   

const youtubeIframe = document.getElementById("youtubeIframe"); 

fetch(URL)
    .then((res) => res.json())
    .then((data) => {
        data.items.forEach(items => {
            // console.log(items.snippet.title);
            const markup = `<div id="" class="12345">
                                <div class="bg-sky-300 p-5 m-5 rounded-3xl shadow-lg">
                                    <img class="" src="${items.snippet.thumbnails.medium.url}"/>
                                    <h5 class="text-white">${items.snippet.title.substring(0, 39)}...</h5>
                                </div>
                            </div>`
            document.getElementById("result").insertAdjacentHTML("beforeend", markup);
            document.getElementById("result").lastChild.addEventListener("click", (e) => {
                const embedSrc = `${YOUTUBE_EMBED_URL}${items.snippet.resourceId.videoId}`
                const iframeMarkup = `<iframe style="width: 640px; height: 360px" class="self-center" src="${embedSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
                youtubeIframe.innerHTML = iframeMarkup;
            })
        })
    })
    .catch((err) => console.log("Error", err));
