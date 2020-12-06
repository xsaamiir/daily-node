import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { camelCase, snakeCase } from "./switch-case";

export interface DomainConfig {
  // Whether "Powered by Daily.co" displays in the in-call UI.
  // The default value depends on the plan that the domain is subscribed to.
  // You can only set this value if you are subscribed to a plan that allows
  // the branding to be hidden in the in-call UI.
  hideDailyBranding: boolean;

  // The default language for the video call UI, for all calls.
  // You can override this in a room's properties, or in a user's meeting token.
  // You can also set the language dynamically using the front-end library
  // setDailyLang() method.
  // Currently supported languages are en and fr.
  // You can also set this to user, which will use the browser's current language
  // setting (if it is English or French).
  lang: Language | null;

  // (For meetings that open in a separate browser tab.)
  // When a user clicks on the in-call menu bar's "leave meeting" button,
  // the browser loads this URL.
  // A query string that includes a parameter of the form recent_call=<domain>/<room>
  // is appended to the URL.
  // On mobile, you can redirect to a deep link to bring a user back into your app.
  redirectOnMeetingExit: string;
}

export interface CreateRoomRequest {
  name?: string;
  privacy: Privacy;
  config?: RoomConfig;
}

export interface DeleteResponse {
  deleted: boolean;
  name: string;
}

export interface DomainResponse {
  domainName: string;
  config: DomainConfig;
}

export type Language = "en" | "fr" | "user";

export interface MeetingToken {
  // A unix timestamp (seconds since the epoch.)
  // The token is not valid until this time.
  nbf?: number;

  // A unix timestamp (seconds since the epoch.)
  // The token is not valid after this time.
  exp?: number;

  // The room for which this token is valid.
  // If room_name isn't set, the token is valid for all rooms in your domain.
  // *You should always set room_name if you are using this token to control access to a meeting.
  roomName?: string;

  // The user has meeting owner privileges.
  // For example, if the room is configured for owner_only_broadcast, this user can send video, and audio, and can screenshare.
  isOwner?: string;

  // The user's name in this meeting.
  // The name displays in the user interface when the user is muted or has turned off the camera, and in the chat window.
  // This username is also saved in the meeting events log (meeting events are retrievable using the analytics API methods.)
  userName?: string;

  // The user's id for this meeting session.
  // This id is saved in the meeting events log (meeting events are retrievable using the analytics API methods).
  // You can use user_id to map between your user database and meeting events/attendance.
  // The id does not display in our standard in-call UI during the call.
  // If you do not set this, it will be set to the client's randomly generated session_id for this connection.
  userId?: string;

  // The user is allowed to screenshare.
  enableScreenshare?: boolean;

  // The user joins with camera off.
  startVideoOff?: boolean;

  // The user joins with mic muted.
  startAudioOff?: boolean;

  // The user is allowed to record.
  // The value of the field controls whether the recording is saved locally to disk, or is uploaded in real-time to the Daily.co cloud.
  // Allowed values are "cloud", and "local".
  enableRecording?: Recording;

  // Start cloud recording when the user joins the room.
  // This can be used to always record and archive meetings, for example in a customer support context.
  startCloudRecording?: boolean;

  // (For meetings that open in a separate browser tab.)
  // When a user leaves a meeting using the button in the in-call menu bar, the browser tab closes.
  // This can be a good way, especially on mobile, for users to be returned to a previous website flow after a call.
  closeTabOnExit?: boolean;

  // (For meetings that open in a separate browser tab.)
  // When a user leaves a meeting using the button in the in-call menu bar, the browser loads this URL.
  // A query string that includes a parameter of the form recent_call=<domain>/<room> is appended to the URL.
  // On mobile, you can redirect to a deep link to bring a user back into your app.
  redirectOnMeetingExit?: string;

  // Kick this user out of the meeting at the time this meeting token expires.
  // If either this property or eject_after_elapsed are set for the token, the room's eject properties are overridden.
  ejectAtTokenExp?: boolean;

  // Kick this user out of the meeting this many seconds after they join the meeting.
  // If either this property or eject_at_token_exp are set for the token, the room's eject properties are overridden.
  ejectAfterElapsed?: boolean;

  // The language for the video call UI, for this user's session.
  // You can also set the language dynamically using the front-end library setDailyLang() method.
  // Currently supported languages are en and fr. You can also set this to user,
  // which will use the browser's current language setting (if it is English or French).
  lang?: Language;
}

export interface MeetingTokenResponse {
  token: string;
}

export interface PaginatedRequest {
  limit?: number;
  endingBefore?: string;
  startingAfter?: string;
}

export interface PaginatedResponse<T> {
  totalCount: number;
  data: T[];
}

export type Privacy = "public" | "org" | "private";

export type Recording = "cloud" | "local";

export interface Room {
  name: string;

  // Controls who joins a meeting
  privacy: Privacy;

