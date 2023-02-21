# kuroneko
Nya! A neko based world in early stages of development built with threejs
## Running locally
1. Download/clone the repository
2. `npm install`
3. `npm run dev`

## todo
- [ ] improve performance

## notes
This website is hosted on cloudflare pages, and if I'm not mistaken, they recently decreased the maximum file size for `_worker.js` file to 1MB, and due to the ungodly amount of imports that three.js requires, the hosted page is not being updated ATM. I have sent a request to increase the `_worker.js` file size limit to 5MB (project's `_worker.js` now ~3MB), hopefully they would grant so the page updates to the newest :)
