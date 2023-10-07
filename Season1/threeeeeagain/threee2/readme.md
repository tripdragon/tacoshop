

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
