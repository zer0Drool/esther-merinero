console.log('design: Jaime del Corro');
console.log('development: @mobius_blip');

// mobile detection
let mobile = window.matchMedia("(pointer:coarse)").matches;

// loading
let loadingWrap = document.getElementById('loading-wrap');
let loadingText = document.getElementById('loading-text');
let loadingInt;
let loadingArr = ['loading', 'loading.', 'loading..', 'loading...'];
let loadingCount = 0;

function loading() {
    loadingText.innerText = loadingArr[loadingCount];
    loadingCount = loadingCount < loadingArr.length - 1 ? loadingCount + 1 : 0;
};

loadingInt = setInterval(loading, 250);

// get data
let works = {};
let icons = [];

// axios.get('http://192.168.0.78/estherm/index.php/wp-json/wp/v2/works/?per_page=100')
axios.get('https://esthermerinero.com/wp-json/wp/v2/works/?per_page=100')
.then(res => {
    res.data.map(post => {

        // console.log(post);
        let work = post.acf;
        let title = work.name.replace(/<\/?[^>]+(>|$)/g, "");
        works[title] = {
            rgb: `${work.r}, ${work.g}, ${work.b}`,
            x: work.x,
            y: work.y,
            width: work.width,
            description: work.description,
            dimensions: work.dimensions,
            materials: work.materials,
            extra: work.extra,
            extraLink: work.extra_link,
            year: work.year,
            icon: work.icon,
            media: []
        };

        for (var i = 1; i <= 8; i++) {
            let url = `${i}_image`;
            let type = `${i}_media_type`;
            let layout = `${i}_media_layout`;
            if (work[url]) {
                let mediaObj = {
                    url: work[url],
                    type: work[type],
                    layout: work[layout]
                };
                works[title].media.push(mediaObj);
            };
        };

    });
})
.then(() => {
    console.log(Object.entries(works));
    console.log(works);
    let worksArr = Object.entries(works);
    for (var i = 0; i < worksArr.length; i++) {
        let title = worksArr[i][0];
        let details = worksArr[i][1];
        let icon = document.createElement('img');
        icon.onload = () => {
            icons.push(icon);
            if (icons.length === worksArr.length) {
                console.log('all loaded bb');
                init();
            };
        };
        icon.classList.add('homepageImgs');
        icon.style.left = `${details.x}%`;
        icon.style.top = `${details.y}px`;
        icon.style.width = `${details.width}px`;
        icon.alt = title;
        icon.src = details.icon;
    }
})
.catch(err => console.log(err));

