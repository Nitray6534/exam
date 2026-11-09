import { createElement } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Pemutar YouTube: WebView di Android/iOS, iframe biasa di versi web.
export default function VideoPlayer({ youtubeId, title }) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`;

  if (Platform.OS === 'web') {
    return createElement('iframe', {
      src,
      title,
      referrerPolicy: 'strict-origin-when-cross-origin',
      allow: 'autoplay; encrypted-media; picture-in-picture',
      allowFullScreen: true,
      style: { width: '100%', height: '100%', border: 0 },
    });
  }

  // Dibungkus HTML dengan baseUrl https agar YouTube menerima referrer yang valid.
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;background:#000}iframe{width:100%;height:100%;border:0}</style></head><body><iframe src="${src}" title="${title}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></body></html>`;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <WebView
        source={{ html, baseUrl: 'https://skilllearn.app' }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        javaScriptEnabled
        style={{ flex: 1, backgroundColor: '#000' }}
      />
    </View>
  );
}
