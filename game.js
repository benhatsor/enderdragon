const mapRadius = 8;
const heightLimit = 29;

const blocks = [];
let blockData = [];

var sensitivity = 1000;
var velocity = 400;
var verticalVelocity = 3.5;
var gravity = 30;

var inventory = ['Grass', 'Stone', 'Sand', 'Gravel', 'Poppy', 'Gold Ore', 'Iron Ore', 'Torch', 'Oak Log'];

function constructWorld() {
  for (let x = -mapRadius; x <= mapRadius; ++x) {
    blocks[x] = [];
    blockData[x] = [];
    for (let z = -mapRadius; z <= mapRadius; ++z) {
      blocks[x][z] = [];
      blockData[x][z] = [];
      for (let y = 0; y <= heightLimit + 3; ++y) {
        blocks[x][z][y] = constructCubeDom();
        blocks[x][z][y].style.transform = `translateZ(${z*100}px) translateX(${x*100}px) translateY(${y*-100}px)`;
        blocks[x][z][y].x = x;
        blocks[x][z][y].y = y;
        blocks[x][z][y].z = z;

        let type;
        if (y > 9) type = 0;
        else if (y > 8) type = 2;
        else if (y > 6) type = 1;
        else if (y > 0) type = 3;
        else type = 6;
        //blockData[x][z][y] = (y >= 10 ? 0 : (y >= 9 ? 2 : (y == 0 ? 6 : 3)));
        blockData[x][z][y] = type;

      }
    }
  }
}

function constructCubeDom(id) {
  let block = document.createElement('div');
  block.className = 'block';
  block.type = id;
  block.faces = [];


  return block;

  //0: Z+
  //1: X+
  //2: Z-
  //3: X-
  //4: Y+
  //5: Y-

  //transform Y is reversed
}

function addFace(type, side) {
  let face = document.createElement('face');
  face.className = 'face';
  face.side = side;
  if (blockList[type].multiside) {
    face.style.backgroundImage = `url(textures/${blockList[type].sides[side]})`;
  } else if (blockList[type].xshape) {
    face.style.backgroundImage = `none`;
  } else {
    face.style.backgroundImage = `url(textures/${blockList[type].pic})`;
  }

  var zPos = 50;
  if (blockList[type].name == 'Torch' || blockList[type].name == 'Redstone Torch' || blockList[type].name == 'Soul Torch') {
    zPos = 10;
  }
  
  if (side < 4) {
    face.style.transform = `rotateY(${side * 90}deg) translateZ(`+ zPos +`px)`;
  }
  else {
    face.style.transform = `rotateX(${90 + side * 180}deg) translateZ(`+ zPos +`px)`;
  }

  return face;
}

function renderGame() {
  for (let x in blockData) {
    for (let z in blockData[x]) {
      for (let y in blockData[x][z]) {

        if (blockData[x][z][y] != 0) {
          blockUpdate(x, z, y);
        }
      }
    }
  }
}

loadImages();

function loadImages() {
  document.querySelector('.options').innerHTML = `
        <h2>Loading textures</h2>
        <div class="progress">
          <div class="fill"></div>
        </div>`;
  
  blockList.forEach(block => {
    var img = document.createElement('img');
    img.src = 'textures/' + block.pic;
    img.onload = incrementLoader;
    img.onerror = incrementLoader;
    
    document.querySelector('.imgloader').appendChild(img);
    
    for (var prop in block.sides) {
      var img = document.createElement('img');
      img.src = 'textures/' + block.sides[prop];
      img.onload = incrementLoader;
      img.onerror = incrementLoader;
      
      document.querySelector('.imgloader').appendChild(img);
    }
  })
}

function incrementLoader() {
  var percent = 100 / document.querySelectorAll('.imgloader img').length,
      width = Number(document.querySelector('.progress .fill').style.width.replace('%',''));
  
  document.querySelector('.progress .fill').style.width = width + percent + '%';
  
  if (Math.round(width + percent) == 100) {
    document.querySelector('.options').classList.add('hidden');
    pause();
  }
}

