const blockList = [
    {
        name: 'Air',
        xshape: false,
        invPic: '32px 0',
        id: 0
    },
    {
        id: 1,
        pic: 'dirt.png',
        name: 'Dirt',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-576px -960px'
    },
    {
        id: 2,
        pic: 'grass_block_top.png',
        name: 'Grass',
        multiside: true,
        xshape: false,
        transparent: false,
        sides: {
            0: 'grass_block_side.png',
            1: 'grass_block_side.png',
            2: 'grass_block_side.png',
            3: 'grass_block_side.png',
            4: 'grass_block_top.png',
            5: 'dirt.png',
        },
        invPic: '-640px -960px'
    },
    {
        id: 3,
        pic: 'stone.png',
        name: 'Stone',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-224px -992px'
    },
    {
        id: 4,
        pic: 'cobblestone.png',
        name: 'Cobblestone',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-960px -3328px'
    },
    {
        id: 5,
        pic: 'sand.png',
        name: 'Sand',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-480px -3360px',
        fallingSand: true
    },
    {
        id: 6,
        pic: 'bedrock.png',
        name: 'Bedrock',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-320px -960px'
    },
    {
        id: 7,
        pic: 'oak_planks.png',
        name: 'Oak Planks',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-192px -896px'
    },
    {
        id: 8,
        pic: 'oak_log.png',
        name: 'Oak Log',
        multiside: true,
        xshape: false,
        transparent: false,
        sides: {
            0: 'oak_log.png',
            1: 'oak_log.png',
            2: 'oak_log.png',
            3: 'oak_log.png',
            4: 'oak_log_top.png',
            5: 'oak_log_top.png',
        },
        invPic: '-160px -3424px'
    },
    {
        id: 9,
        pic: 'oak_leaves.png',
        name: 'Oak Leaves',
        multiside: false,
        xshape: false,
        transparent: true,
        invPic: '-128px -3424px'
    },
    {
        id: 10,
        pic: 'oak_sapling.png',
        name: 'Oak Sapling',
        multiside: false,
        xshape: true,
        transparent: false,
        invPic: '-192px -3424px'
    },
    {
        id: 11,
        pic: 'glass.png',
        name: 'Glass',
        multiside: false,
        xshape: false,
        transparent: true,
        invPic: '-960px -3232px'
    },
    {
        id: 12,
        pic: 'poppy.png',
        name: 'Poppy',
        multiside: false,
        xshape: true,
        transparent: false,
        invPic: '-352px -3424px'
    },
    {
        id: 13,
        pic: 'redstone_torch.png',
        name: 'Redstone Torch',
        multiside: false,
        xshape: true,
        transparent: false,
        invPic: '-608px -3328px'
    },
    {
        id: 14,
        pic: 'redstone_block.png',
        name: 'Redstone Block',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-64px -3328px'
    },
    {
        id: 15,
        pic: 'command_block_side.png',
        name: 'Command Block',
        multiside: true,
        xshape: false,
        transparent: false,
        sides: {
            0: 'command_block_back.png',
            1: 'command_block_side.png',
            2: 'command_block_back.png',
            3: 'command_block_side.png',
            4: 'command_block_front.png',
            5: 'command_block_front.png',
        },
        invPic: '-736px -1216px',
        animation: {
          frametime: 10
        }
    },
    {
        id: 16,
        pic: 'torch.png',
        name: 'Torch',
        multiside: false,
        xshape: true,
        transparent: false,
        invPic: '-928px -3360px'
    },
    {
        id: 17,
        pic: 'soul_torch.png',
        name: 'Soul Torch',
        multiside: false,
        xshape: true,
        transparent: false,
        invPic: '-864px -128px'
    },
    {
        id: 18,
        pic: 'redstone_dust_dot.png',
        name: 'Redstone Dust',
        multiside: false,
        xshape: false,
        transparent: true,
        invPic: '-224px -3520px',
        redstone: true
    },
    {
        id: 19,
        pic: 'gravel.png',
        name: 'Gravel',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-128px -3360px',
        fallingSand: true
    },
    {
        id: 20,
        pic: 'coal_ore.png',
        name: 'Coal Ore',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-960px -3360px'
    },
    {
        id: 21,
        pic: 'iron_ore.png',
        name: 'Iron Ore',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-64px -3392px'
    },
    {
        id: 22,
        pic: 'gold_ore.png',
        name: 'Gold Ore',
        multiside: false,
        xshape: false,
        transparent: false,
        invPic: '-32px -3392px'
    },
];
