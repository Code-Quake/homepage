import axios, { AxiosError } from "axios";

class WebSocketStore {
  private wsActive = false;
  private ws: WebSocket | null = null;
  private token = "CgDSJh9yfAUV76N";
  private wsUrl = "ws://192.168.68.61:3000/stream?token=CgDSJh9yfAUV76N";
  public user: any = { name: "unknown", admin: false, id: -1 };

  private tokenCache: string | null = null;
  private reconnectTimeoutId: number | null = null;
  private reconnectTime = 7500;
  public loggedIn = false;
  public authenticating = false;
  public connectionErrorMessage: string | null = null;

  public listen = (callback: (msg: any) => void) => {
    if (!this.token || this.wsActive) {
      return;
    }
    this.wsActive = true;

    const ws = new WebSocket(this.wsUrl, "ws");

    ws.addEventListener("error", (event) => {
      console.log("WebSocket error: ", event);
    });

    ws.onopen = () => {
      this.wsActive = true;
    };

    ws.onerror = (e) => {
      this.wsActive = false;
      console.log("WebSocket connection errored", e);
    };

    ws.onmessage = (data) => callback(JSON.parse(data.data));

    ws.onclose = () => {
      this.wsActive = false;
      this.tryAuthenticate()
        .then(() => {
          console.log(
            "WebSocket connection closed, trying again in 30 seconds."
          );
          setTimeout(() => this.listen(callback), 30000);
        })
        .catch((error: AxiosError) => {
          if (error?.response?.status === 401) {
            console.log(
              "Could not authenticate with client token, logging out."
            );
          }
        });
    };

    this.ws = ws;
  };

  public tryReconnect = (quiet = false) => {
    this.tryAuthenticate().catch(() => {
      if (!quiet) {
        console.log("Reconnect failed");
      }
    });
  };

  private readonly connectionError = (message: string) => {
    this.connectionErrorMessage = message;
    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId);
    }
    this.reconnectTimeoutId = window.setTimeout(
      () => this.tryReconnect(true),
      this.reconnectTime
    );
    this.reconnectTime = Math.min(this.reconnectTime * 2, 120000);
  };

  public logout = async () => {
    // await axios
    //   .get(config.get("url") + "client")
    //   .then((resp: AxiosResponse<IClient[]>) => {
    //     resp.data
    //       .filter((client) => client.token === this.tokenCache)
    //       .forEach((client) =>
    //         axios.delete(config.get("url") + "client/" + client.id)
    //       );
    //   })
    //   .catch(() => Promise.resolve());
    // window.localStorage.removeItem(tokenKey);
    this.tokenCache = null;
    this.loggedIn = false;
  };

  public tryAuthenticate = async (): Promise<any> => {
    if (this.token === "") {
      return Promise.reject();
    }

    return axios
      .create()
      .get(this.wsUrl + "/current/user", {
        headers: { "X-Gotify-Key": this.token },
      })
      .then((passThrough) => {
        this.user = passThrough.data;
        this.loggedIn = true;
        this.connectionErrorMessage = null;
        this.reconnectTime = 7500;
        return passThrough;
      })
      .catch((error: AxiosError) => {
        if (!error || !error.response) {
          this.connectionError("No network connection or server unavailable.");
          return Promise.reject(error);
        }

        if (error.response.status >= 500) {
          this.connectionError(
            `${error.response.statusText} (code: ${error.response.status}).`
          );
          return Promise.reject(error);
        }

        this.connectionErrorMessage = null;

        if (error.response.status >= 400 && error.response.status < 500) {
          this.logout();
        }
        return Promise.reject(error);
      });
  };

  public close = () => this.ws?.close(1000, "WebSocketStore#close");
}

//export const { listen, close, tryAuthenticate, connectionErrorMessage, logout } = new WebSocketStore();
const singleton = new WebSocketStore();
export default singleton;