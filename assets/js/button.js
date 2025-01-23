let tl, downloading = false, points = [],
    btn = document.querySelector('.btn'),
    dot = document.querySelector('.dot'),
    text = document.querySelector('.text'),
    mainCirc = document.querySelector('.mainCircle'),
    subCirc = document.querySelector('.subCircle'),
    mainCircFill = document.querySelector('.mainCircleFill'),
    arrow = document.querySelector('.arrow'),
    rect = document.querySelector('.rect');

// Initialize GSAP settings for the rect
gsap.set(rect, { transformOrigin: '50% 50%', rotation: 45 });

btn.addEventListener('click', animation);

function animation() {
    if (downloading) return;
    downloading = true;

    let downloadTime = Math.random() * 0.5 + 0.7;

    // Define the GSAP timeline
    tl = gsap.timeline({
        onComplete: restart,
    });

    tl.restart().play()
        .to(arrow, { y: 2.5, duration: 0.35, ease: 'power1.out' }, 'click')
        .to(text, { scale: 0.77, duration: 0.3, svgOrigin: '55% 35%', ease: 'power1.out' }, 'click+=0.05')
        .set(subCirc, { fillOpacity: 1, strokeOpacity: 1 }, 'squeeze-=0.3')
        .to(subCirc, { fillOpacity: 0, duration: 0.35, ease: 'power1.inOut' }, 'squeeze-=0.3')
        .to(subCirc, { attr: { r: 13 }, strokeOpacity: 0, duration: 0.45, ease: 'none' }, 'squeeze-=0.3')
        .to(btn, { 
            attr: { d: 'M50,25 h0 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s0,0 0,0 a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h0' }, 
            duration: 0.7, 
            ease: 'sine.out' 
        }, 'squeeze')
        .to([mainCirc, mainCircFill, rect, arrow], { x: 30, duration: 0.7, ease: 'sine.out' }, 'squeeze')
        .to(rect, { fill: '#fff', rotation: 270, duration: 0.7, ease: 'sine.out' }, 'squeeze')
        .to(text, { autoAlpha: 0, y: 7, duration: 0.3, onComplete: changeText }, 'squeeze')
        .to(arrow, { 
            attr: { d: 'M20,39 l3.5,-3.5 l-3.5,-3.5 M20,39 l-3.5,-3.5 l3.5,-3.5 M20,39 l0,0' }, 
            rotation: 225, 
            transformOrigin: '50% 50%', 
            duration: 0.7, 
            ease: 'sine.out' 
        }, 'squeeze')
        .to(dot, { attr: { r: 1.5 }, duration: 0.4, ease: 'back.out(7)' })
        .set(subCirc, { drawSVG: 0, strokeOpacity: 1, x: 30, rotation: -90, attr: { r: 9.07 } })
        .to(subCirc, { drawSVG: '102%', duration: downloadTime, ease: 'power2.in' }, 'fill+=0.02')
        .to(dot, { 
            bezier: { type: 'cubic', values: points }, 
            attr: { r: 2.7 }, 
            duration: downloadTime, 
            ease: 'power2.in' 
        }, 'fill')
        .to('.gradient', { attr: { offset: '0%' }, duration: downloadTime, ease: 'power2.in' }, 'fill')
        .to(dot, { fill: '#02fc86', y: -22, duration: 0.44, ease: 'power1.out' }, 'stretch-=0.01')
        .to(dot, { scaleX: 0.5, duration: 0.27, transformOrigin: '50% 50%', ease: 'slow(0.1, 2, true)' }, 'stretch+=0.04')
        .to(dot, { scaleY: 0.6, duration: 0.3, ease: 'slow(0.1, 2, true)' }, 'stretch+=0.31')
        .to(dot, { scaleX: 0.4, y: 22, duration: 0.44, ease: 'power2.in' }, 'stretch+=0.45')
        .to([mainCirc, subCirc, arrow, rect, mainCircFill], { opacity: 0, duration: 0.33, ease: 'power2.out' }, 'stretch+=0.2')
        .to(btn, { 
            attr: { d: 'M50,25 h20 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s-20,0 -40,0 a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h20' }, 
            duration: 0.4, 
            ease: 'power1.out' 
        }, 'stretch+=0.2')
        .set(dot, { opacity: 0 }, 'stretch+=0.875')
        .to(btn, { stroke: '#02fc86', duration: 0.01, ease: 'power2.in' }, 'stretch+=0.87')
        .to(btn, { 
            attr: { d: 'M50,25 h20 a10,10 0 0,1 10,10 a12,12 0 0,1 -10,10.5 s-20,6 -40,0 a12,12 0 0,1 -10,-10.5 a10,10 0 0,1 10,-10 h20' }, 
            duration: 0.3, 
            ease: 'power1.out' 
        }, 'stretch+=0.869')
        .to(text, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(2.5)' }, 'stretch+=0.855');
}

function restart() {
    setTimeout(() => {
        tl.seek(0).pause();
        text.textContent = 'download';
        gsap.set(text, { x: 0 });
        downloading = false;
    }, 2000);
}

function changeText() {
    text.textContent = 'open';
    gsap.set(text, { x: -5 });
}

// Initialize points for animation
(function () {
    let data = Snap.path.toCubic('M0,0 a9,9 0 0,1 0,18 a9,9 0 0,1 0,-18');
    data.forEach(seg => {
        for (let i = 1; i < seg.length; i += 2) {
            points.push({ x: seg[i], y: seg[i + 1] });
        }
    });
})();
