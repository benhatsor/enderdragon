const mapRadius = 8;
const heightLimit = 26;

const blocks = [];
let blockData = [];

var sensitivity = 1000;
var velocity = 400;
var verticalVelocity = 3.5;
var gravity = 30;

var blocksInWorld = 0;

var hotbar = ['Grass', 'Stone', 'Sand', 'Gravel', 'Poppy', 'Oak Log', 'Iron Ore', 'Redstone Torch', 'Totem of Undying'];

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
        if (y > 2) type = 0;
        else if (y > 1) type = 2;
        else if (y > 0) type = 1;
        else if (y == 0) type = 6;
        
        //blockData[x][z][y] = (y >= 10 ? 0 : (y >= 9 ? 2 : (y == 0 ? 6 : 3)));
        blockData[x][z][y] = type;
        
        if (type != 0) {
          blocksInWorld++;
        }

      }
    }
  }
  console.log(blocksInWorld);
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

let loadedTextures = false;
let imagesToLoad = ['InvSprite.png', 'tab_item_search.png'];

function loadTextures() {
  document.querySelector('.options').innerHTML = `
        <h2>Loading textures</h2>
        <div class="progress">
          <div class="fill"></div>
        </div>`;
  
  blockList.forEach(block => {
    if (block.id != 0) {
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
    }
  })
  
  itemList.forEach(item => {
    var img = document.createElement('img');
    img.src = 'textures/' + item.pic;
    img.onload = incrementLoader;
    img.onerror = incrementLoader;

    document.querySelector('.imgloader').appendChild(img);
  })
  
  for (var i = 0;i < imagesToLoad.length;i++) {
    var img = document.createElement('img');
        img.src = 'textures/' + imagesToLoad[i];
        img.onload = incrementLoader;
        img.onerror = incrementLoader;

        document.querySelector('.imgloader').appendChild(img);
  }
}

