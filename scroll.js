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
        <img src="https://uploads-ssl.webflow.com/600ad06ae00a6210fd3a2752/60168f2182f72c40828afed9_Adastec.svg" loading="lazy" width="150" alt="" class="image-11">
      </li>
    </ul>
  </div>`,
  `<div id="education">
    <h2>Education</h2>
    <h3>Technological University of Shannon - Bachelor of Science (B.S) in Software Design with Cloud Computing</h3>
    <p><i>2021 - 2022</i><br>Athlone - Ireland</p>
    <h3>Bilkent University - Bachelor of Science (B.S.) in Computer Technology and Information Systems</h3>
    <p><i>2019 - 2023</i><br>Ankara - Turkey</p>
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
}

addEventListener('scroll', event => {
  let scroll = scrollY <= 0 ? 1 : scrollY;
  scroll = scroll >= document.body.clientHeight ? document.body.clientHeight : scroll;
  let pos = (scroll / each) >= content.length ? content.length-1 : Math.floor(scroll / each);
  console.log(pos);
  display(pos);
});