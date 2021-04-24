/**
 *
 * @param {import("../game.type.js").Game} game
 * @param {import("../expression.type.js").RoomUpdateObjectRoomDescription['args']} args
 */
export const roomUpdateObjectRoomDescription = (game, args) => {
  const roomId = args.roomId.trim().toLowerCase();
  const roomObjectId = args.roomObjectId.trim().toLowerCase();
  const room = game.rooms.find((room) => room.id === roomId);

  // TODO handle error
  if (room == null) {
    console.warn(`room ${roomId} not found`);

    return false;
  }

  const roomObject = room.objects.find((object) => object.id === roomObjectId);

  // TODO handle error
  if (roomObject == null) {
    console.warn(`room object ${roomObject} not found`);

    return false;
  }

  roomObject.roomDescription = args.roomDescription;

  return true;
};
