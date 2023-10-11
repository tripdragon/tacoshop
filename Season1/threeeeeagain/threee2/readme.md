

the core of the AR is webXR but ios does not handle this AT TALL
so we have to port it through https://launch.variant3d.com/
which is sending Apples : "App Clips" api to an app launchar.app
SUPPOSEDLY this means everything is pure WebXR then instead of say AR.js
or 8thWall. This service still costs muny at scale. But unlimited dev demo space roughly
5k views/month



touch index.html
touch main.js
mkdir public

npm install --save three
npm install --save-dev vite

npx vite

npx vite build
or
npx vite build --watch

test with
cd dist
python3 -m http.server 9000


you need to fix the paths to make github happy
// vite.config.js

export default {
  base: './'
}