function init() {

    console.log('lets go');

    clearInterval(loadingInt);
    loadingCount = 0;
    loadingText.innerText = 'loading';
    loadingWrap.style.display = 'none';

    let homepageWrap = document.getElementById('homepage-wrap');
    for (var i = 0; i < icons.length; i++) {
        homepageWrap.appendChild(icons[i]);
        if (i === icons.length - 1) {
            setTimeout(() => homepageWrap.style.opacity = '1', 800);
        };
    };

    // vars
    let title = document.getElementsByTagName('h1')[0];
    let imgs = document.getElementsByClassName('homepageImgs');
    let contactIcons = document.getElementsByClassName('contactIcon');
    let info = document.getElementById('info');
    let work = document.getElementById('work-view');
    let workViewInner = document.getElementById('work-view-inner');
    let workDeets = document.getElementById('work-deets');
    let workText = document.getElementById('work-text');
    let firstWorkImage = document.getElementById('first-work-image');
    let workImages = document.getElementById('work-images');
    let extra = document.getElementById('extra');
    let colors = ['red', 'blue', 'gold', 'lime'];
    let prevRandom = null;
    let infoOpen = false;
    let transitioning = false;
    let workOpen = false;
    let mediaElements = [];

    // functions
    function random(max, min) {
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (random !== prevRandom) {
            console.log(random);
            prevRandom = random;
            return random;
        } else {
            random(max, min);
        };
    };

    function titleMouseover() {
        if (workOpen) {
            title.innerText = 'close';
        };
    };

    function titleMouseleave() {
        if (workOpen) {
            title.innerText = workOpen;
        };
    };

    function titleClick() {
        if (!transitioning) {
            transitioning = true;
            if (workOpen) {
                work.style.opacity = '0';
                title.innerText = 'Esther Merinero';
                document.body.style.overflowY = 'scroll';
                document.body.style.backgroundColor = 'white';
                if (loadingInt) {
                    loadingWrap.style.display = 'none';
                    clearInterval(loadingInt);
                    loadingCount = 0;
                    loadingText.innerText = 'loading';
                };
                setTimeout(() => {
                    work.style.display = 'none';
                    workViewInner.style.display = 'none';
                    workOpen = false;
                }, 400);
            } else if (infoOpen) {
                info.style.opacity = '0';
                title.innerText = 'Esther Merinero';
                document.body.style.overflowY = 'scroll';
                setTimeout(() => {
                    info.style.display = 'none';
                    infoOpen = false;
                }, 400);
            } else {
                info.style.display = mobile ? 'block' : 'flex';
                document.body.style.overflowY = 'hidden';
                setTimeout(() => {
                    info.style.opacity = '1';
                    title.innerText = 'close';
                    infoOpen = true;
                }, 50);
            };
            setTimeout(() => {
                transitioning = false;
            }, 400);
        };
    };

    function workMouseover(e) {
        if (!workOpen) {
            title.style.pointerEvents = 'none';
        };
        title.innerText = e.target.alt;
        e.target.style.filter = 'drop-shadow(8px 8px 20px rgb(172, 167, 167)) brightness(1)';
        document.body.style.backgroundColor = `rgba(${works[e.target.alt].rgb}, 1)`;
        if (!mobile) {
            e.target.style.animation = 'bounce 1s linear 2';
        };
    };

    function workMouseleave(e) {
        title.style.pointerEvents = 'auto';
        if (!workOpen) {
            title.innerText = 'Esther Merinero';
            e.target.style.filter = 'drop-shadow(8px 8px 20px rgb(172, 167, 167)) brightness(0)';
            document.body.style.backgroundColor = 'white';
        };
        if (!mobile) {
            e.target.style.animation = '';
        };
    };

    function workClick(e) {
        if (!transitioning) {

            workOpen = e.target.alt;
            title.innerText = e.target.alt;
            document.body.style.overflowY = 'hidden';
            work.style.backgroundColor = `rgba(${works[e.target.alt].rgb}, 0.9)`;

            // text
            workText.innerHTML = '';
            if (works[e.target.alt].description) {
                workText.innerHTML = works[e.target.alt].description;
                // workImages.style.marginTop = '70px';
            };
            if (!mobile && workText.innerHTML === '') {
                workText.style.marginBottom = '0px';
            } else if (!mobile && workText.innerHTML !== '') {
                workText.style.marginBottom = '100px';
            };
            if (mobile && workText.innerHTML === '') {
                workText.style.marginBottom = '0px';
            } else if (mobile && workText.innerHTML !== '') {
                workText.style.marginBottom = '8px';
            };

            // details
            workDeets.innerHTML = `<p>${works[e.target.alt].materials}</p>
                                   <p>${works[e.target.alt].dimensions}</p>
                                   <p>${works[e.target.alt].year}</p>`;

            // media elements
            mediaElements = [];
            workImages.innerHTML = '';
            let mediaLoadingCount = 0;
            for (var i = 0; i < works[e.target.alt].media.length; i++) {
                let div = document.createElement('div');
                let elem = works[e.target.alt].media[i].type === 'image' ? document.createElement('img') : document.createElement('video');
                elem.onload = () => {
                    mediaLoadingCount++;
                    if (mediaLoadingCount === works[e.target.alt].media.length) {
                        for (var i = 0; i < mediaElements.length; i++) {
                            workImages.appendChild(mediaElements[i]);
                            console.log(mediaElements[i]);
                            if (i === mediaElements.length - 1) {
                                mediaLayout(e.target.alt);
                            };
                        };
                    };
                };
                elem.src = works[e.target.alt].media[i].url;
                elem.classList.add('media');
                elem.layout = works[e.target.alt].media[i].layout;
                div.appendChild(elem);
                mediaElements.push(div);
            };

            // extra info
            extra.innerHTML = works[e.target.alt].extra.indexOf('<p>') === -1 ? `<p>${works[e.target.alt].extra}</p>` : works[e.target.alt].extra;
            if (works[e.target.alt].extraLink) {
                console.log(works[e.target.alt].extraLink);
                let extraX = extra.innerHTML.replace(`${works[e.target.alt].extraLink.title}`, `<a href="${works[e.target.alt].extraLink.url}" target="_blank">${works[e.target.alt].extraLink.title}</a>`);
                extra.innerHTML = extraX;
            };
            e.target.style.filter = mobile ? 'drop-shadow(8px 8px 20px rgb(172, 167, 167)) brightness(1)' : 'drop-shadow(8px 8px 20px rgb(172, 167, 167)) brightness(0)';
            // work.style.display = 'flex';
            work.style.display = 'block' ;
            work.scrollTop = 0;
            work.style.opacity = '1';
            setTimeout(() => {
                if (workViewInner.style.display !== 'block') {
                    console.log(workViewInner.style.display);
                    loadingWrap.style.display = 'flex';
                    loadingInt = setInterval(loading, 250);
                };
            }, 1000);

        };
    };

    function mediaLayout(target) {
        let portraitCount = 0;
        setTimeout(() => {
            let media = document.getElementsByClassName('media');
            console.log(media);

            for (let i = 0; i < media.length; i++) {
                if (works[target].media[i].layout === 'horizontal-single') {
                    media[i].parentElement.style.width = mobile ? '90%' : '60%';
                    media[i].parentElement.style.display = 'block';
                } else if (works[target].media[i].layout === 'horizontal-small') {
                    media[i].parentElement.style.width = mobile ? '90%' : '20%';
                    media[i].parentElement.style.display = 'block';
                } else if (works[target].media[i].layout === 'vertical-single') {
                    media[i].parentElement.style.width = mobile ? '90%' : '30%';
                    media[i].parentElement.style.display = 'block';
                } else if (works[target].media[i].layout === 'vertical-small') {
                    media[i].parentElement.style.width = mobile ? '90%' : '15%';
                    media[i].parentElement.style.display = 'block';
                } else if (works[target].media[i].layout === 'vertical-double') {
                    media[i].parentElement.style.width = mobile ? '90%' : '30%';
                    media[i].parentElement.style.display = 'inline-block';
                    portraitCount++;
                };
                if (portraitCount === 2 && !mobile) {
                    let div = document.createElement('div');
                    let parent = media[i].parentElement.parentNode;
                    parent.insertBefore(div, media[i].parentElement);
                    div.appendChild(media[i - 1].parentElement);
                    div.appendChild(media[i].parentElement);
                    portraitCount = 0;
                };

                if (i === media.length -1) {
                    loadingWrap.style.display = 'none';
                    clearInterval(loadingInt);
                    loadingCount = 0;
                    loadingText.innerText = 'loading';
                    workViewInner.style.display = 'block';
                };
            };
        }, 50);
    };

    // event listeners
    title.addEventListener('click', titleClick);
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('mouseover', (e) => workMouseover(e));
        imgs[i].addEventListener('mouseleave', (e) => workMouseleave(e));
        imgs[i].addEventListener('click', (e) => workClick(e));
    };


};