function isAir(x, z, y) {
  if (blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined) {
    return false;
  } else if (blockData[x][z][y] == 0)
    return true;
  return false;
}

function isTransparent(x, z, y) {
  if (blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined) {
    return false;
  } else if (blockList[blockData[x][z][y]].transparent)
    return true;
  return false;
}

function isXShaped(x, z, y) {
  if (blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined) {
    return false;
  } else if (blockList[blockData[x][z][y]].xshape)
    return true;
  return false;
}

function isFallingSand(x, z, y) {
  if (blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined) {
    return false;
  } else if (blockList[blockData[x][z][y]].fallingSand)
    return true;
  return false;
}

function isRedstone(x, z, y) {
  if (blockData[x] == undefined || blockData[x][z] == undefined || blockData[x][z][y] == undefined) {
    return false;
  } else if (blockList[blockData[x][z][y]].redstone)
    return true;
  return false;
}

function blockUpdate(x, z, y) {

  if (blockData[x] != undefined && blockData[x][z] != undefined && blockData[x][z][y] != undefined) {
    let block = blocks[x][z][y];
    let type = blockData[x][z][y];

    if (block.childNodes.length > 0) {
      block.parentNode.removeChild(block);
      block.innerHTML = '';
    }


    if (type != 0) {

      let blockTransparent = isTransparent(x, z, y);
      let blockXShaped = isXShaped(x, z, y);
      let visibleFaces = 0;
      if (isAir(x, z - -1, y) || isXShaped(x, z - -1, y) || (isTransparent(x, z - -1, y) && !blockTransparent)) {
        let elem = addFace(type, 0);
        block.faces[0] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x, z - 1, y) || isXShaped(x, z - 1, y) || (isTransparent(x, z - 1, y) && !blockTransparent)) {
        let elem = addFace(type, 2);
        block.faces[2] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x - -1, z, y) || isXShaped(x - -1, z, y) || (isTransparent(x - -1, z, y) && !blockTransparent)) {
        let elem = addFace(type, 1);
        block.faces[1] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x - 1, z, y) || isXShaped(x - 1, z, y) || (isTransparent(x - 1, z, y) && !blockTransparent)) {
        let elem = addFace(type, 3);
        block.faces[3] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x, z, y - -1) || isXShaped(x, z, y - -1) || (isTransparent(x, z, y - -1) && !blockTransparent)) {
        let elem = addFace(type, 4);
        block.faces[4] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }
      if (isAir(x, z, y - 1) || isXShaped(x, z, y - 1) || (isTransparent(x, z, y - 1) && !blockTransparent)) {
        let elem = addFace(type, 5);
        block.faces[5] = elem;
        block.appendChild(elem);
        ++visibleFaces;
      }

      if (visibleFaces > 0) {

        block.classList = 'block';
        
        if (blockList[blockData[x][z][y]].xshape) {
          addXshape(block, type);
        }
        
        if (blockList[blockData[x][z][y]].animation) {
          block.classList.add('animate');
        }
        
        if (blockList[blockData[x][z][y]].name == 'Torch' || blockList[blockData[x][z][y]].name == 'Redstone Torch' || blockList[blockData[x][z][y]].name == 'Soul Torch') {
          block.classList.add('torch');
        }
        
        if (blockList[blockData[x][z][y]].redstone) {
          block.classList.add('redstone');
        }
        
        document.querySelector('#scene').appendChild(blocks[x][z][y]);
        
        if ((isAir(x, z, y - 1) && isXShaped(x, z, y)) || (isAir(x, z, y - 1) && isRedstone(x, z, y))) {
          placeBlock(x, z, y, 0);
        }
        
        if (isAir(x, z, y - 1) && isFallingSand(x, z, y)) {
          placeBlock(x, z, y, 0);
          placeBlock(x, z, (y - 1), type);
          
          //blockUpdate(x, z, (y + 1));
        }
      }
    }
  }
}

