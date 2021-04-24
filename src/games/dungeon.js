/**
 * @type {import("../core/game.type").Game}
 */
export const game = {
  title: "An Epic Dungeon Adventure",
  author: "Jake Klassen",
  introText:
    "You've just escaped from your cell. It's time to get the hell out of here.",
  youWinText: "You got the treasure and ripped that Minotaur a new one.\n",
  winConditions: [
    {
      command: "playerHasItems",
      args: [
        {
          objectId: "treasure",
        },
      ],
    },
  ],
  player: {
    currentRoomId: "starting_room",
    inventory: [],
  },
  rooms: [
    {
      id: "starting_room",
      name: "Starting Room",
      description:
        "A room just North of the holding cells, but there's no point in going back to that dead end...",
      objects: [
        {
          id: "eastern_exit",
          name: "Eastern Exit",
          roomDescription: "An exit to the East. You can hear a faint buzzing.",
          objects: [],
          commands: {
            go: [
              {
                command: "playerChangeRoom",
                args: { roomId: "electrical_room" },
              },
            ],
          },
        },
        {
          id: "northern_exit",
          name: "Northern Exit",
          roomDescription:
            "An exit to the North. A demonic figure is embossed on the metal.",
          objects: [],
          commands: {
            go: [
              {
                command: "playerChangeRoom",
                args: {
                  roomId: "boss_room",
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: "electrical_room",
      name: "Electrical Room",
      description: "The buzzing of electricity is everywhere.",
      objects: [
        {
          id: "fuse",
          name: "Fuse",
          inventoryDescription: "A Fuse. It looks usable.",
          roomDescription: "A fuse on the ground. It looks usable.",
          objects: [],
          commands: {
            pickup: [
              {
                command: "playerPickupItem",
                args: {
                  roomId: "electrical_room",
                  objectId: "fuse",
                },
              },
            ],
          },
        },
        {
          id: "shiny_object",
          name: "Shiny Object",
          roomDescription: "A shiny object glittering on the floor.",
          objects: [],
          commands: {
            examine: [
              {
                command: "showMessage",
                args: {
                  message: "You discovered a fuse",
                },
              },
              {
                command: "roomAddObjects",
                args: {
                  roomId: "electrical_room",
                  objects: [
                    {
                      id: "fuse",
                      name: "Fuse",
                      inventoryDescription: "A Fuse. It looks usable.",
                      roomDescription: "A fuse on the ground. It looks usable.",
                      objects: [],
                      commands: {
                        pickup: [
                          {
                            command: "playerPickupItem",
                            args: {
                              roomId: "electrical_room",
                              objectId: "fuse",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                command: "roomRemoveObjects",
                args: {
                  roomId: "electrical_room",
                  objectIds: ["shiny_object"],
                },
              },
            ],
          },
        },
        {
          id: "western_exit",
          name: "Western Exit",
          roomDescription: "An exit to the West.",
          objects: [],
          commands: {
            go: [
              {
                command: "playerChangeRoom",
                args: {
                  roomId: "starting_room",
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: "boss_room",
      name: "Da Boss Room",
      description:
        "Did you see the damn door you came through?! This is Da Boss Room.",
      objects: [
        {
          id: "fusebox",
          name: "Fuse Box",
          roomDescription: "A fuse box, but it looks powered down.",
          objects: [],
          commands: {
            use: [
              {
                command: "if",
                if: [
                  {
                    command: "objectHasObjects",
                    args: [
                      {
                        roomId: "boss_room",
                        haystackObjectId: "fusebox",
                        needleObjectId: "fuse",
                      },
                    ],
                  },
                ],
                then: [
                  {
                    command: "showMessage",
                    args: {
                      message: "The fuse box is already activated.",
                    },
                  },
                ],
                else: [
                  {
                    command: "if",
                    if: [
                      {
                        command: "playerUsedItem",
                        args: {
                          objectId: "fuse",
                        },
                      },
                    ],
                    then: [
                      {
                        command: "playerTransferInventoryItemsToObject",
                        args: {
                          inventoryItemIds: ["fuse"],
                          roomId: "boss_room",
                          roomObjectId: "fusebox",
                        },
                      },
                      {
                        command: "roomUpdateObjectRoomDescription",
                        args: {
                          roomId: "boss_room",
                          roomObjectId: "fusebox",
                          roomDescription:
                            "A fuse box, but it's already activated.",
                        },
                      },
                      {
                        command: "showMessage",
                        args: {
                          message:
                            "The fuse box activates, electrifying the water, killing the minotaur.",
                        },
                      },
                      {
                        command: "roomRemoveObjects",
                        args: {
                          roomId: "boss_room",
                          objectIds: ["minotaur"],
                        },
                      },
                    ],
                    else: [
                      {
                        command: "showMessage",
                        args: {
                          message: "${name} is not compatible with ${item}",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: "minotaur",
          name: "Minotaur",
          roomDescription:
            "A hoved beast lurks with a large scythe that no man should cross. It's standing in a pool of water in front of the North exit.",
          objects: [],
          commands: {
            examine: [
              {
                command: "showMessage",
                args: { message: "A big fucking Minotaur" },
              },
            ],
          },
        },
        {
          id: "northern_exit",
          name: "Northern Exit",
          roomDescription: "An ornate door to the North. It's beautiful.",
          objects: [],
          commands: {
            go: [
              {
                command: "unless",
                unless: [
                  {
                    command: "roomHasObjects",
                    args: {
                      roomId: "boss_room",
                      objectIds: ["minotaur"],
                    },
                  },
                ],
                then: [
                  {
                    command: "playerChangeRoom",
                    args: { roomId: "treasure_room" },
                  },
                ],
                else: [
                  {
                    command: "showMessage",
                    args: {
                      message:
                        "A ${rooms.boss_room.objects.minotaur.name} is blocking your path!",
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "southern_exit",
          name: "Southern Exit",
          roomDescription: "An exit to the South, back to the starting room.",
          objects: [],
          commands: {
            go: [
              {
                command: "playerChangeRoom",
                args: { roomId: "starting_room" },
              },
            ],
          },
        },
      ],
    },
  ],
};
