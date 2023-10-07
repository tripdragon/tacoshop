

touch index.html
touch main.js
mkdir public

npm install --save three
npm install --save-dev vite

npx vite

npx vite build

test with
cd dist
python3 -m http.server 9000


you need to fix the paths to make github happy
// vite.config.js

export default {
  base: './'
}