function addXshape(block, type) {
  let side = document.createElement('div');
  side.className = 'face2';
  side.style.backgroundImage = `url(textures/${blockList[type].pic})`;
  side.style.transform = 'rotateY(45deg)';
  block.appendChild(side.cloneNode(true));
  side.style.transform = 'rotateY(-45deg)';
  block.appendChild(side.cloneNode(true));
}

const player = {
  height: 1.3,
  pos: {
    x: 0,
    y: 9.5,
    z: 0
  },
  rot: {
    x: 0,
    y: 0
  }
};

document.querySelector('#camera').style.setProperty('--perspective', document.querySelector('#camera').clientHeight / 2 + 'px');
window.addEventListener('resize', e => {
  document.querySelector('#camera').style.setProperty('--perspective', document.querySelector('#camera').clientHeight / 2 + 'px');
});

function refresh_pos() {
  var c = document.querySelector('#camera').style;
  c.setProperty('--x', player.pos.x * 100 + 'px');
  c.setProperty('--y', (player.pos.y + player.height) * 100 + 'px');
  c.setProperty('--z', player.pos.z * 100 + 'px');
  c.setProperty('--rotY', player.rot.x + 'rad');
  c.setProperty('--rotX', player.rot.y + 'rad');
}

let fpsenabled = false;

document.querySelector('#camera').onmousemove = e => {
  if (fpsenabled) {
    player.rot.x += (e.movementX / sensitivity);
    player.rot.y -= (e.movementY / sensitivity);
    if (player.rot.y < -Math.PI / 2) player.rot.y = -Math.PI / 2;
    else if (player.rot.y > Math.PI / 2) player.rot.y = Math.PI / 2;
  }

};

document.addEventListener('pointerlockchange', e => {
  if (document.pointerLockElement === document.querySelector('#camera')) {
    fpsenabled = true;
  }
  else {
    fpsenabled = false;
  }
  pause();
}, false);


var moveinteval;
var keybinds = {
  left: 65,
  right: 68,
  forward: 87,
  backward: 83,
  jump: 32
};
var keypressed = {
  left: false,
  right: false,
  forward: false,
  backward: false,
  jump: false
};
var keymovement = {
  x: 0,
  z: 0
};
var moving = false;
var spacebarPressed = false;

var keydownF = e => {

  if (fpsenabled) {
    if (event.keyCode === keybinds.left) {
      if (!keypressed.left) {
        keymovement.x += 1;
        keypressed.left = true;
      }
    } else if (event.keyCode === keybinds.right) {
      if (!keypressed.right) {
        keymovement.x += -1;
        keypressed.right = true;
      }
    } else if (event.keyCode === keybinds.backward) {
      if (!keypressed.backward) {
        keymovement.z += -1;
        keypressed.backward = true;
      }
    } else if (event.keyCode === keybinds.forward) {
      if (!keypressed.forward) {
        keymovement.z += 1;
        keypressed.forward = true;
      }
    }
    if (event.keyCode === keybinds.jump) {
      if (verticalSpeed == 0 || flying) {
        verticalSpeed = verticalVelocity;
        spacebarPressed = true;
      }
    }

  }


};

var keyupF = e => {

  if (fpsenabled) {
    if (event.keyCode === keybinds.left) {

      keymovement.x -= 1;
      keypressed.left = false;

    } else if (event.keyCode === keybinds.right) {

      keymovement.x -= -1;
      keypressed.right = false;

    } else if (event.keyCode === keybinds.backward) {

      keymovement.z -= -1;
      keypressed.backward = false;

    } else if (event.keyCode === keybinds.forward) {
      keymovement.z -= 1;
      keypressed.forward = false;
    }
    if (event.keyCode === keybinds.jump) {
      if (flying) {
        verticalSpeed = 0;
        spacebarPressed = false;
      }
    }
  }
};

