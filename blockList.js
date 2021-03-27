/* sides: {
        0: // side
        1: // side
        2: // side
        3: // side
        
        4: // top
        5: // bottom
    }
*/

const blockList = [
    {
        name: 'Air',
        invPic: '32px 0',
        id: 0
    },
    {
        id: 1,
        pic: 'dirt.png',
        name: 'Dirt',
        invPic: '-576px -960px'
    },
    {
        id: 2,
        pic: 'grass_block_top.png',
        name: 'Grass',
        multiside: true,
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
        invPic: '-224px -992px'
    },
    {
        id: 4,
        pic: 'cobblestone.png',
        name: 'Cobblestone',
        invPic: '-960px -3328px'
    },
    {
        id: 5,
        pic: 'sand.png',
        name: 'Sand',
        invPic: '-480px -3360px',
        fallingSand: true
    },
    {
        id: 6,
        pic: 'bedrock.png',
        name: 'Bedrock',
        invPic: '-320px -960px'
    },
    {
        id: 7,
        pic: 'oak_planks.png',
        name: 'Oak Planks',
        invPic: '-192px -896px'
    },
    {
        id: 8,
        pic: 'oak_log.png',
        name: 'Oak Log',
        multiside: true,
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
        transparent: true,
        invPic: '-128px -3424px'
    },
    {
        id: 10,
        pic: 'oak_sapling.png',
        name: 'Oak Sapling',
        xshape: true,
        invPic: '-192px -3424px'
    },
    {
        id: 11,
        pic: 'glass.png',
        name: 'Glass',
        transparent: true,
        invPic: '-960px -3232px'
    },
    {
        id: 12,
        pic: 'poppy.png',
        name: 'Poppy',
        xshape: true,
        invPic: '-352px -3424px'
    },
    {
        id: 13,
        pic: 'redstone_torch.png',
        name: 'Redstone Torch',
        xshape: true,
        invPic: '-608px -3328px'
    },
    {
        id: 14,
        pic: 'redstone_block.png',
        name: 'Redstone Block',
        invPic: '-64px -3328px'
    },
    {
        id: 15,
        pic: 'command_block_side.png',
        name: 'Command Block',
        multiside: true,
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
        xshape: true,
        invPic: '-928px -3360px'
    },
    {
        id: 17,
        pic: 'soul_torch.png',
        name: 'Soul Torch',
        xshape: true,
        invPic: '-864px -128px'
    },
    {
        id: 18,
        pic: 'redstone_dust_dot.png',
        name: 'Redstone Dust',
        transparent: true,
        invPic: '-224px -3520px',
        redstone: true
    },
    {
        id: 19,
        pic: 'gravel.png',
        name: 'Gravel',
        invPic: '-128px -3360px',
        fallingSand: true
    },
    {
        id: 20,
        pic: 'coal_ore.png',
        name: 'Coal Ore',
        invPic: '-960px -3360px'
    },
    {
        id: 21,
        pic: 'iron_ore.png',
        name: 'Iron Ore',
        invPic: '-64px -3392px'
    },
    {
        id: 22,
        pic: 'gold_ore.png',
        name: 'Gold Ore',
        invPic: '-32px -3392px'
    },
    {
        id: 23,
        pic: 'netherite_block.png',
        name: 'Block of Netherite',
        invPic: '-96px -128px'
    },
    {
        id: 24,
        pic: 'quartz_block_side.png',
        name: 'Block of Quartz',
        multiside: true,
        sides: {
            0: 'quartz_block_side.png',
            1: 'quartz_block_side.png',
            2: 'quartz_block_side.png',
            3: 'quartz_block_side.png',
            4: 'quartz_block_top.png',
            5: 'quartz_block_bottom.png',
        },
        invPic: '-192px -3232px'
    },
    {
        id: 25,
        pic: 'quartz_bricks.png',
        name: 'Quartz Bricks',
        invPic: '-992px -256px'
    },
    {
        id: 26,
        pic: 'chiseled_quartz_block.png',
        name: 'Chiseled Quartz Block',
        multiside: true,
        sides: {
            0: 'chiseled_quartz_block.png',
            1: 'chiseled_quartz_block.png',
            2: 'chiseled_quartz_block.png',
            3: 'chiseled_quartz_block.png',
            4: 'chiseled_quartz_block_top.png',
            5: 'chiseled_quartz_block.png',
        },
        invPic: '-224px -864px'
    },
    {
        id: 27,
        pic: 'quartz_pillar.png',
        name: 'Quartz Pillar',
        multiside: true,
        sides: {
            0: 'quartz_pillar.png',
            1: 'quartz_pillar.png',
            2: 'quartz_pillar.png',
            3: 'quartz_pillar.png',
            4: 'quartz_pillar_top.png',
            5: 'quartz_pillar.png',
        },
        invPic: '-288px -896px'
    },
    {
        id: 28,
        pic: 'emerald_ore.png',
        name: 'Emerald Ore',
        invPic: '-0px -3392px'
    },
    {
        id: 29,
        pic: 'deepslate_emerald_ore.png',
        name: 'Deepslate Emerald Ore',
        invPic: '-352px -512px'
    },
    {
        id: 30,
        pic: 'emerald_block.png',
        name: 'Emerald Block',
        invPic: '-96px -3232px'
    },
    {
        id: 31,
        pic: 'deepslate.png',
        name: 'Deepslate',
        invPic: '-704px -480px'
    },
];

const itemList = [
    {
        id: 0,
        pic: 'totem_of_undying.png',
        name: 'Totem Of Undying',
        invPic: '-768px -3616px'
    },
];
