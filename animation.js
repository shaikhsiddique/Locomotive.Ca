
const scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true
    });

const containers = document.querySelectorAll(".textContainer");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!@#$%^&*\t ";
const shuffleTimes = 10;

let totalDuration = 0;

containers.forEach((container, containerIndex) => {
  const finalText = container.textContent;
  container.textContent = "";

  finalText.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char === "\n" ? "\n" : char;
    container.appendChild(span);

    if (char.trim() === "") return; // skip animating spaces

    const timeline = gsap.timeline();
    for (let i = 0; i < shuffleTimes; i++) {
      timeline.to(span, {
        textContent: chars[Math.floor(Math.random() * chars.length)],
        duration: 0.005,
        ease: "none"
      });
    }

    const letterDelay = index * 0.05;
    timeline.to(span, {
      textContent: char,
      duration: 0.01,
      ease: "power2.out",
      delay: letterDelay
    });
    timeline.to(span, {
      opacity:0,
      duration: 0.5,
      ease: "power2.out",
      delay: 2
    });

    totalDuration = Math.max(totalDuration, letterDelay + 0.01); // track the latest time
  });
});

const timeline = gsap.timeline();

timeline.to("#loading-text", {
  opacity: 1,
  scale:1,
  duration: 0.5,
  delay: totalDuration + 2.5
});
timeline.to("#loading-text",{
  delay:0.2,
  onComplete: () => {
    gsap.set("#loading-page", { display: "none" });
  }
})

// Assuming you already initialized locoScroll
scroll.on('scroll', (args) => {
  const scrollY = args.scroll.y; // This is Locomotive's actual scroll position
  const windowHeight = window.innerHeight;
  const nav = document.querySelector("nav");

  if (!nav) return;

  if (scrollY > windowHeight) {
    gsap.to(nav, {
      color: "black",
      duration: 0.3,
      ease: "power1.out",
    });
    nav.classList.replace("text-white", "text-black");
  } else {
    gsap.to(nav, {
      color: "white",
      duration: 0.3,
      ease: "power1.out",
    });
    nav.classList.replace("text-black", "text-white");
  }
});



document.querySelectorAll('.section').forEach(section => {
    const img = section.querySelector('img');
    const spans = section.querySelectorAll('span');
    if (!img) return;

    // Initial setup
    gsap.set(img, { scaleX: 0, filter: "blur(20px)", transformOrigin: "center" });
    gsap.set(spans[0], { xPercent: 0 });
    gsap.set(spans[1], { xPercent: 0 });
    img.classList.add('hidden');

    section.addEventListener('mouseenter', () => {
      img.classList.remove('hidden');
      
      const tl = gsap.timeline();
      tl.to(spans[0], {
        xPercent: -20,
        duration: 1,
        ease: "power3.out"
      }, 0)
      .to(spans[1], {
        xPercent: 20,
        duration: 1,
        ease: "power3.out"
      }, 0)
      .to(img, {
        scaleX: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out"
      }, 0);
    });

    section.addEventListener('mouseleave', () => {
      const tl = gsap.timeline({
        onComplete: () => {
          img.classList.add('hidden');
        }
      });
      tl.to(spans[0], {
        xPercent: 0,
        duration: 1,
        ease: "power3.inOut"
      }, 0)
      .to(spans[1], {
        xPercent: 0,
        duration: 1,
        ease: "power3.inOut"
      }, 0)
      .to(img, {
        scaleX: 0,
        filter: "blur(20px)",
        duration: 1,
        ease: "power3.inOut"
      }, 0);
    });
  });



const model = document.getElementById('model');
let currentIndex = 1;

model.addEventListener("click", () => {
  console.log("clicked")
  currentIndex++;
  if (currentIndex > 3) currentIndex = 1;
  let video = document.getElementById("model-video");
  video.src = `./public/video/boy${currentIndex}.mp4`;
  video.load();
  video.play();
});

model.addEventListener('mouseenter',()=>{
   gsap.to('#cursor', {
    opacity:1,
    duration: 0.5,
    ease: "power3.out"
  });
})
model.addEventListener('mouseleave',()=>{
   gsap.to('#cursor', {
    opacity:0,
    duration: 0.5,
    ease: "power3.out"
  });
})
model.addEventListener("mousemove",(event)=>{
   gsap.to('#cursor', {
    x: event.clientX,
    y: event.clientY,
    duration: 0.5,
    ease: "power3.out"
  });
})

// text animation

document.querySelectorAll(".text-animate").forEach(el => {
  const originalText = el.textContent;
  el.textContent = "";

  // Create and store span elements for each character
  const spans = Array.from(originalText).map(char => {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("inline-block", "whitespace-pre"); // preserve spacing
    return span;
  });

  // Append spans to the element
  spans.forEach(span => el.appendChild(span));

  // Store reference to original span order
  const originalSpans = [...spans];

  el.addEventListener("mouseenter", () => {
    const spanArray = Array.from(el.children);
    const flipState = Flip.getState(spanArray);

    // Middle-based shuffle logic
    const middle = Math.floor(spanArray.length / 2);
    const shuffled = [];
    for (let i = 0; i < spanArray.length; i++) {
      const index = i % 2 === 0
        ? middle + Math.floor(i / 2)
        : middle - Math.ceil(i / 2);
      if (spanArray[index]) shuffled.push(spanArray[index]);
    }

    // Apply the shuffled order
    shuffled.forEach(span => el.appendChild(span));

    Flip.from(flipState, {
      duration: 0.15,
      ease: "power1.inOut",
      stagger: 0.008
    });

    // Return to original span order
    setTimeout(() => {
      const resetState = Flip.getState(el.children);

      originalSpans.forEach(span => el.appendChild(span)); // exact span objects

      Flip.from(resetState, {
        duration: 0.25,
        ease: "back.out(2)",
        stagger: 0.006
      });
    }, 200);
  });
});

document.querySelectorAll('.hover-section').forEach(section => {
  const arrow = section.querySelector('i.ri-arrow-right-up-line');
  const heading = section.querySelector('h3');

  gsap.set(arrow, { rotate: 0, opacity: 0, scale: 0, transformOrigin: "center" });
  gsap.set(heading, { scale: 1, transformOrigin: "left center" });

  section.addEventListener('mouseenter', () => {
    gsap.to(arrow, {  opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' });
    gsap.to(heading, { scale: 1.02, duration: 0.3, ease: 'power1.out' });
    heading.style.textDecoration = 'underline';
  });

  section.addEventListener('mouseleave', () => {
    gsap.to(arrow, {  opacity: 0, scale: 0, duration: 0.3, ease: 'power1.in' });
    gsap.to(heading, { scale: 1, duration: 0.3, ease: 'power1.in' });
    heading.style.textDecoration = 'none';
  });
});

document.querySelectorAll('.buy-text').forEach(section => {
  const arrow = section.querySelector('i.ri-arrow-right-line');
  
  gsap.set(arrow, { rotate: 0, transformOrigin: "center center" });
  gsap.set(section, { scale: 1, transformOrigin: "center" });

  section.addEventListener('mouseenter', () => {
    gsap.to(arrow, { rotate: -45, duration: 0.3, ease: 'power1.out' });
    gsap.to(section, { scale: 1.02, duration: 0.3, ease: 'power1.out' });
  });

  section.addEventListener('mouseleave', () => {
    gsap.to(arrow, { rotate: 0, duration: 0.3, ease: 'power1.in' });
    gsap.to(section, { scale: 1, duration: 0.3, ease: 'power1.in' });
  });
});