document.body.addEventListener('keydown', keydownF);
document.body.addEventListener('keyup', keyupF);

let verticalSpeed = 0;

let prevTime = +new Date();

let occupiedBlock = [];
let occupiedBlockData = [];

function updateOccupiedBlocks() {
  occupiedBlock[0] = {
    x: -Math.round(player.pos.x),
    z: -Math.round(player.pos.z),
    y: Math.round(player.pos.y)
  };
  occupiedBlock[1] = {
    x: -Math.round(player.pos.x),
    z: -Math.round(player.pos.z),
    y: Math.round(player.pos.y) + 1
  };

  occupiedBlockData[0] = blockList[blockData[occupiedBlock[0].x][occupiedBlock[0].z][occupiedBlock[0].y]];
  occupiedBlockData[1] = blockList[blockData[occupiedBlock[1].x][occupiedBlock[1].z][occupiedBlock[1].y]];

}

function gameloop() {
  if (!paused) {
    let delta = +new Date() - prevTime;
    prevTime = +new Date();

    let moveVector = new Vector(keymovement.x, keymovement.z).unit();
    moveVector = rotate2dVector(moveVector, player.rot.x);




    player.pos.x += moveVector.x * delta / velocity;
    updateOccupiedBlocks();

    if (occupiedBlockData[0] || occupiedBlockData[1]) {
      var clipBlock1 = (occupiedBlockData[0].id != 0 && !occupiedBlockData[0].xshape && !occupiedBlockData[0].redstone),
          clipBlock2 = (occupiedBlockData[1].id != 0 && !occupiedBlockData[1].xshape && !occupiedBlockData[1].redstone); // +1 block
      
      var clipSneak = false;
      if (sneaking) {
        let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)-1]];
        clipSneak = (blockBelow.id == 0);
      }
      
      if (Math.abs(player.pos.x) > mapRadius || clipBlock1 || clipBlock2 || clipSneak) {
        player.pos.x -= moveVector.x * delta / velocity;
      }
    }

    player.pos.z += moveVector.y * delta / velocity;
    updateOccupiedBlocks();

    if (occupiedBlockData[0] || occupiedBlockData[1]) {
      var clipBlock1 = (occupiedBlockData[0].id != 0 && !occupiedBlockData[0].xshape && !occupiedBlockData[0].redstone),
          clipBlock2 = (occupiedBlockData[1].id != 0 && !occupiedBlockData[1].xshape && !occupiedBlockData[1].redstone);
      
      var clipSneak = false;
      if (sneaking) {
        let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)-1]];
        clipSneak = (blockBelow.id == 0);
      }
      
      if (Math.abs(player.pos.z) > mapRadius || clipBlock1 || clipBlock2 || clipSneak) {
        player.pos.z -= moveVector.y * delta / velocity;
      }
    }

    if (!flying) {
      verticalSpeed -= delta / 100;
    }
      
    let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta / 500)]];    
    let blockAbove = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta / 500 - -1.8)]];
    
    if (blockBelow || blockAbove) {
      var clipSneak = false;
      if (sneaking && !flying) {
        let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)-1]];
        clipSneak = (blockBelow.id == 0);
      }
      else if (sneaking && flying) {
        verticalSpeed = verticalVelocity * -1;
      }
      if (!sneaking && flying && !spacebarPressed) {
        verticalSpeed = 0;
      }
      
      let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)-1]];
      if (flying && blockBelow.id != 0) {
        disableFlying();
      }
      
      if (verticalSpeed <= 0 && clipSneak) {
        verticalSpeed = 0;
      } else if (verticalSpeed <= 0 && blockBelow.id != 0 && !blockBelow.xshape &&  !blockBelow.redstone) {
        verticalSpeed = 0;
        player.pos.y = Math.round(player.pos.y) - .5;
      } else if (verticalSpeed >= 0 && blockAbove.id != 0 && !blockAbove.xshape) {
        verticalSpeed = 0;
      }
      
      player.pos.y += verticalSpeed * delta / 500;
    }

    refresh_pos();
    checkFocus();
    
    debug();
  }

}



