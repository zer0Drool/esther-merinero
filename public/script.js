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

let title = document.getElementsByTagName('h1')[0];

// loadingInt = setInterval(loading, 250);

// get work data
let dataFetchCount = 0;

let works = {};
let icons = [];

// axios.get('http://192.168.0.78/estherm/index.php/wp-json/wp/v2/works/?per_page=100')
axios.get('https://esthermerinero.com/wp-json/wp/v2/works/?per_page=100')
.then(res => {
    res.data.map(post => {

        console.log(post);
        let work = post.acf;
        let title = work.name.replace(/&#8212;/g, "-").replace(/&#8211;/g, "-").replace('(', '<span style="margin-right: 12px;">(</span>').replace(')', '<span style="margin-left: 12px;">)</span>');
        // let title = work.name.replace(/<\/?[^>]+(>|$)/g, "").replace(/&#8212;/g, "-").replace(/&#8211;/g, "-").replace(/&#8217;/g, "'");
        works[title] = {
            rgb: `${work.r}, ${work.g}, ${work.b}`,
            x: work.x,
            y: work.y,
            width: work.width,
            // description: work.description,
            dimensions: work.dimensions,
            materials: work.materials,
            extra: work.extra_x.replace(new RegExp('<em>', 'g'), '<span class="italic">').replace(new RegExp('</em>', 'g'), '</span>'),
            year: work.year,
            icon: work.icon,
            media: []
        };

        for (var i = 1; i <= 8; i++) {
            // let url = `${i}_image`;
            let type = `${i}_media_type`;
            let layout = `${i}_media_layout`;
            let description = `${i}_description`;
            let text = `${i}_text`;
            let outline = `${i}_text_outline`;
            let shadow = `${i}_text_shadow`;
            let url = work[type] === 'image' ? `${i}_image` : `${i}_video`;
            work[description] = work[description] ? work[description].replace(new RegExp('<em>', 'g'), '<span class="italic">').replace(new RegExp('</em>', 'g'), '</span>') : work[description];
            if (mobile) {
                work[text] = work[text] ? work[text].replace(new RegExp('<em>', 'g'), '<span class="italic-text">').replace(new RegExp('</em>', 'g'), '</span>').replace(new RegExp('font-size: 2.3vmin', 'g'), 'font-size: 4.3vmin').replace(new RegExp('font-size: 2vmin', 'g'), 'font-size: 3.5vmin') : work[text];
            } else {
                work[text] = work[text] ? work[text].replace(new RegExp('<em>', 'g'), '<span class="italic-text">').replace(new RegExp('</em>', 'g'), '</span>') : work[text];
            };

            if (work[url]) {
                let mediaObj = {
                    url: work[url],
                    type: work[type],
                    layout: work[layout],
                    description: work[description],
                    text: work[text],
                    outline: work[outline],
                    shadow: work[shadow]
                };
                works[title].media.push(mediaObj);
            };
        };

    });
})
.then(() => {
    // console.log(Object.entries(works));
    let worksArr = Object.entries(works);
    console.log(worksArr);
    let worksLoadCount = 0;
    for (var i = 0; i < worksArr.length; i++) {
        let title = worksArr[i][0];
        let details = worksArr[i][1];
        let icon = document.createElement('img');
        icon.onload = () => {
            worksLoadCount++;
            if (worksLoadCount === worksArr.length) {
                console.log('all loaded bb');
                dataFetchCount++;
                // console.log('work loaded', dataFetchCount);
                if (dataFetchCount === 2) {
                    init();
                };
            };
        };
        icons.push(icon);
        icon.classList.add('homepageImgs');
        icon.style.left = `${details.x}%`;
        icon.style.top = `${details.y}px`;
        icon.style.width = mobile ? `${parseInt(details.width) + 12}vh` : `${details.width}vh`;
        icon.alt = title;
        icon.src = details.icon;
    };
})
.catch(err => console.log('error fetching works >>> ', err));

// get info data
let info = {};
let infoView = document.getElementById('info');
let cornerImg = document.getElementById('cornerImg');
let bio = document.getElementById('bio');
let cv = document.getElementById('cv');
let mail = document.getElementById('mail');
let insta = document.getElementById('insta');
let phone = document.getElementById('telephone');

axios.get('https://esthermerinero.com/wp-json/wp/v2/info/?per_page=100')
.then(res => {
    let data = res.data[0].acf;
    // console.log(data);
    info = {
        bio: data.bio,
        cv: data.cv,
        image: data.image,
        insta: data.instagram,
        mail: data.mail,
        phone: data.phone
    };
})
.then(() => {
    bio.innerHTML = info.bio;

    for (var i = 0; i < bio.children.length; i++) {
        if (bio.children[i].style.paddingLeft) {
            bio.children[i].style.paddingLeft = mobile ? '13%' : '20%';
        } else {
            bio.children[i].style.paddingRight = mobile ? '13%' : '20%';
        };
    };

    cv.href = info.cv;
    cv.style.paddingLeft = bio.lastElementChild.style.paddingLeft;
    cornerImg.src = info.image;
    insta.href = info.insta;
    mail.href = `mailto:${info.mail}?subject=Hey%20Esther!`;
    phone.href = info.phone;
    dataFetchCount++;
    // console.log('info loaded', dataFetchCount);
    if (dataFetchCount === 2) {
        init();
    };
})
.catch(err => console.log('error fetching info >>> ', err));

function init() {

    console.log('lets go');

    title.style.animation = 'none';

    // clearInterval(loadingInt);
    // loadingCount = 0;
    // loadingText.innerText = 'loading';
    // loadingWrap.style.display = 'none';

    let homepageWrap = document.getElementById('homepage-wrap');
    for (var i = 0; i < icons.length; i++) {
        homepageWrap.appendChild(icons[i]);
        if (i === icons.length - 1) {
            setTimeout(() => homepageWrap.style.opacity = '1', 800);
        };
    };

    // vars
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
            prevRandom = random;
            return random;
        } else {
            random(max, min);
        };
    };

    function titleMouseover() {
        if (workOpen) {
            title.innerHTML = 'close';
        };
    };

    function titleMouseleave() {
        if (workOpen) {
            title.innerHTML = workOpen;
        };
    };

    function titleClick(e) {
        if (!transitioning) {
            transitioning = true;
            if (workOpen && mobile) {
                console.log('work close');
                workClose(e);
                return;
            } else if (infoOpen && mobile) {
                infoClose(e);
                return;
            } else {
                infoView.style.display = mobile ? 'block' : 'flex';
                document.body.style.overflowY = 'hidden';
                setTimeout(() => {
                    infoView.style.opacity = '1';
                    title.innerHTML = mobile ? 'close' : 'Esther Merinero';
                    infoOpen = true;
                }, 50);
            };
            setTimeout(() => {
                transitioning = false;
            }, 400);
        };
    };

    function infoClose(e) {
        if (!e.target.classList.contains('contactIcon')) {
            transitioning = true;
            info.style.opacity = '0';
            title.innerHTML = 'Esther Merinero';
            document.body.style.overflowY = 'scroll';
            setTimeout(() => {
                info.style.display = 'none';
                infoOpen = false;
                transitioning = false;
            }, 400);
        };
    };

    function workClose(e) {
        if (((e.target.id === 'work-view' || e.target.id === 'work-images' || e.target.id === 'extra') && !transitioning) || (mobile)) {
            transitioning = true;
            let vids = document.getElementsByTagName('video');
            if (vids) {
                for (var i = 0; i < vids.length; i++) {
                    if (!vids[i].paused) {
                        vids[i].pause();
                    };
                };
            };
            work.style.opacity = '0';
            title.innerHTML = 'Esther Merinero';
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
                transitioning = false;
            }, 400);
        };
    };

    function workMouseover(e) {
        if (!mobile) {
            if (!workOpen) {
                title.style.pointerEvents = 'none';
            };
            title.innerHTML = e.target.alt;
            e.target.style.filter = 'drop-shadow(8px 8px 20px rgb(0, 0, 0)) brightness(1)';
            document.body.style.backgroundColor = `rgba(${works[e.target.alt].rgb}, 1)`;
            e.target.style.animation = 'bounce 2.5s ease-in-out infinite';
        };
    };

    function workMouseleave(e) {
        if (!mobile) {
            title.style.pointerEvents = 'auto';
            if (!workOpen) {
                title.innerHTML = 'Esther Merinero';
                e.target.style.filter = 'drop-shadow(8px 8px 20px rgb(0, 0, 0)) brightness(0)';
                document.body.style.backgroundColor = 'white';
            };
            e.target.style.animation = '';
        };
    };

    function workClick(e) {
        if (!transitioning) {

            let loaded = false;
            setTimeout(() => {
                if (!loaded) {
                    title.style.animation = 'loadFlash 3s ease-in-out infinite';
                };
            }, 1000);

            workOpen = e.target.alt;
            if (mobile) {
                title.innerHTML = '<p>close</p>';
            } else {
                title.innerHTML = e.target.alt;
            };
            document.body.style.overflowY = 'hidden';
            work.style.backgroundColor = `rgba(${works[e.target.alt].rgb}, 0.9)`;

            // details
            workDeets.innerHTML = `${mobile ? e.target.alt : ''}
                                   <p>${works[e.target.alt].materials}</p>
                                   <p>${works[e.target.alt].dimensions}</p>
                                   <p>${works[e.target.alt].year}</p>`;

            // media elements
            mediaElements = [];
            workImages.innerHTML = '';
            let mediaLoadingCount = 0;
            for (var i = 0; i < works[e.target.alt].media.length; i++) {
                let div = document.createElement('div');
                div.classList.add('mediaWrap');
                let elem;
                if (works[e.target.alt].media[i].type === 'image') {
                    elem = document.createElement('img');
                    elem.onload = () => {
                        mediaLoadingCount++;
                        if (mediaLoadingCount === works[e.target.alt].media.length && !loaded) {
                            loaded = true;
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
                } else {
                    console.log('video', i);
                    elem = document.createElement('video');
                    elem.src = works[e.target.alt].media[i].url;
                    elem.controls = true;
                    elem.playsInline = true;
                    elem.preload = 'auto';
                   //  elem.onloadedmetadata = () => {
                   //      if (elem.buffered.length === 0) return;
                   //
                   //     var bufferedSeconds = elem.buffered.end(0) - elem.buffered.start(0);
                   //     console.log(bufferedSeconds + ' seconds of video are ready to play!');
                   // };
                    mediaLoadingCount++;
                    console.log(mediaLoadingCount);

                };
                elem.classList.add('media');
                elem.layout = works[e.target.alt].media[i].layout;
                div.appendChild(elem);

                // checking for description
                if (works[e.target.alt].media[i].description && !mobile) {
                    let description = document.createElement('div');
                    description.classList.add('media-description');
                    description.innerHTML = works[e.target.alt].media[i].description;
                    // mediaElements.push(description);
                    div.appendChild(description);
                };

                mediaElements.push(div);

                // checking for text
                if (works[e.target.alt].media[i].text) {
                    let text = document.createElement('div');
                    text.classList.add('media-text');
                    // if (mobile) {
                    //     console.log('change text size');
                    //     works[e.target.alt].media[i].text.replace(new RegExp('2.3vmin', 'g'), '4.5vmin');
                    //     console.log(works[e.target.alt].media[i].text);
                    // };
                    text.innerHTML = works[e.target.alt].media[i].text;
                    if (works[e.target.alt].media[i].outline) {
                        text.style.webkitTextStroke = '0.03vmin black';
                    };
                    if (works[e.target.alt].media[i].shadow) {
                        text.style.textShadow = '0vmin 0vmin 0.5vmin black';
                    };
                    mediaElements.push(text);
                };

                if (mediaLoadingCount === works[e.target.alt].media.length && !loaded) {
                    loaded = true;
                    for (var i = 0; i < mediaElements.length; i++) {
                        workImages.appendChild(mediaElements[i]);
                        console.log('media elements', mediaElements[i]);
                        if (i === mediaElements.length - 1) {
                            mediaLayout(e.target.alt);
                        };
                    };
                };

            };

            // extra info
            extra.innerHTML = works[e.target.alt].extra.indexOf('<p>') === -1 ? `<p>${works[e.target.alt].extra}</p>` : `${works[e.target.alt].extra}`;

            // show
            e.target.style.filter = mobile ? 'brightness(1)' : 'drop-shadow(8px 8px 20px rgb(0, 0, 0)) brightness(0)';
            work.style.display = 'block' ;
            work.scrollTop = 0;
            work.style.opacity = '1';

            // loading if necessary
            // setTimeout(() => {
            //     if (workViewInner.style.display !== 'block') {
            //         loadingWrap.style.display = 'flex';
            //         loadingInt = setInterval(loading, 250);
            //     };
            // }, 1000);

        };
    };

    function mediaLayout(target) {
        let portraitCount = 0;
        setTimeout(() => {
            let medText = document.getElementsByClassName('media-text');
            for (var i = 0; i < medText.length; i++) {
                for (var j = 0; j < medText[i].children.length; j++) {
                    if (medText[i].children[j].style.paddingLeft) {
                        medText[i].children[j].style.paddingLeft = mobile ? '13%' : '20%';
                    } else {
                        medText[i].children[j].style.paddingRight = mobile ? '13%' : '20%';
                    };
                    if (medText[i].children[j].style.fontSize && mobile) {
                        console.log('xxxx', medText[i].children[j]);
                        if (medText[i].children[j].style.fontSize === '2.3vmin') {
                            medText[i].children[j].style.fontSize = '4.3vmin';
                        } else if (medText[i].children[j].style.fontSize === '2vmin') {
                            medText[i].children[j].style.fontSize = '3.5vmin';
                        };
                    };
                };
            };
            let italics = document.getElementsByClassName('italic-text');
            for (var i = 0; i < italics.length; i++) {
                italics[i].style.fontFamily = `${italics[i].parentNode.style.fontFamily}i`
            };

            if (extra.innerText === '') {
                console.log(extra);
                extra.style.marginBottom = '0vh';
                let x = extra.previousElementSibling.lastElementChild;
                if (x.classList.contains('mediaWrap')) {
                    x.style.marginBottom = '10vh';
                } else if (x.classList.contains('double-portrait-wrap')) {
                    for (var i = 0; i < x.children.length - 1; i++) {
                        x.children[i].style.marginBottom = '10vh';
                    };
                };
            } else {
                extra.style.marginBottom = mobile ? '20vh' : '30vh';
            };

            let vids = document.getElementsByTagName('video');
            if (vids.length) {
                for (var i = 0; i < vids.length; i++) {
                    vids[i].play();
                    vids[i].pause();
                };
            };

            let media = document.getElementsByClassName('media');
            for (let i = 0; i < media.length; i++) {
                if (works[target].media[i].layout === 'horizontal-single' || works[target].media[i].layout === 'vertical-single') {
                    if (mobile) {
                        media[i].parentElement.style.width = '94%';
                    } else {
                        media[i].parentElement.style.height = '80vh';
                    };
                } else if (works[target].media[i].layout === 'horizontal-small') {
                    if (mobile) {
                        media[i].parentElement.style.width = '30%';
                    } else {
                        media[i].parentElement.style.height = '20vh';
                    };
                } else if (works[target].media[i].layout === 'vertical-small') {
                    if (mobile) {
                        media[i].parentElement.style.width = '40%';
                    } else {
                        media[i].parentElement.style.height = '30vh';
                    };
                } else if (works[target].media[i].layout === 'vertical-double') {
                    if (mobile) {
                        media[i].parentElement.style.width = '94%';
                    } else {
                        media[i].parentElement.style.height = '80vh';
                    };
                    media[i].parentElement.style.display = 'inline-block';
                    portraitCount++;
                };
                if (portraitCount === 2 && !mobile) {
                    let div = document.createElement('div');
                    div.classList.add('double-portrait-wrap');
                    let parent = media[i].parentElement.parentNode;
                    parent.insertBefore(div, media[i].parentElement);
                    div.appendChild(media[i - 1].parentElement);
                    div.appendChild(media[i].parentElement);
                    portraitCount = 0;
                };

                if (i === media.length -1) {
                    // loadingWrap.style.display = 'none';
                    // clearInterval(loadingInt);
                    // loadingCount = 0;
                    // loadingText.innerText = 'loading';
                    title.style.animation = 'none';
                    workViewInner.style.display = 'block';
                };
            };
        }, 50);
    };

    // event listeners
    title.addEventListener('click', (e) => titleClick(e));
    work.addEventListener('click', (e) => workClose(e));
    info.addEventListener('click', (e) => infoClose(e));
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('mouseover', (e) => workMouseover(e));
        imgs[i].addEventListener('mouseleave', (e) => workMouseleave(e));
        imgs[i].addEventListener('click', (e) => workClick(e));
    };


};
