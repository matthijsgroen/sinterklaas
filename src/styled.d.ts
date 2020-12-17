// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    windowWidth: number;
    windowHeight: number;

    colors: {
      main: string;
      secondary: string;
    };
  }
}
