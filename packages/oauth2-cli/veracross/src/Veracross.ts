import * as OAuth2 from "@oauth2-cli/qui-cli/dist/OAuth2.js";
import { Client } from "./Client.js";
import path from "node:path";
import { Colors } from "@qui-cli/colors";

export * from "./Client.js";
export {
  FileStorage,
  TokenStorage,
  EnvironmentStorage,
} from "@oauth2-cli/qui-cli/dist/OAuth2.js";

export type Configuration = OAuth2.Configuration & {
  schoolRoute: string;
};

export type ConfigurationProposal = OAuth2.ConfigurationProposal & {
  schoolRoute?: string;
};

export class VeracrossPlugin extends OAuth2.OAuth2Plugin<Client> {
  private schoolRoute: string | undefined = undefined;

  public constructor(name = "@oauth2-cli/veracross") {
    super(name);
    this.configure({
      man: {
        heading: "Veracross API options",
      },
      env: {
        clientId: "VERACROSS_CLIENT_ID",
        clientSecret: "VERACROSS_CLIENT_SECRET",
        redirectUri: "VERACROSS_REDIRECT_URI",
        tokenPath: "VERACROSS_TOKEN_PATH",
        accessToken: "VERACROSS_ACCESS_TOKEN",
      },
      suppress: {
        tokenPath: true,
        authorizationEndpoint: true,
        tokenEndpoint: true,
      },
    });
  }

  public configure({ schoolRoute, ...proposal }: ConfigurationProposal = {}) {
    if (schoolRoute) {
      this.schoolRoute = schoolRoute;
    }
    if (this.schoolRoute) {
      proposal.authorizationEndpoint = path.join(
        "https://accounts.veracross.com",
        this.schoolRoute,
        "oauth/authorize",
      );
      proposal.tokenEndpoint = path.join(
        "https://api.veracross.com",
        this.schoolRoute,
        "oauth/token",
      );
    }
    super.configure(proposal);
  }

  public options() {
    const options = super.options();
    options.opt = {
      schoolRoute: {
        description:
          `The unique school route for your Veracross instance. ` +
          `See ${Colors.url("https://api-docs.veracross.com/docs/docs/cd9d140be5811-using-the-data-api#base-url")} ` +
          `for more information.`,
        hint: Colors.quotedValue(`"api-example"`),
        default: this.schoolRoute,
      },
      ...options.opt,
    };
    return options;
  }

  protected instantiateClient(credentials: OAuth2.Credentials): Client {
    if (!this.schoolRoute) {
      throw new Error("School route must be defined.");
    }
    return new Client({
      school_route: this.schoolRoute,
      ...credentials,
    });
  }
}
