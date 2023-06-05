declare module "hls.js" {
    export default class  Hls{
        static Events: Record<string, string>;
        currentLevel: number;
        levels: any;

        destroy();

        attachMedia(videoElement: HTMLVideoElement)

        loadSource(url: string)

        on(MANIFEST_PARSED: string, callback: () => void)

        static isSupported()
    }
}