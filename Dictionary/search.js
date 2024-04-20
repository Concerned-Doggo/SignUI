import {URL} from "../credentials";   


fetch(URL)
    .then((res) => res.json())
    .then((data) => {
        data.items.forEach(items => {
            // console.log(items.snippet.title);
            const markup = `<a href="https://www.youtube.com/watch?v=${items.snippet.resourceId.videoId}" class="">
                                <div class="bg-sky-300 p-5 m-5 rounded-3xl shadow-lg">
                                    <img class="" src="${items.snippet.thumbnails.medium.url}"/>
                                    <h5 class="text-white">${items.snippet.title.substring(0, 39)}...</h5>
                                </div>
                            </a>`
            document.getElementById("result").insertAdjacentHTML("beforeend", markup);
        })
    })
    .catch((err) => console.log("Error", err));
