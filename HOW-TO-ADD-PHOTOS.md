# How to add a new mehndi photo

No database, no admin login. A photo is just a file in a folder.
Three steps: **put the file in → add one line → push**.

---

## Step 1 — Get the photo onto the computer

Save it from your phone (WhatsApp Web, email, or USB cable).

Rename it to something short with **no spaces**, and end it with `.jpg`:

| Bad                              | Good                        |
| -------------------------------- | --------------------------- |
| `WhatsApp Image 2026-07-17.jpeg` | `arabic-floral-vine.jpg`    |
| `IMG 4021 (2).JPG`               | `simple-party-design.jpg`   |

A good habit: start the name with the category (`bridal-`, `arabic-`…).

**Size:** aim for under ~500 KB per photo. Phone photos are often 3–5 MB,
which makes the gallery slow on mobile data. If a photo is big, resize the
long side to about 1200–1600 pixels before adding it.

---

## Step 2 — Put it in the gallery folder

Copy the file into:

```
images/gallery/
```

---

## Step 3 — Add one line to the list

Open `js/app.js`. At the top you'll see the gallery list. Add a line:

```js
const GALLERY_IMAGES = [
  { id:'g1', url:'images/gallery/bridal-lotus-mandala.jpg', title:'Bridal Lotus Mandala', category:'bridal' },
  ...
  { id:'g6', url:'images/gallery/arabic-floral-vine.jpg',   title:'Arabic Floral Vine',   category:'arabic' },   // <-- new
];
```

Four things to fill in:

| Field      | What to put                                                        |
| ---------- | ------------------------------------------------------------------ |
| `id`       | Any unique text. Just carry on: `g6`, `g7`, `g8`…                   |
| `url`      | `images/gallery/` + your exact filename (capitals matter)           |
| `title`    | The caption shown on the photo                                      |
| `category` | **One** of: `bridal` `arabic` `indo-arabic` `traditional` `simple`  |

`category` must match one of those five exactly, or the photo will only ever
show under "All" and vanish when a visitor clicks a filter.

Photos appear in the order they're listed. To feature your best work first,
put it at the top of the list.

---

## Step 4 — Check it locally (optional but wise)

Run this in the project folder, then open http://localhost:3000

```
npx serve . -l 3000
```

Press `Ctrl+C` to stop it. If the photo doesn't appear, it's almost always a
filename typo — see Troubleshooting below.

---

## Step 5 — Publish

```
git add .
git commit -m "Add new mehndi photo"
git push
```

GitHub rebuilds the site automatically. Give it 1–2 minutes, then hard-refresh
the live page (`Ctrl+Shift+R`).

---

## How many photos can I add?

**Technically:** thousands. GitHub Pages allows a published site up to ~1 GB.
At ~300 KB per photo that's roughly 3,000 photos. You will not hit this.

**Practically:** keep it to about **30–60**. Not a rule — a judgement about
your visitors:

- The page loads photos lazily (only as the visitor scrolls), so a big gallery
  won't freeze the site.
- But a bride scrolling 200 photos on phone data will give up. A tight gallery
  of your best work books more weddings than an exhaustive archive.
- Rough sizing: 40 photos × 400 KB ≈ 16 MB total. Comfortable.

So the honest limit is taste, not technology. Add your best; retire old ones.

Other GitHub limits, for reference: no single file over 100 MB, and 100 GB of
visitor traffic per month. A photo gallery this size won't come close.

---

## Troubleshooting

**Photo doesn't show / broken icon**
The `url` doesn't match the real filename. Check spelling, capitals, and that
it ends in `.jpg` not `.jpeg`. `Bridal.JPG` and `bridal.jpg` are different
files on the live site, even though Windows treats them as the same.

**Photo shows under "All" but disappears when I click a filter**
The `category` is misspelled. It must be exactly one of the five.

**A filter button shows a blank page**
No photos in that category yet. Add one, or hide that button.

**Page looks unchanged after pushing**
Wait 2 minutes, then hard-refresh with `Ctrl+Shift+R`. Your browser caches the
old version.

---

## Your other details

Name, tagline, phone, Instagram, location, and the stat numbers all live in
`js/config.js`. Edit that one file — no need to touch anything else.
