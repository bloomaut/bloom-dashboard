export function getYouTubeEmbedURL(url: string) {
  try {
    const parsedUrl = new URL(url);
    let videoId = null;

    if (parsedUrl.hostname === "youtu.be") {
      // Short link format
      videoId = parsedUrl.pathname.slice(1);
    } else if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        // Standard watch link
        videoId = parsedUrl.searchParams.get("v");
      } else if (parsedUrl.pathname.startsWith("/embed/")) {
        // Already embed format
        videoId = parsedUrl.pathname.split("/embed/")[1];
      }
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch (err) {
    return null;
  }
}

export const videos = [
  "https://youtu.be/vRbRDhwIGJY",
  "https://youtu.be/OV7qwtCqMYg",
  "https://youtu.be/JWRdmqp_paE",
  "https://youtu.be/TfjGgSqCmN0",
  "https://youtu.be/OLWH0k30Y8s",
  "https://youtu.be/X6gLd0NM29A",
  "https://youtu.be/SkhqVZK6_Xs",
  "https://youtu.be/CD1RonkWFZ0",
  "https://youtu.be/tjtAWSSHpxc",
  "https://youtu.be/I-gKYufyAfo",
  "https://youtu.be/F3XqsIoJEEM",
  "https://youtu.be/hCHBd1J4XSI",
  "https://youtu.be/Ejr3Cyg3xhs",
  "https://youtu.be/xJxMP4zpeMo",
  "https://youtu.be/rs9caWO35lc",
  "https://youtu.be/Bq4xlcHhmLs",
  "https://youtu.be/Wm6PNJO_dCs",
  "https://youtu.be/qdBYOTkdiFc",
  "https://youtu.be/t3apcMfbSXM",
  "https://youtu.be/vFsapPyyCvQ",
  "https://youtu.be/ldqmG9SKwXY",
  "https://youtu.be/Wm26zGYaGTk",
  "https://youtu.be/9IbDbIz6SL8",
  "https://youtu.be/foQSPNCCwXI",
  "https://youtu.be/_tMCIZgpuAo",
  "https://youtu.be/pzbZO71vQF0",
  "https://youtu.be/vDPnEa9UkSM",
  "https://youtu.be/mFQVghFfbcI",
  "https://youtu.be/59UpnaIgwf4",
  "https://youtu.be/kiBjRU8z4Mg",
  "https://youtu.be/Ia_labILc0Y",
  "https://youtu.be/mN6laL4vP4Q",
  "https://youtu.be/4PJBoUEsNxI",
  "https://youtu.be/MHs3uZq7AtU",
  "https://youtu.be/CnxEAbyjhqg",
  "https://youtu.be/CWSIJC6oNG4",
  "https://youtu.be/nTazfYiikRc",
  "https://youtu.be/9trQ62tGxS4",
  "https://youtu.be/tsSthdNw_GA",
  "https://youtu.be/jBZJD1H_OzM",
  "https://youtu.be/dOKHMEsEQMk",
  "https://youtu.be/h1ZzUOplugM",
  "https://youtu.be/Zn6lyJiUyJg",
  "https://youtu.be/r9VzQvWrg9U",
  "https://youtu.be/rrqHs4YwvC0",
  "https://youtu.be/k3i7z0fCNJM",
  "https://youtu.be/TANHNZDOFcc",
  "https://youtu.be/XOWSjqBtUls",
  "https://youtu.be/0ppw_eIRD-E",
  "https://youtu.be/7gUQ9HO-cBY",
  "https://youtu.be/CGSBYqZvVu4",
  "https://youtu.be/vxXo0YBAAQ0",
  "https://youtu.be/dO8pIaNu3R4",
  "https://youtu.be/P2TLrXDfOSk",
  "https://youtu.be/i-o26SY9FMk",
  "https://youtu.be/tGSWEwWg3JQ",
  "https://youtu.be/nSp2K4AJTYA",
  "https://youtu.be/WoUaf36dmR4",
  "https://youtu.be/C4xxXaWhlC0",
  "https://youtu.be/cNWHCObs60s",
  "https://youtu.be/uX6Nmyi3u68",
  "https://youtu.be/DxZmYxT-q5I",
  "https://youtu.be/TUdAFO8RNqc",
  "https://youtu.be/cdjC4M2yzw4",
  "https://youtu.be/M2sa-Zg7umU",
  "https://youtu.be/tQCQSOoSzRw",
  "https://youtu.be/7KQIVPlHMyY",
  "https://youtu.be/bO-5iSjrONw",
  "https://youtu.be/Gdf92yuuG94",
  "https://youtu.be/EnTEcVJ2_eA",
  "https://youtu.be/gav0kechwaE",
  "https://youtu.be/-kjO6HXDJ2c",
  "https://youtu.be/djAlSP4TcEE",
  "https://youtu.be/t4fG_h2hboI",
  "https://youtu.be/OayAGuXb9fA",
  "https://youtu.be/eSmWBNtmeJU",
  "https://youtu.be/8gT_IF5DoLw",
  "https://youtu.be/M5sa3eC-rTs",
  "https://youtu.be/VHT3xi2z6-4",
  "https://youtu.be/ZjYrs83UHUo",
  "https://youtu.be/rqq5VTAWIaY",
  "https://youtu.be/Z-KtcItj3A0",
  "https://youtu.be/wtLWOELCwis",
  "https://youtu.be/o75tywpP7FE",
  "https://youtu.be/wha0dBv46NI",
  "https://youtu.be/c9ufvPIXjNo",
  "https://youtu.be/s4ztsLi_lh4",
  "https://youtu.be/ojIB4738bqk",
  "https://youtu.be/yWFGSaNZw9E",
  "https://youtu.be/BIaXK7Wey3o",
  "https://youtu.be/JgxKXRUGzRc",
  "https://youtu.be/m8XNFJLHQk4",
  "https://youtu.be/ZabfiigdG3M",
  "https://youtu.be/lNJ_mlqNtYU",
  "https://youtu.be/5bEq2w2KgCs",
  "https://youtu.be/XdCfQMUZnQk",
  "https://youtu.be/gNw4p79anag",
  "https://youtu.be/nkJ5IxGRAFI",
  "https://youtu.be/wGACqlv54NY",
  "https://youtu.be/sFzeFJijJcE",
  "https://youtu.be/UR_09L2bqMg",
  "https://youtu.be/mMR1V5u4ANc",
  "https://youtu.be/7Lk0p9LzVP4",
  "https://youtu.be/ZPRjvZiudUc",
  "https://youtu.be/6bxToXB3jec",
  "https://youtu.be/K0n0b2Ru5Ic",
  "https://youtu.be/GwChorDogf8",
  "https://youtu.be/rqS3ypveRAM",
];
