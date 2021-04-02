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
  <a target='_blank' href='https://github.com/barhatsor/enderdragon/releases'><img src='https://img.shields.io/github/v/release/barhatsor/enderdragon?color=green&include_prereleases'/></a>
</p>
<p align="center">
  <h3 align="center">
    <a href="https://enderdragon.berryscript.com">Play it now</a>
  </h3>
</p>

## Todo
- Multiplayer (webRTC)

## Contributing :blush:

### Adding blocks

Upload block textures to `/textures`.

Add an object to `blockList.js`:
- `id`: id of block (required)
- `pic`: block texture (required if `multiside` is false)
- `name`: name of block (required)
- `invPic`: background position of the inventory spritesheet (required)
- `multiside`: if the block has a different texture on each side (optional)
- `sides`: block textures for each block side (required if `multiside` is true)
- `xshape`: if flower, torch, etc.
- `transparent`: if block is transparent

### Adding structures

Add a structure to `structures.js`.

### Anything else

`game.js` is where the magic happens. Document code and specify what changed. (eg. added glass, fixed bug)

If you have an idea, add it below.

## Ideas :sparkles:

Ideas turn into todos when someone sends a pull request.

- Breaking particles
- Command Blocks
- Lighting, [tint](https://minecraft.gamepedia.com/Tint)

## Credit

Inspired by Calada2.
Textures from the Minecraft Wiki are under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
Enderdragon is neither endorsed or affiliated with Mojang.
