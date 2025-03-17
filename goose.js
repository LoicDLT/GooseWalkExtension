(function () {
  const gooseUrl = chrome.runtime.getURL("assets/goose.gif");
  const honkSoundUrl = chrome.runtime.getURL("assets/honk.mp3");

  let gooseHealth = 3;
  const maxHealth = 3;
  const gooseWidth = 100;
  const gooseHeight = 120;
  let gooseX, gooseY;
  let normalSpeed = 2;
  let fastSpeed = 4;
  let currentSpeed = normalSpeed;
  let direction = { x: 1, y: 0 };

  const gooseContainer = document.createElement('div');
  Object.assign(gooseContainer.style, {
    position: 'fixed',
    width: `${gooseWidth}px`,
    height: `${gooseHeight}px`,
    zIndex: '2147483647',
    pointerEvents: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.2s linear',
  });

  const gooseImg = document.createElement('img');
  gooseImg.src = gooseUrl;
  Object.assign(gooseImg.style, {
    width: '100%',
    height: 'auto',
    userSelect: 'none',
  });

  gooseContainer.appendChild(gooseImg);
  document.body.appendChild(gooseContainer);

  const healthBarContainer = document.createElement('div');
  Object.assign(healthBarContainer.style, {
    position: 'fixed',
    width: '60px',
    height: '8px',
    background: '#ccc',
    display: 'none',
    borderRadius: '5px',
    overflow: 'hidden',
  });

  const healthBarFill = document.createElement('div');
  Object.assign(healthBarFill.style, {
    height: '100%',
    width: '100%',
    backgroundColor: 'green',
  });

  healthBarContainer.appendChild(healthBarFill);
  document.body.appendChild(healthBarContainer);

  function setRandomDirection() {
    const angle = Math.random() * 2 * Math.PI;
    direction.x = Math.cos(angle);
    direction.y = Math.sin(angle);
    gooseImg.style.transform = direction.x < 0 ? 'scaleX(-1)' : 'scaleX(1)';
  }

  function updateHealthBar() {
    const ratio = gooseHealth / maxHealth;
    healthBarFill.style.width = `${ratio * 100}%`;
    healthBarFill.style.backgroundColor = ratio > 0.66 ? 'green' : ratio > 0.33 ? 'orange' : 'red';
  }

  function moveGoose() {
    gooseX += direction.x * currentSpeed;
    gooseY += direction.y * currentSpeed;

    if (gooseX < 0 || gooseX > window.innerWidth - gooseWidth) direction.x *= -1;
    if (gooseY < 0 || gooseY > window.innerHeight - gooseHeight) direction.y *= -1;

    gooseContainer.style.left = `${gooseX}px`;
    gooseContainer.style.top = `${gooseY}px`;

    if (healthBarContainer.style.display !== 'none') {
      healthBarContainer.style.left = `${gooseX}px`;
      healthBarContainer.style.top = `${gooseY - 15}px`;
    }
  }

  function honk() {
    const honkAudio = new Audio(honkSoundUrl);
    honkAudio.play();
  }

  gooseContainer.onclick = () => {
    if (gooseHealth <= 0) return;

    gooseHealth--;
    healthBarContainer.style.display = 'block';
    updateHealthBar();
    honk();
    currentSpeed = fastSpeed;

    setTimeout(() => currentSpeed = normalSpeed, 2000);

    if (gooseHealth <= 0) {
      gooseContainer.remove();
      healthBarContainer.remove();
    }
  };

  function init() {
    gooseX = Math.random() * (window.innerWidth - gooseWidth);
    gooseY = Math.random() * (window.innerHeight - gooseHeight);
    gooseContainer.style.left = `${gooseX}px`;
    gooseContainer.style.top = `${gooseY}px`;
    setRandomDirection();
  }

  init();
  setInterval(moveGoose, 30);
  setInterval(setRandomDirection, 3000);
})();