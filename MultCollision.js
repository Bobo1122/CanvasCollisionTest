var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var mouse = {

  x: undefined,
  y: undefined
}
window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
init();
});

window.addEventListener('click', () => {
init();
});

var colors = ["#2C3E50", "#E74C3C", "#ECf0F1", "#3498DB", "#2980B9"];//["#ff073a", "#bc13fe", "#1b03a3", "#ffff00"];
var maxRadius = 70;
var radius = 20;
var gravity = 1;
var friction = 0.61;
let particles;
let numberOfPart = 100;

function Particle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.radius= radius;
  this.color = colors[Math.floor(Math.random() * colors.length)];
this.primaryColor = this.color;
this.velocity = {
  x: dx,
  y: dy
};
this.mass = 1;
this.opacity = 0;
this.mouseProx = 160;
  this.draw = function() {

    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
   c.stroke();
   c.closePath();

}
  this.update = function(particles){
      //this.dx = 0;

      for (var i = 0; i < particles.length; i++) {
        if(this == particles[i]) continue;
        if(getDist(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 <= 0) {
          resolveCollision(this, particles[i])
        }
      }

    if(this.x + this.radius >= window.innerWidth || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if(this.y + this.radius >= window.innerHeight || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y; //* friction;
    } //else this.dy ;//+= gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y; //0;

      if (getDist(mouse.x, mouse.y, this.x, this.y) < this.mouseProx && this.opacity < 1) {
        this.opacity += 0.02;
    } else if(this.opacity > 0){
        this.opacity -= 0.05;
        this.opacity = Math.max(0, this.opacity)
      }

    this.draw();
  }

}

function RandomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)

}

function getDist(x1, y1, x2, y2) {

    let xdist = x2-x1;
    let ydist = y2- y1;

    return Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2)); // <= distance (pythagoream theorem)
}
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function init() {
  particles = [];
  for (var i = 0; i < numberOfPart; i++) {
    var x = RandomIntFromRange(radius, window.innerWidth-radius);
    var y = RandomIntFromRange(radius, window.innerHeight-radius);
    var dx = RandomIntFromRange(-4, 4);
    var dy = RandomIntFromRange(-4, 4);
    if(i !== 0) {
      for (var j = 0; j < particles.length; j++) {
        if(getDist(x, y, particles[j].x, particles[j].y) - radius * 2 <= 0) {
          x = RandomIntFromRange(radius, window.innerWidth-radius);
          y = RandomIntFromRange(radius, window.innerWidth-radius);
          j = -1;
        }
      }

    }
    particles.push(new Particle(x, y, dx, dy, radius))
  }
}

function animate() {
  requestAnimationFrame(animate);
c.clearRect(0, 0, window.innerWidth, window.innerHeight);
for (var i = 0; i < particles.length; i++) {
  particles[i].update(particles);
}
/*  c.beginPath();
  c.font = "50px Georgia";
  c.fillStyle = 'red';
c.fillText('WOOORD',mouse.x, mouse.y);*/

}

init();

animate();
