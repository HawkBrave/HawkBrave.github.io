const content = [
  `<div id="name-area">
    <h1 id="name-big">j. Yves</h1>
  </div>`,
  `<div id="about">
    <h2>About</h2>
    <p>Software design student @ Technological University of Shannon who's passionate about web development/engineering, AI, and distributed systems.</p>
  </div>`,
  `<div id="experience">
    <h2>Experience</h2>
    <ul>
      <li>
        <img src="https://www.johnsoncontrols.com/careers/-/media/jci/be/united-states/our-brands/final/johnson-controls.png?h=175&amp;w=400&amp;la=en&amp;hash=BD13FF9939946B200825EE0159B69A1B5CE2C78E" alt="Johnson Controls Logo" width="150">
      </li>
      <li>
        <img src="https://uploads-ssl.webflow.com/600ad06ae00a6210fd3a2752/60168f2182f72c40828afed9_Adastec.svg" loading="lazy" width="150" alt="" class="image-11">
      </li>
    </ul>
  </div>`,
  `<div id="education">
    <h2>Education</h2>
    <ul>
      <li>
        <h3>Technological University of Shannon - Bachelor of Science in Software Design with Cloud Computing</h3>
        <i>2021 - 2022</i><br>Athlone - Ireland
      </li>
      <li>
        <h3>Bilkent University - Bachelor of Science in Computer Technology and Information Systems</h3>
        <i>2019 - 2023</i><br>Ankara - Turkey
      </li>
    </ul>
  </div>`,
  `<div id="skills">
    <h2>Expertise</h2>
    <ul>
      <li>Fullstack Web Applications</li>
      <li>Computer Vision</li>
      <li>Deep Learning</li>
    </ul>
  </div>`,
  `<div id="contact-info">
    <div id="text-mandelbrot">${mandel}</div>
  </div>`
];

let i = 0;
let each = document.body.clientHeight / content.length;

let container = document.querySelector('#container');

function display(index) {
  if (i != index) {
    container.style.opacity = 0;
    i = index;
    setTimeout(() => {
      container.style.transition = "0.5s opacity ease";
      container.style.opacity = 1;
      container.innerHTML = content[index];
    }, 200);
  }
  if (window.debug) {
    console.log("clientHeight: " + document.body.clientHeight);
    console.log("content.length: " + content.length);
    console.log("each: " + each);
  }
}

addEventListener('scroll', event => {
  let scroll = scrollY + window.innerHeight / 2 <= 0 ? 1 : scrollY + window.innerHeight / 2;
  scroll = scroll >= document.body.clientHeight ? document.body.clientHeight : scroll;
  let pos = (scroll / each) >= content.length ? content.length-1 : Math.floor(scroll / each);
  if (window.debug) {
    console.log("scroll: " + scroll);
    console.log("pos: " + pos);
  }
  display(pos);
});