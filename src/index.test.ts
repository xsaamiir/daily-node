import { Daily } from "./index";

const token = process.env.DAILY_CO_API_KEY;

let client: Daily;

beforeAll(() => {
  // missing daily.co API key.
  // make sure to export the DAILY_CO_API_KEY before running tests.
  if (!token) process.exit(1);

  client = new Daily(token as string);
});

it("should fetch domainConfig", async () => {
  const resp = await client.domainConfig();
  expect(resp.domain_name).toBe("wearepeers");
});

it("should fetch only one room", async () => {
  // make sure the domain has at least one room
  const room = await client.createRoom({ privacy: "private" });
  expect(room.name).not.toBeUndefined();

  const rooms = await client.rooms({ limit: 1 });
  expect(rooms.data).toHaveLength(1);

  const deleted = await client.deleteRoom(room.name);
  expect(room.name).toBe(deleted.name);
});

it("should create a room, fetch it and delete it without errors", async function () {
  const newRoom = await client.createRoom({ privacy: "private" });
  expect(newRoom.name).not.toBeUndefined();

  const room = await client.room(newRoom.name);
  expect(newRoom.name).toBe(room.name);

  const deleted = await client.deleteRoom(room.name);
  expect(room.name).toBe(deleted.name);
});