function rotate2dVector(vec, by) {
  let length = vec.length();
  let ang = Math.atan2(vec.y, vec.x) + by;
  return (new Vector(Math.cos(ang), Math.sin(ang))).unit().multiply(length);
}
constructWorld();
renderGame();

let focusBlock = null;
let focusSide = null;

function checkFocus() {
  document.querySelector('#gui').style.visibility = 'hidden';
  let newFocusSide = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  let newFocusBlock = newFocusSide.parentNode;

  if (newFocusBlock != focusBlock) {
    if (focusBlock != null) focusBlock.setAttribute('focus', 'false');

    var radius = 5,
        playerX = Math.abs(player.pos.x),
        playerY = Math.abs(player.pos.y),
        playerZ = Math.abs(player.pos.z),
        blockX = Math.abs(newFocusBlock.x),
        blockY = Math.abs(newFocusBlock.y),
        blockZ = Math.abs(newFocusBlock.z),
        blockInRadiusX = (playerX + radius) >= blockX,
        blockInRadiusY = (playerY + radius) >= blockY,
        blockInRadiusZ = (playerZ + radius) >= blockZ,
        blockInRadius = blockInRadiusX && blockInRadiusY && blockInRadiusZ;
    
    if (newFocusBlock == document.body || !blockInRadius) focusBlock = null;
    else {
      focusSide = newFocusSide.side;
      focusBlock = newFocusBlock;
      focusBlock.setAttribute('focus', 'true');
    }
  } else if (focusBlock != null) {
    focusSide = newFocusSide.side;
  }
  document.querySelector('#gui').style.visibility = '';

}

function placeBlock(x, z, y, type) {
  updateOccupiedBlocks();
  
  var placeOnTorch = ((blockList[blockData[x][z][y]].name == 'Torch' || blockList[blockData[x][z][y]].name == 'Redstone Torch' || blockList[blockData[x][z][y]].name == 'Soul Torch') && (blockList[type].name == 'Torch' || blockList[type].name == 'Redstone Torch' || blockList[type].name == 'Soul Torch'));
  
  if (blockData[x] != undefined && blockData[x][z] != undefined && blockData[x][z][y] != undefined && y != 0 && y < 30 && (!(occupiedBlock[0].x == x && occupiedBlock[0].z == z && (occupiedBlock[0].y == y || occupiedBlock[0].y + 1 == y)) || type == 0 || blockList[type].xshape) && !placeOnTorch) {
    blockData[x][z][y] = type;

    blockUpdate(x, z, y);

    blockUpdate(x - 1, z, y);
    blockUpdate(x - -1, z, y);
    blockUpdate(x, z - 1, y);
    blockUpdate(x, z - -1, y);
    blockUpdate(x, z, y - 1);
    blockUpdate(x, z, y - -1);

  }
}

document.querySelector('#camera').onmousedown = function(e) {
  if (fpsenabled && focusBlock != null) {
    if (e.button === 2) {
      if (focusSide == 0) placeBlock(focusBlock.x, focusBlock.z - -1, focusBlock.y, activeBlock);
      else if (focusSide == 1) placeBlock(focusBlock.x - -1, focusBlock.z, focusBlock.y, activeBlock);
      else if (focusSide == 2) placeBlock(focusBlock.x, focusBlock.z - 1, focusBlock.y, activeBlock);
      else if (focusSide == 3) placeBlock(focusBlock.x - 1, focusBlock.z, focusBlock.y, activeBlock);
      else if (focusSide == 4) placeBlock(focusBlock.x, focusBlock.z, focusBlock.y - -1, activeBlock);
      else if (focusSide == 5) placeBlock(focusBlock.x, focusBlock.z, focusBlock.y - 1, activeBlock);

      //0: Z+
      //1: X+
      //2: Z-
      //3: X-
      //4: Y+
      //5: Y-
    } else if (e.button === 0) {
      placeBlock(focusBlock.x, focusBlock.z, focusBlock.y, 0);
    } else if (e.button === 1) {
      let block = blockData[focusBlock.x][focusBlock.z][focusBlock.y];
      if (block > 0) copyBlock(block);
    }
  }
};

