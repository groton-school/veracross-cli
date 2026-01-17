import * as OAuth2 from "@oauth2-cli/qui-cli/dist/OAuth2.js";
import path from "node:path";

export type Credentials = OAuth2.Credentials & {
  school_route: string;
};

export class Client extends OAuth2.Client {
  private school_route: string;

  public constructor({ school_route, ...credentials }: Credentials) {
    super(credentials);
    this.school_route = school_route;
  }

  public request(...args: Parameters<OAuth2.Client["request"]>) {
    let [url] = args;
    const [, ...rest] = args;
    url = new URL(
      path.join(this.school_route, url.toString()),
      "https://api.veracross.com",
    );
    return super.request(url, ...rest);
  }
}
