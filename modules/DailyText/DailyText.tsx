// const fs = require("fs");
// const got = require("got");
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const vgmUrl = "https://www.vgmusic.com/music/console/nintendo/nes";

// got(vgmUrl)
//   .then((response) => {
//     const dom = new JSDOM(response.body);
//     console.log(dom.window.document.querySelector("title").textContent);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


  import Image from "next/image";
  import links from "../../data/links.json";
  import { LinkPreview } from "../ui/LinkPreview";
  import { Div } from "@/modules/ui/MovingBorder";

  import fs from "fs";
  import got from "got";
  import { JSDOM } from "jsdom";


  const getText = () =>{
    const vgmUrl = "https://www.vgmusic.com/music/console/nintendo/nes";
    got(vgmUrl)
      .then((response) => {
        const dom = new JSDOM(response.body);
        console.log(dom.window.document.querySelector("title")!.textContent);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getText();

  const Links = (): JSX.Element => {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        Hi there
      </div>
    );
  };

  export default Links;