function incrementLoader() {
  var percent = 100 / document.querySelectorAll('.imgloader img').length,
      width = Number(document.querySelector('.progress .fill').style.width.replace('%',''));
  
  document.querySelector('.progress .fill').style.width = width + percent + '%';
  
  if (Math.round(width + percent) == 100) {
    loadedTextures = true;
    
    document.querySelector('.options').classList.add('hidden');
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
        
        if ((isXShaped(x, z, y - 1) && isXShaped(x, z, y)) || (isXShaped(x, z, y - 1) && isRedstone(x, z, y)) || (isRedstone(x, z, y - 1) && isXShaped(x, z, y))) {
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
    y: 2.5,
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

var clipSneakX = false,
    clipSneakZ = false;

function gameloop() {
  if (!paused) {
    delta = +new Date() - prevTime;
    prevTime = +new Date();

    let moveVector = new Vector(keymovement.x, keymovement.z).unit();
    moveVector = rotate2dVector(moveVector, player.rot.x);

    player.pos.x += moveVector.x * delta / velocity;
    updateOccupiedBlocks();

    if (occupiedBlockData[0] || occupiedBlockData[1]) {
      var clipBlock1 = (occupiedBlockData[0].id != 0 && !occupiedBlockData[0].xshape && !occupiedBlockData[0].redstone),
          clipBlock2 = (occupiedBlockData[1].id != 0 && !occupiedBlockData[1].xshape && !occupiedBlockData[1].redstone); // +1 block
      
      if (sneaking && !flying) {
        clipSneakX = (-player.pos.x < (sneakBlock.x + 1) || -player.pos.x > (sneakBlock.x - 1));
      }
      else {
        clipSneakX = true;
      }
      
      if (Math.abs(player.pos.x) > mapRadius || clipBlock1 || clipBlock2 && clipSneakX) {
        player.pos.x -= moveVector.x * delta / velocity;
      }
    }

    player.pos.z += moveVector.y * delta / velocity;
    updateOccupiedBlocks();

    if (occupiedBlockData[0] || occupiedBlockData[1]) {
      var clipBlock1 = (occupiedBlockData[0].id != 0 && !occupiedBlockData[0].xshape && !occupiedBlockData[0].redstone),
          clipBlock2 = (occupiedBlockData[1].id != 0 && !occupiedBlockData[1].xshape && !occupiedBlockData[1].redstone);
      
      if (sneaking && !flying) {
        clipSneakZ = (-player.pos.z < (sneakBlock.z + 1) || -player.pos.z > (sneakBlock.z - 1));
      }
      else {
        clipSneakZ = true;
      }
      
      if (Math.abs(player.pos.z) > mapRadius || clipBlock1 || clipBlock2 && clipSneakZ) {
        player.pos.z -= moveVector.y * delta / velocity;
      }
    }

    if (!flying) {
      verticalSpeed -= delta / 100;
    }
      
    let blockBelow = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta / 500)]];    
    let blockAbove = blockList[blockData[-Math.round(player.pos.x)][-Math.round(player.pos.z)][Math.round(player.pos.y + verticalSpeed * delta / 500 - -1.8)]];
    
    if (blockBelow && blockAbove) {
      
      var clipSneak = false;
      // check for sneak block
      if (sneaking && !flying && verticalSpeed >= 0) {
        clipSneak = (clipSneakX || clipSneakZ);
      }
      
      else if (sneaking && flying) {
        verticalSpeed = verticalVelocity * -1;
      }
      
      // when flying, reset vertical speed
      if (!sneaking && flying && !spacebarPressed) {
        verticalSpeed = 0;
      }
      
      // if decending on solid block while flying, disable flying
      if (flying && sneaking && blockBelow.id != 0 && !blockBelow.xshape && !blockBelow.redstone) {
        disableFlying();
        verticalSpeed = 0;
      }
      
      // if speed is lower than min velocity, reset
      if (verticalSpeed < -340) {
        verticalSpeed = 0;
        
        // if clipping edge of block while sneaking, reset
      } else if (verticalSpeed <= 0 && clipSneak) {
        verticalSpeed = 0;
        
        // if block below is solid, reset
      } else if (verticalSpeed <= 0 && blockBelow.id != 0 && !blockBelow.xshape && !blockBelow.redstone) {
        verticalSpeed = 0;
        player.pos.y = Math.round(player.pos.y) - .5;
        
        // if block above is solid, reset
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

let focusBlock = null;
let focusSide = null;

function checkFocus() {
  document.querySelector('#gui').style.visibility = 'hidden';
  let newFocusSide = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  let newFocusBlock = newFocusSide.parentNode;

  if (newFocusBlock != focusBlock) {
    if (focusBlock != null) focusBlock.setAttribute('focus', 'false');

    var radius = 5,
        playerX = -player.pos.x,
        playerY = (player.pos.y + player.height),
        playerZ = -player.pos.z,
        blockX = newFocusBlock.x,
        blockY = newFocusBlock.y,
        blockZ = newFocusBlock.z,
        blockDistance = Math.sqrt(Math.pow(playerX - blockX, 2) + Math.pow(playerY - blockY, 2) + Math.pow(playerZ - blockZ, 2)),
        blockInRadius = blockDistance <= radius;
            
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
  // if not looking at air or item is in hand
  if (fpsenabled && (focusBlock != null || activeBlock >= 1000)) {
    if (e.button === 2) {
      if (activeBlock < 1000) {
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
      }
      else if (activeBlock === 1000) { // Totem of Undying
        console.log('AMOGUS');
      }
    } else if (e.button === 0) {
      placeBlock(focusBlock.x, focusBlock.z, focusBlock.y, 0);
    } else if (e.button === 1) {
      let block = blockData[focusBlock.x][focusBlock.z][focusBlock.y];
      if (block > 0) copyBlock(block);
    }
  }
};

var activeBlock = getId(hotbar[0]).id;

function buildHotbar(hotbar) {
  var invHotbar = document.querySelector('.inventory .hotbar'),
      domHotbar = '';
  
  for (var i = 0;i < hotbar.length;i++) {
    // get block data by index
    var block = getId(hotbar[i]);
    
    //* render main hotbar *//
    document.querySelectorAll('.slot')[i].style.backgroundPosition = block.invPic;
    
    //* render inventory hotbar *//
    
    // generate HTML
    domHotbar += `<div class="slot" onmouseenter="showMinetip('`+ block.name +`')" onmousemove="moveMinetip(event)" onmouseleave="hideMinetip()" onclick="dragItem(this)" name="`+ block.name +`" style="background-position:`+ block.invPic +`">
                  <div class="item"></div></div>`;
  }
  
  // insert HTML into DOM
  invHotbar.innerHTML = domHotbar;
  
  // change active block
  var index = Array.from(document.querySelectorAll('.slot')).indexOf(document.querySelector('.slot.selected'));
  activeBlock = getId(hotbar[index]).id;
}

function getId(name) {
  return blockList.filter(block => block.name == name)[0] ? blockList.filter(block => block.name == name)[0] : itemList.filter(item => item.name == name)[0];
}

var sneaking = false;

window.addEventListener('wheel', e => {
  let delta;
  e => e.preventDefault();

  if (e.wheelDelta) {
    delta = e.wheelDelta;
  }
  else {
    delta = -1 * e.deltaY;
  }

  var activeIndex = Array.from(document.querySelectorAll('.slot')).indexOf(document.querySelector('.slot.selected')); 
  
  if (delta < 0) {
    changeBlock(activeIndex == hotbar.length - 1 ? 0 : activeIndex + 1);
  }

  else if (delta > 0) {
    changeBlock(activeIndex == 0 ? hotbar.length - 1 : activeIndex - 1);
  }
});

document.onkeydown = function(e) {
  var key = e.keyCode - 49;
  
  // if keys are within range 1-9
  if (key >= 0 && key <= 8 && !paused && !inventoryOpen) {
    // change active block
    changeBlock(key);
  }
  
  // 16 is SHIFT
  if (e.keyCode == 16 && !inventoryOpen) {
    sneak();
  }
  
  // when searching, make sure E dosen't close inventory
  var searching = document.querySelector('.inventory .search .input') === document.activeElement;
  
  // 69 is E
  if (e.keyCode == 69 && !searching) {
    toggleInventory();
  }
  
  // check for sprint or fly
  checkDblClick(e);
};

document.onkeyup = function(e) {
  
  // 16 is SHIFT
  if (e.keyCode == 16) {
    disableSneaking();
  }
  
  // if sprinting (W is keybinds.forward)
  if (e.keyCode == keybinds.forward && sprinting) {
    disableSprinting();
  }
  // if not sprinting, set flag to detect double click
  else if (e.keyCode == keybinds.forward) {
    sprintKeyUp = true;
  }
  
  // if not flying, set flag to detect double click
  if (e.keyCode == keybinds.jump) {
    spacebarUp = true;
  }
}

var inventoryOpen = false;
function toggleInventory() {
  if (!paused) {
    if (!inventoryOpen) {    
      var inventory = document.querySelector('.inventory .items .tab'),
          domInventory = '';

      // run on all blocks that exist
      blockList.forEach(block => {
        
        // if block is not air
        if (block.id != 0) {
          // add slot
          domInventory += `<div class="slot" onmouseenter="showMinetip('`+ block.name +`')" onmousemove="moveMinetip(event)" onmouseleave="hideMinetip()" onclick="dragItem(this)" name="`+ block.name +`" style="background-position:`+ block.invPic +`">
                           <div class="item"></div></div>`;
        }

      })
                        
      // run on all items that exist
      itemList.forEach(item => {
        
        // if item is not air
        if (item.id != 0) {
          // add slot
          domInventory += `<div class="slot" onmouseenter="showMinetip('`+ item.name +`')" onmousemove="moveMinetip(event)" onmouseleave="hideMinetip()" onclick="dragItem(this)" name="`+ item.name +`" style="background-position:`+ item.invPic +`">
                           <div class="item"></div></div>`;
        }

      })

      // place HTML into DOM
      inventory.innerHTML = domInventory;

      inventoryOpen = true;

      // exit pointerlock to browse inventory
      document.exitPointerLock();

      // this is important, resumes the game to make up for pausing it
      // the game toggles pause state whenever the pointerlock state changes
      pause();

      // equally important as it makes CSS show the inventory
      document.querySelector('#gui').classList.add('takingInv');
    }
    else {
      inventoryOpen = false;

      // hides inventory
      document.querySelector('#gui').classList.remove('takingInv');    

      // clears search input
      document.querySelector('.inventory .search .input').innerHTML = '';

      document.querySelector('#camera').requestPointerLock();

      // this is important, pauses the game to make up for resuming it earlier
      // the game toggles pause state whenever the pointerlock state changes
      pause();
    }
  }
}

var draggingItem = false;
var startedDragging = false;

// item for dragging
var invDragItem = document.querySelector('.inventory .item.drag');

function dragItem(item) {
  // get item index in hotbar
  var itemIndex = item.parentElement.classList.contains('hotbar') ? Array.from(document.querySelectorAll('.inventory .hotbar .slot')).indexOf(item) : -1;
  
  // if not already dragging and item not air
  if (!draggingItem && hotbar[itemIndex] != 'Air') {
    draggingItem = true;
    startedDragging = true;
        
    // hide inventory item tooltip
    document.querySelector('.inventory .minetip').classList.remove('visible');

    // show item for dragging
    invDragItem.setAttribute('name', item.getAttribute('name'));
    invDragItem.style.backgroundPosition = item.style.backgroundPosition;
    invDragItem.classList.add('visible');
    
    // if item from hotbar
    if (item.parentElement.classList.contains('hotbar')) {
      // set item slot to air
      hotbar[itemIndex] = 'Air';
      
      // rebuild hotbar
      buildHotbar(hotbar);
    }
  }
  else {
    startedDragging = false;
  }
}

document.addEventListener('click', e => {
  if (draggingItem && !startedDragging) {
    // reset
    draggingItem = false;
    invDragItem.classList.remove('visible');
    
    // if clicked on item from hotbar
    if (e.target.classList.contains('slot')) {
      if (e.target.parentElement.classList.contains('hotbar')) {
        // get item index
        var index = Array.from(document.querySelectorAll('.inventory .hotbar .slot')).indexOf(e.target);

        // set hotbar slot to item
        hotbar[index] = invDragItem.getAttribute('name');

        // rebuild hotbar
        buildHotbar(hotbar);
      }
      
      // show tooltip
      showMinetip(e.target.getAttribute('name'));
    }
  }
  
  if (draggingItem && !e.target.classList.contains('slot')) {
    // reset
    draggingItem = false;
    startedDragging = false;
    invDragItem.classList.remove('visible');
  }
})

document.addEventListener('mousemove', e => {
  invDragItem.style.left = e.clientX + 'px';
  invDragItem.style.top = e.clientY + 'px';
})

function showMinetip(data) {
  // shows tooltip with block name
  if (!draggingItem && data != 'Air') {
    document.querySelector('.inventory .minetip').innerHTML = data;
    document.querySelector('.inventory .minetip').classList.add('visible');
    
    if (data == 'Totem of Undying') {
      document.querySelector('.inventory .minetip').classList.add('format-e');
    }
    else {
      document.querySelector('.inventory .minetip').classList.remove('format-e');
    }
  }
}

function moveMinetip(e) {
  // moves tooltip to mouse pos
  document.querySelector('.inventory .minetip').style.left = e.clientX + 'px';
  document.querySelector('.inventory .minetip').style.top = e.clientY + 'px';
}

function hideMinetip() {
  document.querySelector('.inventory .minetip').classList.remove('visible');
}

// when typing in inventory search input
document.querySelector('.inventory .search .input').addEventListener('input', e => {
  var query = document.querySelector('.inventory .search .input').innerText.toUpperCase();
  
  // search blocks
  document.querySelectorAll('.inventory .tab .slot').forEach(item => {
    if (item.getAttribute('name').toUpperCase().includes(query)) {
      item.style.display = '';
    }
    else {
      item.style.display = 'none';
    }
  })
})

// smooth sneak animation
function animateSneak(direction) {
  if (direction == 'forward') {
    if (player.height >= 1.1) {
      // animation
      player.height -= 0.05;
      
      // calling this as an inline anonymous function to pass animation direction
      requestAnimationFrame(() => { animateSneak('forward') });
    }
    else {
      // snap to desired value at end of animation
      player.height = 1.1;
    }
  }
  if (direction == 'backward') {
    if (player.height <= 1.3) {
      // animation
      player.height += 0.05;
      
      // calling this as an inline anonymous function to pass animation direction
      requestAnimationFrame(() => { animateSneak('backward') });
    }
    else {
      // snap to desired value at end of animation
      player.height = 1.3;
    }
  }
}

// determines how much time (ms), between keypresses
// is considered a double click
var keyDelta = 250;
    
// these are flags to determine sprint
var lastKeypressTimeSprint = 0,
    sprinting = false,
    sprintKeyUp = false;

// these are flags to determine flying
var lastKeypressTimeFly = 0,
    flying = false,
    spacebarUp = false;

// check sprint and fly
function checkDblClick(e) {
  
  // check sprint (keybinds.forward is W)
  if (e.keyCode == keybinds.forward) {
    var thisKeypressTime = new Date();
    
    // check delta between keypresses, was there another keypress, and if sneaking
    // can't run while sneaking
    if (thisKeypressTime - lastKeypressTimeSprint <= keyDelta && sprintKeyUp && !sneaking) {
      sprint();
      
      // reset
      thisKeypressTime = 0;
      sprintKeyUp = false;
    }
    else if (sprintKeyUp) {
      // if delta has passed, reset
      sprintKeyUp = false;
    }
    lastKeypressTimeSprint = thisKeypressTime;
  }
  
  // check fly (keybinds.jump is SPACE)
  if (e.keyCode == keybinds.jump) {
    var thisKeypressTime = new Date();
    
    // check delta between keypresses, was there another keypress, and if sneaking
    // can't fly while sneaking
    if (thisKeypressTime - lastKeypressTimeFly <= keyDelta && spacebarUp && !sneaking) {
      
      // toggle flying
      if (flying == false) {
        fly();
      }
      else {
        disableFlying();
      }
      
      // reset
      thisKeypressTime = 0;
      spacebarUp = false;
    }
    else if (spacebarUp) {
      // if delta has passed, reset
      spacebarUp = false;
    }
    lastKeypressTimeFly = thisKeypressTime;
 }
}

var sneakBlock = { x: Math.round(player.pos.x), z: Math.round(player.pos.z) };

function sneak() {
  
  // only animate sneak, change height and velocity
  // if not flying, jumping, or already sneaking
  if (!flying && !sneaking && verticalSpeed >= 0) {    
    velocity = 700;
    verticalVelocity = 2.5;

    animateSneak('forward');
  }

  sneakBlock = { x: Math.round(player.pos.x), z: Math.round(player.pos.z) };
  sneaking = true;
}

function disableSneaking() {
  
  // if not flying, animate sneak
  if (!flying) {
    velocity = 400;
    verticalVelocity = 3.7;

    animateSneak('backward');
  }

  sneaking = false;
}

function fly() {
  velocity = 300;
  verticalVelocity = 3;
  
  verticalSpeed = verticalVelocity / 2;
  
  flying = true;
  
  // change camera perspective
  // worth mentioning: when sprinting and flying,
  // camera perspective is even more skewed. this happens in the CSS
  document.querySelector('#camera').classList.add('fly');
}

function disableFlying() {
  velocity = 400;
  verticalVelocity = 3.5;
  
  verticalSpeed = verticalVelocity / 2;
  
  flying = false;
  
  // change camera perspective back to normal
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
  
  // change camera perspective
  // worth mentioning: when sprinting and flying,
  // camera perspective is even more skewed. this happens in the CSS
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

  // change camera perspective back to normal
  document.querySelector('#camera').classList.remove('sprint');
}

var paused = false;
var inspector = false;

function pause() {
  if (!paused) {
    // show pause screen
    document.querySelector('#gui').classList.add('pause');
    paused = true;

    document.querySelector('.options').innerHTML = `
          <h1>Game Menu</h1>
          <div class="button" role="button" onclick="document.querySelector('#camera').requestPointerLock()">Back to Game</div>
          <div class="buttons">
            <div class="button" role="button" onclick="redirect('https://github.com/benhatsor/enderdragon/issues')">Report Bugs</div>
            <div class="button" role="button" onclick="inspector = true;document.querySelector('#gui').style.display = 'none'">Inspector Mode</div>
          </div>
          <div class="button" role="button" onclick="returnToTitle()">Save and Quit to Title</div>`;
  }
  else {
    // hide pause screen
    document.querySelector('#gui').classList.remove('pause');
    paused = false;
  }
}

function redirect(url) {
  window.location.href = url;
}

var tooltipTimeout = null;

// change active block
function changeBlock(id) {
  // index of current active block
  var index = Array.from(document.querySelectorAll('.slot')).indexOf(document.querySelector('.slot.selected'));
  
  // if current != new
  if (index != id) {
    activeBlock = getId(hotbar[id]).id;

    document.querySelector('.slot.selected').classList.remove('selected');
    document.querySelectorAll('.slot')[id].classList.add('selected');

    clearTimeout(tooltipTimeout);

    // don't show tooltip for air
    if (activeBlock != 0) {
      
      // show tooltip
      
      document.querySelector('.hotbar').classList.remove('tooltip');
      
      document.querySelector('.hotbar').setAttribute('tooltip', hotbar[id]);
      window.setTimeout(() => { document.querySelector('.hotbar').classList.add('tooltip') }, 0);

      tooltipTimeout = window.setTimeout(() => {
        document.querySelector('.hotbar').setAttribute('tooltip', '');
        document.querySelector('.hotbar').classList.remove('tooltip');
      }, 2000);
      
      // if holding Totem of Undying, show yellow text
      if (activeBlock === 1000) {
        document.querySelector('.hotbar').classList.add('format-e');
      } else {
        document.querySelector('.hotbar').classList.remove('format-e');
      }
        
    }
    else {
      document.querySelector('.hotbar').setAttribute('tooltip', '');
      document.querySelector('.hotbar').classList.remove('tooltip');
    }
  }
}

// copy block to hotbar on middle mouse button press
function copyBlock(block) {
  var index = Array.from(document.querySelectorAll('.slot')).indexOf(document.querySelector('.slot.selected'));
  
  hotbar[index] = blockList[block].name;
  
  // rebuild hotbar
  buildHotbar(hotbar);
}

var version = '0.0.5';
var exVersion = 'Alpha';

function debug() {
  var faceBlock = 0;
  if (focusBlock != null) {
    faceBlock = blockList[blockData[focusBlock.x][focusBlock.z][focusBlock.y]].id;
  }
  
  // show debug screen
  document.querySelector('.debugscreen').innerHTML = `
  <p>Minecraft Enderdragon `+version+` (`+version+`/`+exVersion+`)</p>
  <p>Client @ `+1+` ms ticks (Netlify)</p>
  <br>
  <p>XYZ: `+player.pos.x.toFixed(3)+` / `+player.pos.y.toFixed(5)+` / `+player.pos.z.toFixed(3)+`</p>
  <p>Block: `+Math.round(player.pos.x)+` `+Math.round(player.pos.y)+` `+Math.round(player.pos.z)+`</p>
  <p>Facing: `+player.rot.x.toFixed(1)+` / `+ player.rot.y.toFixed(1) +` Block: `+ faceBlock +`</p>
  <p>BT: `+blockList.length+`</p>
  <br>
  <p>Debug: Inspector [esc]: pause gameloop [alt]: exit</p>
  <p>For help: press F3 + Q</p>`;
  
}

var f3 = false;
var f3q = false;

document.addEventListener('keydown', shortcutDown);
document.addEventListener('keyup', shortcutUp);

// check for F3 and F3Q
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
    
    // if F3Q, go to help page
    redirect('https://github.com/benhatsor/enderdragon#README');
  }
  
  // if alt key press, disable inspector mode
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
  
  // tick is https://minecraft.gamepedia.com/Tick
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

// structure API
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

let gameInterval = null;
let tickInterval = null;

function initSingleplayer() {
  document.querySelector('.options').classList.remove('titlescreen');
  document.querySelector('#camera').requestPointerLock();
  pause();

  loadTextures();
  
  constructWorld();
  renderGame();
  
  gameInterval = setInterval(gameloop, 1000 / 60);
  tickInterval = setInterval(tick, 1000);
  
  buildHotbar(hotbar);
  
  //buildStructure(-5, -5, 3, 'tree', false);
  
}

function returnToTitle() {
    
  clearInterval(gameInterval);
  clearInterval(tickInterval);

  if (paused) {
    pause();
  }
  
  blockData = [];
  blocksInWorld = 0;
  hotbar = ['Grass', 'Stone', 'Sand', 'Gravel', 'Poppy', 'Oak Log', 'Iron Ore', 'Redstone Torch', 'Totem of Undying'];
  
  document.querySelector('#scene').innerHTML = '';
  
  document.querySelector('.imgloader').innerHTML = '';
  loadedTextures = false;
  
  player.pos = {
    x: 0,
    y: 2.5,
    z: 0
  };
  player.rot = {
    x: 0,
    y: 0
  };
  
  refresh_pos();
  
  document.querySelector('.options').classList.add('titlescreen');
  document.querySelector('.options').classList.remove('hidden');
  document.querySelector('.options').innerHTML = `
        <div class="title">
          <div class="edition"></div>
          <div class="splash"></div>
        </div>
        <div class="button" role="button" onclick="document.querySelector('.options').innerHTML='<h2>Loading</h2>';initSingleplayer()">Singleplayer</div>
        <div class="button disabled" role="button">Multiplayer</div>
        <div class="button disabled" role="button">Realms</div>
        <div class="version">Minecraft Enderdragon `+ version +` (`+ exVersion +`)</div>`;
  
  randomSplash();
  
  var d = Math.random();
  if (d < 0.1) {
    // minceraft easter egg
    //document.querySelector('.title').classList.add('minceraft');
  }
}

var splashes = "Missing ) after argument list! Call Now! Toll-Free! Ask your doctor! Now in CSS3D! Impressive! Star-struck! Child's play! Classy! Open source! Complex cellular automata! Come to the duck side! Don't bother with the clones! Don’t worry, be happy! Fat free! Feature packed! Funk soul brother! Eggs and Spam! Gargamel plays it! Google anlyticsed! Han shot first! OMGLOL! Internet enabled! It's a game! When it's finished! Groundbreaking! Javascript edition! Limited edition! Look mum, I’m in a splash! Notch was here! Menger sponge! Minceraft! Enderdragon! More polygons! Not linear! Pixels! pls rt! Does mrdoob approve? Also try Github! Now with more faces! Responsive! Pure CSS! Contenteditable! Also try Among Us! Also try Netlify! Sugar-free! 1% Chance! 404'd! Runs on Netlify! Quaternions! Everything is awesome! What does the fox say? Is this a pigeon? ______ All Along! youtu.be/dQw4w9WgXcQ";
splashes = splashes.replaceAll('! ','!`').replaceAll('? ','?`').split('`');

returnToTitle();

function randomSplash() {
  var splash = splashes[getRandomInt(splashes.length-1)];
  
  if (splash.length > 23) {
    document.querySelector('.title .splash').classList = 'splash supersmall';
  }
  else if (splash.length > 19) {
    document.querySelector('.title .splash').classList = 'splash small';
  }
  else {
    document.querySelector('.title .splash').classList = 'splash';
  }
  
  document.querySelector('.title .splash').innerText = splash;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