  config: RoomConfig;
}

export interface RoomConfig {
  // A unix timestamp (seconds since the epoch.)
  // Users cannot join a meeting in this room before this time. Default is <not set>.
  nbf?: number;

  // A unix timestamp (seconds since the epoch.)
  // Users cannot join a meeting in this room after this time. Default is <not set>.
  exp?: number;

  // How many people are allowed in this room at the same time.
  // Both the default and maximum values depend on the plan that the domain is subscribed to.
  maxParticipants?: number;

  // Skip the initial meeting join page and go straight into the call.
  // Default is true for api-created rooms and false for dashboard-created rooms.
  autojoin?: boolean;

  // If a room is non-public, and a user isn't logged in and doesn't have a meeting token,
  // then let them "knock" to request access to the room.
  // Default is false for api-created rooms and true for dashboard-created rooms.
  enableKnocking?: boolean;

  // Default is true.
  enableScreenshare?: boolean;

  // Default is false.
  enableChat?: boolean;

  // Always start with camera off when a user joins a meeting in the room.
  // Default is false.
  startVideoOff?: boolean;

  // Always start with microphone muted when a user joins a meeting in the room.
  // Default is false.
  startAudioOff?: boolean;

  // Only the meeting owners are allowed to turn on camera, unmute mic, and share screen.
  // Default is false.
  ownerOnlyBroadcast?: boolean;

  // Recording is enabled for the room.
  // Allowed values are "cloud", "local", and <not set>.
  // Default is <not set>.
  enableRecording?: Recording;

  // If there's a meeting going on at room exp time, end the meeting by kicking everyone out.
  // This behavior can be overridden by setting eject properties of a meeting token.
  ejectAtRoomExp?: boolean;

  // Eject a meeting participant this many seconds after the participant joins the meeting.
  // You can use this is a default length limit to prevent long meetings.
  // This can be overridden by setting eject properties of a meeting token.
  ejectAfterElapsed?: boolean;

  // The default language for the video call UI, for this room.
  // You can override this in a user's meeting token.
  // You can also set the language dynamically using the front-end library setDailyLang() method.
  // Currently supported languages are en and fr.
  // You can also set this to user, which will use the browser's current language setting (if it is English or French).
  lang?: "en" | "fr" | "user";
}

export class Daily {
  private token: string;
  private client: AxiosInstance;

  public constructor(token: string) {
    this.token = token;
    this.client = Axios.create({
      baseURL: "https://api.daily.co/v1",
      timeout: 15000,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.client
      .request({
        ...config,
        data: config.data ? snakeCase(config.data) : undefined,
        params: config.params ? snakeCase(config.params) : undefined,
      })
      .then((res) => camelCase(res.data));
  }

  // Get top-level configuration of your domain
  // https://docs.daily.co/reference#get-domain-configuration
  public async domainConfig(): Promise<DomainResponse> {
    return this.request({ method: "GET", url: "/" });
  }

  // Set top-level configuration options for your domain
  // https://docs.daily.co/reference#set-domain-configuration
  public async updateDomainConfig(data: DomainConfig): Promise<DomainConfig> {
    return this.request({ method: "POST", url: "/", data });
  }

  // List rooms
  // https://docs.daily.co/reference#list-rooms
  public async rooms(params?: PaginatedRequest): Promise<PaginatedResponse<RoomConfig>> {
    return this.request({ method: "GET", url: "/rooms", params });
  }

  // Create a room
  // https://docs.daily.co/reference#create-room
  public async createRoom(data: CreateRoomRequest): Promise<Room> {
    return this.request({ method: "POST", url: "/rooms", data });
  }

  // Get info about a room
  // https://docs.daily.co/reference#get-room-configuration
  public async room(name: string): Promise<Room> {
    return this.request({ method: "GET", url: `/rooms/${name}` });
  }

  // Set a room's privacy and config properties
  // https://docs.daily.co/reference#set-room-configuration
  public async updateRoom(name: string, data: Room): Promise<Room> {
    return this.request({ method: "POST", url: `/rooms/${name}`, data });
  }

  // Delete room
  // https://docs.daily.co/reference#delete-room
  public async deleteRoom(name: string): Promise<DeleteResponse> {
    return this.request({ method: "DELETE", url: `/rooms/${name}` });
  }

  // Create a new meeting token.
  // https://docs.daily.co/reference#meeting-tokens
  public async createMeetingToken(data: MeetingToken): Promise<MeetingTokenResponse> {
    const req = { properties: data };
    return this.request({ method: "POST", url: "/meeting-tokens", data: req });
  }

  // https://docs.daily.co/reference#validate-meeting-token
  // Validate a meeting token
  public async meetingToken(token: string): Promise<MeetingToken> {
    return this.request({ method: "GET", url: `/meeting-tokens/${token}` });
  }
}
