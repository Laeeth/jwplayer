import { Features } from 'environment/environment';
import { isAndroidHls } from 'providers/html5-android-hls';
import { isYouTube, isRtmp } from 'utils/validator';
import video from 'utils/video';

const SupportsMatrix = [
    {
        name: 'youtube',
        supports: function (source) {
            return (isYouTube(source.file, source.type));
        }
    },
    {
        name: 'html5',
        supports: function (source) {
            var MimeTypes = {
                aac: 'audio/mp4',
                mp4: 'video/mp4',
                f4v: 'video/mp4',
                m4v: 'video/mp4',
                mov: 'video/mp4',
                mp3: 'audio/mpeg',
                mpeg: 'audio/mpeg',
                ogv: 'video/ogg',
                ogg: 'video/ogg',
                oga: 'video/ogg',
                vorbis: 'video/ogg',
                webm: 'video/webm',
                // The following are not expected to work in Chrome
                f4a: 'video/aac',
                m3u8: 'application/vnd.apple.mpegurl',
                m3u: 'application/vnd.apple.mpegurl',
                hls: 'application/vnd.apple.mpegurl'
            };

            var file = source.file;
            var type = source.type;
            var mimeType = source.mimeType;

            var isAndroidHLS = isAndroidHls(source);
            if (isAndroidHLS !== null) {
                return isAndroidHLS;
            }

            // Ensure RTMP files are not seen as videos
            if (isRtmp(file, type)) {
                return false;
            }

            // Not OK to use HTML5 with no extension
            if (!MimeTypes[type] && !mimeType) {
                return false;
            }

            // Last, but not least, we ask the browser
            // (But only if it's a video with an extension known to work in HTML5)
            if (video.canPlayType) {
                var result = video.canPlayType(MimeTypes[type] || mimeType);
                return !!result;
            }
            return false;
        }
    },
    {
        name: 'flash',
        supports: function (source) {
            var flashExtensions = {
                flv: 'video',
                f4v: 'video',
                mov: 'video',
                m4a: 'video',
                m4v: 'video',
                mp4: 'video',
                aac: 'video',
                f4a: 'video',
                mp3: 'sound',
                mpeg: 'sound',
                smil: 'rtmp'
            };
            var PLAYABLE = Object.keys(flashExtensions);
            if (!Features.flash) {
                return false;
            }

            var file = source.file;
            var type = source.type;

            if (isRtmp(file, type)) {
                return true;
            }

            return PLAYABLE.indexOf(type) > -1;
        }
    }
];

export default SupportsMatrix;