var activeBlock = blockId(inventory[0]).id;
buildInventory(inventory);

function buildInventory(inventory) {
  for (var i = 0;i < inventory.length;i++) {
    var block = blockId(inventory[i]);
    
    document.querySelectorAll('.slot')[i].style.backgroundPosition = block.invPic;
    
    if (block.name == 'Air') {
      document.querySelectorAll('.slot')[i].style.background = 'none';
    }
  }
}

function blockId(name) {
  return blockList.filter(block => block.name == name)[0];
}

var sneaking = false;

document.onkeydown = function(e) {
  var key = e.keyCode - 49;
  
  if (key >= 0 && key <= 8 && paused == false) {
    changeBlock(key); // activeBlock
  }
  
  if (e.keyCode == 16) {
    sneak();
  }
  
  checkDblClick(e);
};

document.onkeyup = function(e) {
  if (e.keyCode == 16) {
    disableSneaking();
  }
  
  if (e.keyCode == keybinds.forward && sprinting) {
    disableSprinting();
  }
  else if (e.keyCode == keybinds.forward) {
    sprintKeyUp = true;
  }
  
  if (e.keyCode == keybinds.jump) {
    spacebarUp = true;
  }
}

function animateSneak(direction) {
  if (direction == 'forward') {
    if (player.height >= 1.1) {
      player.height -= 0.05;
      requestAnimationFrame(() => { animateSneak('forward') });
    }
    else {
      player.height = 1.1;
    }
  }
  if (direction == 'backward') {
    if (player.height <= 1.3) {
      player.height += 0.05;
      requestAnimationFrame(() => { animateSneak('backward') });
    }
    else {
      player.height = 1.3;
    }
  }
}

var keyDelta = 250;
var lastKeypressTimeSprint = 0;
var sprinting = false;
var sprintKeyUp = false;

var lastKeypressTimeFly = 0;
var flying = false;
var spacebarUp = false;

function checkDblClick(e) {
 if (e.keyCode == keybinds.forward) {
    var thisKeypressTime = new Date();
    if (thisKeypressTime - lastKeypressTimeSprint <= keyDelta && sprintKeyUp && !sneaking) {
      sprint();
      thisKeypressTime = 0;
      sprintKeyUp = false;
    }
    else if (sprintKeyUp) {
      sprintKeyUp = false;
    }
    lastKeypressTimeSprint = thisKeypressTime;
 }
  
  if (e.keyCode == keybinds.jump) {
    var thisKeypressTime = new Date();
    if (thisKeypressTime - lastKeypressTimeFly <= keyDelta && spacebarUp && !sneaking) {
      if (flying == false) {
        fly();
      }
      else {
        disableFlying();
      }
      
      thisKeypressTime = 0;
      spacebarUp = false;
    }
    else if (spacebarUp) {
      spacebarUp = false;
    }
    lastKeypressTimeFly = thisKeypressTime;
 }
}

function sneak() {
  if (!flying) {
    //player.height = 1.1; // shift
    velocity = 700;
    verticalVelocity = 2.5;

    animateSneak('forward');
  }

  sneaking = true;
}

function disableSneaking() {
  if (!flying) {
    //player.height = 1.3; // shift
    velocity = 400;
    verticalVelocity = 3.7;

    animateSneak('backward');
  }

  sneaking = false;
}

