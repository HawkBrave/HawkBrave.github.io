/*
const scrollOffset = 100;

const elementInView = (el, offset=0) => {
  const elementTop = el.getBoundingClientRect().top;
 
  return (
    elementTop <= 
    ((window.innerHeight || document.documentElement.clientHeight) - offset)
  );
}

const displayScrolledElement = el => {
  el.classList.add('scrolled');
}
const hideScrolledElement = el => {
  el.classList.remove('scrolled');
}

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    console.log(elementInView(el, scrollOffset));
    if (elementInView(el, scrollOffset)) {
      displayScrolledElement(el);
    } else {
      hideScrolledElement(el);
    }
  });
}

window.addEventListener('scroll', () => handleScrollAnimation());
*/

const scrollElements = document.querySelectorAll('#content > div');

const inViewCallback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scrolled');  
    } else { 
      entry.target.classList.remove('scrolled');
    }
  });
}

let observer = new IntersectionObserver(inViewCallback, {threshold: 0.5}); 

scrollElements.forEach(el => observer.observe(el));