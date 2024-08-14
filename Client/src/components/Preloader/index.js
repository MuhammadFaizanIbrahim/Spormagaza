import gsap from "gsap";

const tl = gsap.timeline({ paused: true });

export const preLoaderAnim = () => {
  tl.to("body", {
    duration: 0.1,
    css: { overflowY: "hidden" },
    ease: "power3.inOut",
  })
  .to(".landing", {
    duration: 0.05,
    css: { overflowY: "hidden", height: "90vh" },
  }, "-=0.05")
  .to(".text-container", {
    duration: 1.5,
    delay: 1,
    y: 10,
    skewY: 10,
    opacity: 0,
    stagger: 0.4,
    ease: "Power3.easeOut",
  })
  .to(".landing", {
    duration: 0.05,
    css: { overflowY: "hidden", height: "unset" },
  })
  .to("body", {
    duration: 0.1,
    css: { overflowY: "scroll" },
    ease: "power3.inOut",
  })
  .to(".landing__top .sub", {
    duration: 1,
    opacity: 0,
    y: 80,
    ease: "expo.easeOut",
  })
  .to(
    ".preLoader",
    {
      duration: 1.5,
      opacity: 0, // Fade out the preloader
      ease: "Power3.easeOut",
      onComplete: () => {
        tl.clear(); // Clear the timeline when animation completes
        // Any additional logic after animation completes
      },
    },
    "-=2"
  )
  .from(".landing__main .text", {
    duration: 2,
    y: 70,
    opacity: 0,
    stagger: {
      amount: 2,
    },
    ease: "power3.easeInOut",
  })
  .from(".links .item", {
    duration: 0.5,
    opacity: 0,
    delay: window.innerWidth < 763 ? -3 : -0.6,
    stagger: {
      amount: 0.5,
    },
    ease: "expo.easeOut",
  })
  .from(".main-circle", {
    duration: 1,
    opacity: 0,
    ease: "power3.easeInOut",
  })
  .from(".shapes .shape", {
    duration: 1,
    opacity: 0,
    delay: -1,
    ease: "power3.easeInOut",
    stagger: 1,
  })
  .to(".shapes .shape", {
    duration: 1,
    opacity: 0,
    delay: -1,
    ease: "power3.easeInOut",
    stagger: 1,
  })
  .to(".shapes .shape", {
    duration: 1.5,
    opacity: 1,
    ease: "power3.easeInOut",
    stagger: 1,
  })
  .to(".preLoader", {
    duration: 0,
    delay: 1,
    css: { display: "none" },
  });

  tl.play();
};