function fly() {
  velocity = 300;
  verticalVelocity = 3;
  
  flying = true;
  
  document.querySelector('#camera').classList.add('fly');
}

function disableFlying() {
  velocity = 400;
  verticalVelocity = 3.5;
  
  flying = false;
  
  document.querySelector('#camera').classList.remove('fly');
}

function sprint() {
  if (!flying) {
    velocity = 300;
  }
  else {
    velocity = 200;
  }
  
  sprinting = true;
  
  document.querySelector('#camera').classList.add('sprint');
}

function disableSprinting() {
  if (!flying) {
    velocity = 400;
  }
  else {
    velocity = 300;
  }
    
  sprinting = false;

  document.querySelector('#camera').classList.remove('sprint');
}

var paused = false;
var inspector = false;

function pause() {
  if (!paused) {
    document.querySelector('#gui').classList.add('pause');
    paused = true;

    document.querySelector('.options').innerHTML = `
          <h1>Game Menu</h1>
          <div class="button" role="button" onclick="document.querySelector('#camera').requestPointerLock()">Back to Game</div>
          <div class="buttons">
            <div class="button" role="button" onclick="redirect('https://github.com/barhatsor/enderdragon#README')">Give Feedback</div>
            <div class="button" role="button" onclick="redirect('https://github.com/barhatsor/enderdragon/issues')">Report Bugs</div>
          </div>
          <div class="button" role="button" onclick="inspector = true;document.querySelector('#gui').style.display = 'none'">Inspector Mode</div>`;
  }
  else {
    document.querySelector('#gui').classList.remove('pause');
    paused = false;
  }
}

function redirect(url) {
  window.location.href = url;
}

var tooltipTimeout = null;

function changeBlock(id) {
  var index = Array.from(document.querySelectorAll('.slot')).indexOf(document.querySelector('.slot.selected'));
  
  if (index != id) {
    activeBlock = blockId(inventory[id]).id;

    document.querySelector('.slot.selected').classList.remove('selected');
    document.querySelectorAll('.slot')[id].classList.add('selected');

    clearTimeout(tooltipTimeout);

    if (activeBlock != 0) {
      document.querySelector('.hotbar').classList.remove('tooltip');
      
      document.querySelector('.hotbar').setAttribute('tooltip', inventory[id]);
      window.setTimeout(() => { document.querySelector('.hotbar').classList.add('tooltip') }, 0);

      tooltipTimeout = window.setTimeout(() => {
        document.querySelector('.hotbar').setAttribute('tooltip', '');
        document.querySelector('.hotbar').classList.remove('tooltip');
      }, 2000);
    }
    else {
      document.querySelector('.hotbar').setAttribute('tooltip', '');
      document.querySelector('.hotbar').classList.remove('tooltip');
    }
  }
}

function copyBlock(block) {
  var index = Array.from(document.querySelectorAll('.slot')).indexOf(document.querySelector('.slot.selected'));
  
  inventory[index] = blockList[block].name;
  
  buildInventory(inventory);
}

var version = '0.0.2';
var exVersion = 'Indev';

function debug() {
  var block = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y)-1]];
  
  let moveVector = new Vector(keymovement.x, keymovement.z).unit();
  moveVector = rotate2dVector(moveVector, player.rot.x);
  
  document.querySelector('.debugscreen').innerHTML = `
  <p>Enderdragon `+version+` (`+version+`/`+exVersion+`)</p>
  <p>Client @ `+1+` ms ticks (Netlify)</p>
  <br>
  <p>XYZ: `+player.pos.x.toFixed(3)+` / `+player.pos.y.toFixed(5)+` / `+player.pos.z.toFixed(3)+`</p>
  <p>Block: `+Math.round(player.pos.x)+` `+Math.round(player.pos.y)+` `+Math.round(player.pos.z)+`</p>
  <p>Facing: `+player.rot.x.toFixed(1)+` / `+ player.rot.y.toFixed(1) +`</p>
  <p>Move Vector: `+moveVector.x.toFixed(3)+` / `+moveVector.y.toFixed(3)+` / `+moveVector.z.toFixed(3)+`</p>
  <p>BT: `+blockList.length+`</p>
  <br>
  <p>Debug: Inspector [esc]: pause gameloop [alt]: exit</p>
  <p>For help: press F3 + Q</p>`;
  
}

