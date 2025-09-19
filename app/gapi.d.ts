/// <reference types="gapi" />
/// <reference types="gapi.auth2" />
/// <reference types="gapi.client.sheets" />
/// <reference types="gapi.client.drive" />

export {}; // <- Important to make this a module

declare global {
  interface Window {
    gapi: typeof gapi;
  }
}
