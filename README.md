<h1 align="center">
  <a href="https://enderdragon.berryscript.com">
    <img src="/textures/title/background/title-upscale.png" alt="Enderdragon">
  </a>
</h1>
<p align="center">
  <h3 align="center">
A CSS3D version of Minecraft
  </h3>
</p>
<p align="center">
  <a target='_blank' href='https://github.com/barhatsor/enderdragon/releases'><img src='https://img.shields.io/github/v/release/barhatsor/enderdragon?color=lightgray&include_prereleases&label=%20'/></a>
</p>

## Todo 
- Lighting, [tint](https://minecraft.gamepedia.com/Tint)
- Redstone
- Command Blocks, chat
- Flying
- Items
- Title Screen
- Sounds
- Hand, inventory
- Settings

## Contributing :blush:

### Adding blocks

Upload block textures to `/textures`.

Add an object to `blockList.js`:
- `id`: id of block
- `pic`: main texture of block, if `multiside` is false it defaults to block texture
- `name`: of block
- `multiside`: if the block has a different texture on each side
- `sides`: block textures for each block side. required if `multiside` is true
- `xshape`: if flower, torch, etc.
- `transparent`: if glass, etc.
- `invPic`: background position of the inventory spritesheet.

### Adding structures

Add a structure to `structures.js`.

### Anything else

`game.js` is where the magic happens. Document code and specify what changed. (eg. added glass, fixed bug)

If you have an idea, add it below.

## Ideas :sparkles:

Ideas turn into todos when someone sends a pull request.

- Multiplayer (webRTC)
- Particles (walking, breaking)
- Biomes (mesa, plains)

## Credit

The inventory spritesheet is Minecraft Gamepedia.
Textures are modified from Minecraft.  
Inspired by Calada2.