var f3 = false;
var f3q = false;

document.addEventListener('keydown', shortcutDown);
document.addEventListener('keyup', shortcutUp);

function shortcutDown(zEvent) {
  if (zEvent.key === 'F3') {
    f3 = true;
    f3q = false;
    zEvent.stopPropagation();
    zEvent.preventDefault();
  }
  if (zEvent.key === 'q' && f3 == true) {
    f3 = false;
    f3q = true;
    zEvent.stopPropagation();
    zEvent.preventDefault();
    
    redirect('https://github.com/barhatsor/enderdragon#README');
  }
  
  if (zEvent.altKey && inspector) {
    inspector = false;
    document.querySelector('#gui').style.display = 'flex';
  }
}

function shortcutUp(zEvent) {
  if (zEvent.key === 'F3' && !f3q) {
    f3 = false;
    
    document.querySelector('.debugscreen').classList.toggle('visible');
  }
}

function tick() {
  for (let x in blockData) {
    for (let z in blockData[x]) {
      for (let y in blockData[x][z]) {
        let block = blockData[x][z][y];
        switch (block) {
          case 1: {
            for (let x2 = -1; x2 <= 1; ++x2)
              for (let z2 = -1; z2 <= 1; ++z2)
                for (let y2 = -1; y2 <= 1; ++y2) {

                  if ((Math.abs(x - -x2) <= mapRadius && Math.abs(z - -z2) <= mapRadius && y - -y2 > 0 && y - -y2 <= heightLimit) &&
                    blockData[x - -x2][z - -z2][y - -y2] == 2 && blockData[x][z][y - -1] == 0 && Math.random() < .005) {
                    placeBlock(x, z, y, 2);
                  }
                }

            break;
          }
          case 2: {
            if (blockData[x][z][y - -1] != 0 && !blockList[blockData[x][z][y - -1]].xshape && !blockList[blockData[x][z][y - -1]].transparent && Math.random() < .008) {
              placeBlock(x, z, y, 1);
            }
            break;
          }
          case 10: {
            if (Math.random() < .015 && blockData[x][z][y - 1] == 2 && blockData[x][z][y - -1] == 0 && blockData[x][z][y - -2] == 0 && blockData[x][z][y - -3] == 0 && !(occupiedBlock[0].x == x && occupiedBlock[0].z == z && occupiedBlock[0].y >= y && occupiedBlock[0].y <= y - -4)) {
              placeBlock(x, z, y, 0);
              buildStructure(x, z, y, 'tree', false);
            }
          }
        }
      }
    }
  }
}

function buildStructure(xp, zp, yp, structureName, replace) {
  let structure = structures[structureName];

  for (let x in structure) {
    for (let z in structure[x]) {
      for (let y in structure[x][z]) {
        if ((Math.abs(xp - -x) <= mapRadius && Math.abs(zp - -z <= mapRadius) && yp - -y > 0 && yp - y <= heightLimit) && (replace || blockData[xp - -x][zp - -z][yp - -y] == 0) && (structure[x][z][y] != undefined && structure[x][z][y] != -1)) {
          placeBlock(xp - -x, zp - -z, yp - -y, structure[x][z][y]);
        }
      }
    }
  }
}

buildStructure(-5, -5, 10, 'tree', false);

setInterval(gameloop, 1000 / 60);
setInterval(tick, 1000);
